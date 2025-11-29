import httpx 
from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks, status
from typing import List, Dict, Any, Optional
import logging

# Import các client và hàm dependencies
from AI_service.core.config import settings
from AI_service.core.dependencies import get_vector_db_client
from AI_service.service.ai.vectordb import VectorDBClient

# Giả định schema này tồn tại để xử lý dữ liệu Job
from AI_service.schemas.schemas import JobPostData, UserProfileData

logger = logging.getLogger(__name__)
# Đổi tiền tố router thành /sync
router = APIRouter(prefix="/sync", tags=["Sync"]) 

# --- HÀM XỬ LÝ NỀN CHO CẬP NHẬT/UPSERT (ASYNC) ---

async def process_job_upsert(job_data: JobPostData, db_client: VectorDBClient):
    """
    Logic thực hiện việc fetch dữ liệu Job và upsert vào VectorDB (Async).
    """
    job_id = job_data.id
    try:
            
            # Chuẩn bị dữ liệu để truyền vào add_jobs 
            job_dict_for_db = {
                "id": job_data.id,
                "title": job_data.title,
                # Giả sử mô tả chi tiết nằm trong descriptionPath
                "description": job_data.descriptionPath, 
                "metadatas": {
                    "title": job_data.title,
                    "group": job_data.category,
                    "location": job_data.location,
                    "workType": job_data.jobType,
                    "min_salary": job_data.minSalary if job_data.minSalary else 0,
                    "max_salary": job_data.maxSalary if job_data.maxSalary else 0,
                }
            }
            
            job_data = [job_dict_for_db]
            

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

async def process_user_upsert(user_data: UserProfileData, db_client: VectorDBClient):
    """
    Logic thực hiện việc upsert dữ liệu User Profile đã được nhận trực tiếp vào VectorDB (Async).
    
    Args:
        user_data: Đối tượng UserProfileData chứa toàn bộ thông tin User.
        db_client: Client kết nối tới VectorDB.
    """
    user_id = user_data.id
    logger.info(f"[BG_TASK] Bắt đầu xử lý User ID: {user_id} (Dữ liệu đã có sẵn).")
    
    try:
        # 1. Chuẩn bị dữ liệu để upsert vào VectorDB
        # Xây dựng một đoạn text ngắn gọn để đại diện cho User Profile
        user_text = (
            f"Hồ sơ người dùng: {user_data.fullName}. "
            f"Vị trí hiện tại/mong muốn: {user_data.position} tại {user_data.organization}. "
            f"Kinh nghiệm: {user_data.years_of_experience} năm. "
            f"Vị trí ưu tiên: {user_data.preferredLocation}. "
            f"Mức lương mong muốn: {user_data.minSalary} - {user_data.maxSalary}."
        )
        
        user_dict_for_db = {
            "id": user_data.id,
            "text": user_text,
            "metadatas": {
                "full_name": user_data.fullName,
                "position": user_data.position,
                "organization": user_data.organization,
                "years_of_experience": user_data.years_of_experience,
                "preferred_location": user_data.preferredLocation,
                "min_salary": user_data.minSalary,
                "max_salary": user_data.maxSalary,
            }
        }
            
        user_list = [user_dict_for_db]
            
        # 2. Upsert vào VectorDB (Giả định db_client có phương thức add_users)
        await db_client.add_user_cv(user_list) 
            
        logger.info(f"✅ Đồng bộ User ID {user_id} hoàn tất.")
            
    except Exception as e:
        logger.error(f"❌ Lỗi VectorDB/Embedding trong quá trình xử lý nền cho User ID {user_id}: {e}")



@router.put("/job", summary="Đồng bộ (Upsert) Job Post mới/cập nhật vào VectorDB", status_code=status.HTTP_202_ACCEPTED)
async def sync_job_post(
    job_data: JobPostData,
    background_tasks: BackgroundTasks,
    # Inject VectorDBClient
    db_client: VectorDBClient = Depends(get_vector_db_client)
) -> Dict[str, str]:
    """
    Nhận yêu cầu đồng bộ từ Backend khi một Job Post được tạo hoặc cập nhật.
    Thực hiện fetch dữ liệu chi tiết và upsert vào VectorDB trong Background.
    """
    logger.info(f"Nhận request đồng bộ/cập nhật Job ID: {job_data.id}")
    
    # Thêm tác vụ xử lý bất đồng bộ vào hàng đợi nền
    background_tasks.add_task(process_job_upsert, job_data.id, db_client)
    
    return {"message": f"Yêu cầu đồng bộ Job ID {job_data.id} đã được chấp nhận và đang xử lý nền."}

@router.put("/user", summary="Đồng bộ (Upsert) user Post mới/cập nhật vào VectorDB", status_code=status.HTTP_202_ACCEPTED)
async def sync_user_post(
    user_data: UserProfileData,
    background_tasks: BackgroundTasks,
    # Inject VectorDBClient
    db_client: VectorDBClient = Depends(get_vector_db_client)
) -> Dict[str, str]:
    logger.info(f"Nhận request đồng bộ/cập nhật user ID: {user_data.id}")
    
    # Thêm tác vụ xử lý bất đồng bộ vào hàng đợi nền
    background_tasks.add_task(process_user_upsert, user_data.id, db_client)
    
    return {"message": f"Yêu cầu đồng bộ Job ID {user.id} đã được chấp nhận và đang xử lý nền."}

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
