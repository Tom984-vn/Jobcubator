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
    Logic thực hiện việc upsert dữ liệu Job vào VectorDB (Async), sử dụng schema mới.
    """
    job_id = job_data.id
    logger.info(f"[BG_TASK] Bắt đầu xử lý Job ID: {job_id}")
    
    try:
        # 1. Tổng hợp văn bản cho Embedding
        job_content_parts = [
            f"Vị trí: {job_data.title} tại {job_data.companyName or 'Công ty'}.",
            f"Danh mục: {job_data.category}. Địa điểm: {job_data.location}, Loại hình: {job_data.jobType}",
            f"Mức lương: {job_data.minSalary or 'Không rõ'} - {job_data.maxSalary or 'Không rõ'}.",
        ]
        
        # SỬA LỖI SYNTAXERROR: Sử dụng string concatenation đơn giản hoặc F-string an toàn hơn
        if job_data.description:
            clean_description = job_data.description.replace('\n', ' ').strip()
            # Sử dụng \n để phân tách header và nội dung
            job_content_parts.append(f"Mô tả công việc:\n{clean_description}")
            
        if job_data.requirements:
            clean_requirements = job_data.requirements.replace('\n', ' ').strip()
            job_content_parts.append(f"Yêu cầu:\n{clean_requirements}")
            
        if job_data.benefits:
            clean_benefits = job_data.benefits.replace('\n', ' ').strip()
            job_content_parts.append(f"Quyền lợi:\n{clean_benefits}")
            
        if job_data.tags:
             job_content_parts.append(f"Tags/Kỹ năng chính: {', '.join(job_data.tags)}")

        # Các phần được nối với nhau bằng \n\n để tạo thành văn bản lớn
        job_embedding_text = "\n\n".join(job_content_parts)
        
        # 2. Chuẩn bị Metadatas (Loại bỏ các trường văn bản lớn để tránh quá tải metadata)
        metadata = job_data.model_dump(
            exclude={'id', 'description', 'requirements', 'benefits'},
            mode='json' # Đảm bảo datetime được chuyển thành string chuẩn
        )
        # Đảm bảo tags là list/set trong metadata
        metadata['tags'] = list(job_data.tags) if job_data.tags else []

        # Chuẩn bị dữ liệu để truyền vào add_jobs (dưới dạng list)
        job_dict_for_db = {
            "id": job_data.id,
            "text": job_embedding_text, # Văn bản tổng hợp cho Embedding
            "metadatas": metadata 
        }
        
        jobs_list = [job_dict_for_db]
        
        # Gọi hàm add_jobs async mới trong VectorDBClient
        await db_client.add_jobs(jobs_list) 
            
        logger.info(f"✅ Đồng bộ Job ID {job_id} hoàn tất.")
            
    except Exception as e:
        logger.error(f"❌ Lỗi VectorDB/Embedding trong quá trình xử lý nền cho Job ID {job_id}: {e}")

async def process_user_upsert(user_data: UserProfileData, db_client: VectorDBClient):
    """
    Logic thực hiện việc upsert dữ liệu User Profile đã được nhận trực tiếp vào VectorDB (Async).
    Sử dụng trường 'history' mới để tạo embedding text chất lượng.
    """
    user_id = user_data.id
    logger.info(f"[BG_TASK] Bắt đầu xử lý User ID: {user_id} (Dữ liệu đã có sẵn).")
    
    try:
        # 1. Xây dựng lịch sử chi tiết (từ trường history mới)
        history_summary = []
        for entry in user_data.history:
            entry_type = entry.type.upper() if entry.type else "Mục nhập"
            org = entry.organization or "Không rõ"
            title = entry.title or "Không rõ"
            desc = (entry.description or "").replace('\n', ' ').strip()
            
            summary_part = ""
            if entry_type == 'EXPERIENCE':
                summary_part = f"Kinh nghiệm làm việc tại {org} ở vị trí '{title}'. Mô tả chính: {desc[:150]}..."
            elif entry_type == 'EDUCATION':
                summary_part = f"Học vấn tại {org}, đạt bằng cấp '{title}'."
            else:
                 summary_part = f"{entry_type} tại {org} với tiêu đề '{title}'. Mô tả: {desc[:150]}..."
            
            if summary_part:
                history_summary.append(summary_part)
            
        history_text = "\n- " + "\n- ".join(history_summary) if history_summary else "Không có lịch sử chi tiết."

        # 2. Xây dựng đoạn text ngắn gọn để đại diện cho User Profile (dùng cho embedding)
        user_text = (
            f"Hồ sơ người dùng: {user_data.fullName}. "
            f"Vị trí hiện tại/mong muốn: {user_data.position} tại {user_data.organization}. "
            f"Kinh nghiệm: {user_data.years_of_experience} năm. "
            f"Vị trí ưu tiên: {user_data.preferredLocation}. "
            f"Mức lương mong muốn: {user_data.minSalary} - {user_data.maxSalary}. "
            f"\n\nLịch sử chi tiết:\n{history_text}"
        )
        
        # 3. Chuẩn bị metadatas
        # Loại bỏ 'id' và 'history' (vì nó quá lớn) khỏi metadata
        metadata_dump = user_data.model_dump(exclude={'id', 'history'})
        
        user_dict_for_db = {
            "id": user_data.id,
            "text": user_text, # Dùng trường 'text' cho vector hóa
            "metadatas": metadata_dump
        }
            
        user_list = [user_dict_for_db]
            
        # 4. Upsert vào VectorDB (Giả định phương thức là add_users)
        await db_client.add_users(user_list) 
            
        logger.info(f"✅ Đồng bộ User ID {user_id} hoàn tất.")
            
    except Exception as e:
        logger.error(f"❌ Lỗi VectorDB/Embedding trong quá trình xử lý nền cho User ID {user_id}: {e}")

# --- DEPENDENCY ---

def get_sync_context(
    db_client: VectorDBClient = Depends(DBClientDep),
):
    """Dependency chỉ để lấy các client cần thiết cho việc đồng bộ."""
    return db_client


# --- ENDPOINTS ---

@router.put("/job")
async def sync_job_post(
    job_data: JobPostData,
    background_tasks: BackgroundTasks,
    db_client: VectorDBClient = Depends(DBClientDep)  # resolve instance here
):
    background_tasks.add_task(process_job_upsert, job_data, db_client)  # pass instance
    return {"message": f"Job {job_data.id} đang xử lý nền."}


@router.put("/user", summary="Đồng bộ (Upsert) User Profile mới/cập nhật vào VectorDB", status_code=status.HTTP_202_ACCEPTED)
async def sync_user_post(
    user_data: UserProfileData,
    background_tasks: BackgroundTasks,
    db_client: VectorDBClient = Depends(DBClientDep)
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
async def get_sync_status(db_client: VectorDBClient = Depends(get_sync_context)) -> Dict[str, Any]:
    # Logic kiểm tra sức khỏe và trả về trạng thái của VectorDB (giả định get_info là async)
    try:
        # Gọi async method
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
    db_client: VectorDBClient = Depends(get_sync_context)
) -> Dict[str, str]:
    """
    Xóa toàn bộ dữ liệu khỏi một collection (ví dụ: 'jobs', 'user_profiles').
    """
    try:
        await db_client.clear_collection(collection_name)
        return {"message": f"Yêu cầu xóa dữ liệu collection '{collection_name}' đã được gửi."}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Lỗi khi xóa collection '{collection_name}': {e}"
        )