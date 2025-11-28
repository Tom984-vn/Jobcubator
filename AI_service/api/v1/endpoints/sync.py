import httpx 
from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks, status
from typing import List, Dict, Any, Optional
import logging

# Import các client và hàm dependencies
from AI_service.core.config import settings
from AI_service.core.dependencies import get_vector_db_client, get_backend_client
from AI_service.service.client.backend_client import BackendClient
from AI_service.service.ai.vectordb import VectorDBClient

# Giả định schema này tồn tại để xử lý dữ liệu Job
from AI_service.schemas.schemas import JobPostData 

logger = logging.getLogger(__name__)
# Đổi tiền tố router thành /sync
router = APIRouter(prefix="/sync", tags=["Sync"]) 

# --- HÀM XỬ LÝ NỀN CHO CẬP NHẬT/UPSERT (ASYNC) ---

async def process_job_upsert(job_id: str, db_client: VectorDBClient, backend_client: BackendClient):
    """
    Logic thực hiện việc fetch dữ liệu Job và upsert vào VectorDB (Async).
    """
    job_data_raw = await backend_client.get_job_details(job_id)
    
    if job_data_raw is None:
        logger.warning(f"[BG_TASK] Bỏ qua Job ID {job_id} do không tìm thấy hoặc lỗi fetch từ Backend.")
        return # Dừng nếu không lấy được dữ liệu

    try:
        # 1. Lấy dữ liệu Job chi tiết từ Backend bằng httpx.AsyncClient
            job_post_schema = JobPostData(**job_data_raw)
            
            # Chuẩn bị dữ liệu để truyền vào add_jobs 
            job_dict_for_db = {
                "id": job_post_schema.id,
                "title": job_post_schema.title,
                # Giả sử mô tả chi tiết nằm trong descriptionPath
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
            
            job_data = [job_dict_for_db]
            
    except httpx.HTTPStatusError as e:
        logger.error(f"[BG_TASK] LỖI HTTP khi lấy Job ID {job_id}: Mã {e.response.status_code}. Nội dung: {e.response.text}")
        return # Dừng nếu lỗi API
    except Exception as e:
        logger.error(f"[BG_TASK] LỖI KHÔNG XÁC ĐỊNH khi lấy Job ID {job_id}: {e}")
        return # Dừng nếu lỗi khác

    # 2. Upsert vào VectorDB (Phải dùng AWAIT)
    try:
        # Giả định db_client.add_jobs là một async method hoặc có xử lý luồng bên trong
        await db_client.add_jobs(job_data) 
        
        logger.info(f"✅ Đồng bộ Job ID {job_id} hoàn tất.")
            
    except Exception as e:
        logger.error(f"❌ Lỗi VectorDB/Embedding trong quá trình xử lý nền cho Job ID {job_id}: {e}")

# --- DEPENDENCY ---

def get_sync_context(
    db_client: VectorDBClient = Depends(get_vector_db_client),
):
    """Dependency chỉ để lấy các client cần thiết cho việc đồng bộ."""
    return db_client

# --- ENDPOINT 1: CẬP NHẬT DỮ LIỆU (ĐƯỢC GỘP TỪ update.py) ---

@router.put("/job/{job_id}", summary="Đồng bộ (Upsert) Job Post mới/cập nhật vào VectorDB", status_code=status.HTTP_202_ACCEPTED)
async def sync_job_post(
    job_id: str, 
    background_tasks: BackgroundTasks,
    # Inject VectorDBClient
    db_client: VectorDBClient = Depends(get_vector_db_client), 
    # Inject BackendClient
    backend_client: BackendClient = Depends(get_backend_client)
) -> Dict[str, str]:
    """
    Nhận yêu cầu đồng bộ từ Backend khi một Job Post được tạo hoặc cập nhật.
    Thực hiện fetch dữ liệu chi tiết và upsert vào VectorDB trong Background.
    """
    logger.info(f"Nhận request đồng bộ/cập nhật Job ID: {job_id}")
    
    # Thêm tác vụ xử lý bất đồng bộ vào hàng đợi nền
    background_tasks.add_task(process_job_upsert, job_id, db_client, backend_client)
    
    return {"message": f"Yêu cầu đồng bộ Job ID {job_id} đã được chấp nhận và đang xử lý nền."}


# Thêm các endpoint quản lý khác vào đây (ví dụ: status, clear, trigger full sync)

# Ví dụ về endpoint tiện ích (Nếu bạn có)
@router.get("/status", summary="Kiểm tra trạng thái VectorDB")
def get_sync_status(db_client: VectorDBClient = Depends(get_sync_context)):
     # Logic kiểm tra sức khỏe và trả về trạng thái của VectorDB
    return {"status": "ok", "db_info": db_client.get_info()}

@router.delete("/clear", summary="Xóa toàn bộ dữ liệu Job trong VectorDB (Cảnh báo)")
def clear_job_data(db_client: VectorDBClient = Depends(get_sync_context)):
    # Logic xóa dữ liệu
    db_client.clear_collection("jobs")
    return {"message": "Yêu cầu xóa dữ liệu jobs đã được gửi."}
