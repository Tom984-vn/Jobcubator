import httpx 
from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks, status
from typing import List, Dict, Any, Optional
import logging
from datetime import datetime # Cần thiết cho trường applicationDeadline

# Import các client và hàm dependencies
from AI_service.core.config import settings
from AI_service.core.dependencies import DBClientDep
from AI_service.service.ai.vectordb import VectorDBClient

# Import Pydantic BaseModel từ file schemas đã sửa
from AI_service.schemas.schemas import JobPostData, UserProfileData

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/sync", tags=["Sync"]) 

# --- HÀM XỬ LÝ NỀN CHO CẬP NHẬT/UPSERT (ASYNC) ---

async def process_job_upsert(job_data: JobPostData, db_client: VectorDBClient):
    """
    Logic thực hiện việc upsert dữ liệu Job vào VectorDB (Async).
    Hàm này chỉ đơn giản là chuyển tiếp dữ liệu đã được xác thực tới VectorDBClient.
    """
    job_id = job_data.id
    logger.info(f"[BG_TASK] Bắt đầu xử lý Job ID: {job_id}")
    try:
        # Chuyển Pydantic model thành dict và gói nó trong một list
        # VectorDBClient.add_jobs sẽ xử lý phần còn lại (tạo text, embedding, metadata)
        await db_client.add_jobs([job_data.model_dump(mode='json')])
        logger.info(f"✅ Đồng bộ Job ID {job_id} hoàn tất.")
    except Exception as e:
        logger.error(f"❌ Lỗi trong quá trình xử lý nền cho Job ID {job_id}: {e}")

async def process_user_upsert(user_data: UserProfileData, db_client: VectorDBClient):
    """
    Logic thực hiện việc upsert dữ liệu User Profile vào VectorDB (Async).
    Hàm này chỉ đơn giản là chuyển tiếp dữ liệu đã được xác thực tới VectorDBClient.
    """
    user_id = user_data.id
    logger.info(f"[BG_TASK] Bắt đầu xử lý User ID: {user_id}")
    try:
        # Sửa tên hàm từ add_users -> add_user_cv
        # Chuyển Pydantic model thành dict và gói nó trong một list
        # VectorDBClient.add_user_cv sẽ xử lý phần còn lại
        await db_client.add_user_cv([user_data.model_dump(mode='json')])
        logger.info(f"✅ Đồng bộ User ID {user_id} hoàn tất.")
    except Exception as e:
        logger.error(f"❌ Lỗi trong quá trình xử lý nền cho User ID {user_id}: {e}")


# --- ENDPOINTS ---

@router.put("/job")
async def sync_job_post(
    job_data: JobPostData,
    background_tasks: BackgroundTasks,
    # SỬA LỖI: Dùng DBClientDep trực tiếp làm type hint, không bọc trong Depends()
    db_client: DBClientDep
):
    background_tasks.add_task(process_job_upsert, job_data, db_client)  # pass instance
    return {"message": f"Job {job_data.id} đang xử lý nền."}

@router.get("/job/{job_id}", summary="Lấy thông tin chi tiết của một Job từ VectorDB")
async def get_synced_job_details(
    job_id: str,
    db_client: DBClientDep
) -> Dict[str, Any]:
    """
    Kiểm tra xem một Job đã được đồng bộ vào VectorDB hay chưa và trả về thông tin của nó.
    """
    logger.info(f"Nhận request kiểm tra Job ID: {job_id}")
    job_details = await db_client.get_job_by_id(job_id)

    if job_details is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Không tìm thấy Job với ID '{job_id}' trong VectorDB.")

    return job_details

@router.get("/user/{user_id}", summary="Lấy thông tin chi tiết của một User từ VectorDB")
async def get_synced_user_details(
    user_id: str,
    db_client: DBClientDep
) -> Dict[str, Any]:
    """
    Kiểm tra xem một User Profile đã được đồng bộ vào VectorDB hay chưa và trả về thông tin của nó.
    """
    logger.info(f"Nhận request kiểm tra User ID: {user_id}")
    user_details = await db_client.get_user_by_id(user_id)

    if user_details is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Không tìm thấy User với ID '{user_id}' trong VectorDB.")

    return user_details

@router.put("/user", summary="Đồng bộ (Upsert) User Profile mới/cập nhật vào VectorDB", status_code=status.HTTP_202_ACCEPTED)
async def sync_user_post(
    user_data: UserProfileData,
    background_tasks: BackgroundTasks,
    # SỬA LỖI: Dùng DBClientDep trực tiếp làm type hint
    db_client: DBClientDep
) -> Dict[str, str]:
    """
    Nhận yêu cầu đồng bộ từ Backend khi một User Profile được tạo hoặc cập nhật.
    Truyền toàn bộ dữ liệu User vào BackgroundTasks.
    """
    logger.info(f"Nhận request đồng bộ/cập nhật User ID: {user_data.id}")
    
    # Truyền toàn bộ đối tượng user_data vào tác vụ nền
    background_tasks.add_task(process_user_upsert, user_data, db_client)
    
    return {"message": f"Yêu cầu đồng bộ User Profile ID {user_data.id} đã được chấp nhận và đang xử lý nền."}


@router.get("/status", summary="Kiểm tra trạng thái VectorDB")
async def get_sync_status(db_client: DBClientDep) -> Dict[str, Any]:
    # Logic kiểm tra sức khỏe và trả về trạng thái của VectorDB (giả định get_info là async)
    try:
        # SỬA LỖI: Gọi hàm get_info() đã được thêm vào vectordb.py
        info = await db_client.get_info()
        return {"status": "ok", "db_info": info}
    except Exception as e:
        logger.error(f"Lỗi khi kiểm tra trạng thái DB: {e}")
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=f"Không thể kết nối VectorDB: {e}"
        )

@router.delete("/clear/{collection_name}", summary="Xóa toàn bộ dữ liệu trong một collection (Cảnh báo)")
async def clear_collection_data(
    collection_name: str,
    db_client: DBClientDep
) -> Dict[str, str]:
    """
    Xóa toàn bộ dữ liệu khỏi một collection (ví dụ: 'jobs', 'user_profiles').
    """
    try:
        # SỬA LỖI: Gọi đúng tên hàm là clear_all_data và truyền đúng tham số
        await db_client.clear_all_data(collection_type=collection_name)
        return {"message": f"Yêu cầu xóa dữ liệu collection '{collection_name}' đã được gửi."}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Lỗi khi xóa collection '{collection_name}': {e}"
        )