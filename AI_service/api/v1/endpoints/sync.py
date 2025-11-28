import httpx
from fastapi import APIRouter, Depends, BackgroundTasks, HTTPException, status
from typing import Dict, Any, List
import logging
from functools import lru_cache

from AI_service.core.config import settings 
from AI_service.core.dependencies import get_vector_db_client, VectorDBClient
from AI_service.schemas.schemas import JobPostData

# Thiết lập logging
logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/sync",
    tags=["Synchronization"],
)

# =======================================================
# HÀM CHẠY NGẦM (BACKGROUND TASK)
# Nhiệm vụ: Tải Job từ Backend, Vector hóa, và Upsert vào VectorDB
# =======================================================

async def process_job_upsert(job_id: str, db_client: VectorDBClient):
    """
    Thực hiện quy trình lấy dữ liệu Job, vector hóa và upsert vào VectorDB.
    Hàm này chạy trong một luồng riêng biệt (background) sau khi API trả về 200 OK.
    """
    logger.info(f"[BG_TASK] Bắt đầu xử lý Job ID: {job_id}")

    backend_url = f"{settings.BACKEND_API_URL}/api/job_posts/{job_id}"
    try:
        async with httpx.AsyncClient(timeout=10) as client:
            response = await client.get(backend_url)
            response.raise_for_status() 
            job_data_raw = response.json()
            logger.info(f"[BG_TASK] Đã tải dữ liệu Job ID {job_id} thành công.")
            
            # Giả định dữ liệu Job trả về là 1 Dict, cần phải bọc vào list cho add_jobs
            if not isinstance(job_data_raw, dict):
                 raise ValueError("Dữ liệu Job trả về không phải là dictionary.")
            
            # Tạo JobPostData Schema để validate và lấy metadatas chuẩn
            job_post_schema = JobPostData(**job_data_raw)
            
            # Chuẩn bị dữ liệu để truyền vào add_jobs
            # Chúng ta cần đảm bảo cấu trúc metadatas được truyền đúng
            job_dict_for_db = {
                "id": job_post_schema.id,
                "title": job_post_schema.title,
                "description": job_post_schema.descriptionPath,
                "metadatas": {
                    "title": job_post_schema.title,
                    "group": job_post_schema.category,
                    "location": job_post_schema.location,
                    "workType": job_post_schema.jobType,
                    "min_salary": job_post_schema.minSalary if job_post_schema.minSalary else 0,
                    "max_salary": job_post_schema.maxSalary if job_post_schema.maxSalary else 0,
                }
            }

    except httpx.HTTPStatusError as e:
        logger.error(f"[BG_TASK] LỖI HTTP khi lấy Job ID {job_id}: Mã {e.response.status_code}. Nội dung: {e.response.text}")
        return # Dừng nếu lỗi API
    except Exception as e:
        logger.error(f"[BG_TASK] LỖI KHÔNG XÁC ĐỊNH khi lấy Job ID {job_id}: {e}")
        return # Dừng nếu lỗi khác

    # 2. Vector hóa và Upsert vào VectorDB
    try:
        # Hàm add_jobs sẽ tự động gọi FPTAIClient để tạo vector
        db_client.add_jobs([job_dict_for_db])
        logger.info(f"[BG_TASK] ✅ Hoàn tất xử lý và upsert Job ID: {job_id}")
    except Exception as e:
        logger.error(f"[BG_TASK] ❌ LỖI VectorDB/Embedding cho Job ID {job_id}: {e}")


# =======================================================
# ENDPOINT PUBLIC (API được gọi từ Spring Boot)
# =======================================================

@router.put("/job/{job_id}", status_code=status.HTTP_202_ACCEPTED)
async def sync_job_post(
    job_id: str,
    tasks: BackgroundTasks, # FastAPI tự động inject
    db_client: VectorDBClient = Depends(get_vector_db_client), # Singleton VectorDB Client
    # data: SyncJobPost # Có thể thêm data nếu Backend muốn gửi payload trực tiếp (hiện không dùng)
):
    """
    Endpoint nhận yêu cầu đồng bộ Job Post từ Backend.
    Thực hiện Asynchronous (không đồng bộ) bằng BackgroundTasks.
    """
    
    logger.info(f"[SYNC] Nhận request đồng bộ Job ID: {job_id}")
    
    # Thêm tác vụ xử lý phức tạp vào hàng đợi nền
    # FastAPI sẽ trả về HTTP 202 ngay lập tức cho Backend
    tasks.add_task(process_job_upsert, job_id, db_client)
    
    return {"message": f"Job ID {job_id} đã được đưa vào hàng đợi xử lý đồng bộ."}


# =======================================================
# DEBUG ENDPOINT (Cho người vận hành)
# =======================================================

@router.get("/status")
def get_sync_status(
    db_client: VectorDBClient = Depends(get_vector_db_client)
):
    """Kiểm tra số lượng Job và User CV hiện tại trong VectorDB."""
    return db_client.update_status()

@router.delete("/clear/{collection_type}")
def clear_vector_data(
    collection_type: str,
    db_client: VectorDBClient = Depends(get_vector_db_client)
):
    """Xóa toàn bộ dữ liệu Job ('job'), User CV ('user_cv') hoặc cả hai ('all')."""
    if collection_type not in ['job', 'user_cv', 'all']:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="collection_type phải là 'job', 'user_cv', hoặc 'all'."
        )
    
    return db_client.clear_all_data(collection_type=collection_type)