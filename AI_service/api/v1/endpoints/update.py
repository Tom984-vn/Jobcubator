from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from typing import List, Dict, Any, Optional
import logging

# Import các client và hàm dependencies
from AI_service.core.config import settings
from AI_service.core.dependencies import get_vector_db_client, get_ai_client # Giữ lại import này
from AI_service.service.ai.clients import FPTAIClient
from AI_service.service.ai.vectordb import VectorDBClient
from AI_service.backend_data.job_fletcher import JobPostFetcher

logger = logging.getLogger(__name__)
router = APIRouter()

# --- HÀM XỬ LÝ NỀN (Background Task) ---
# NHẬN instance db_client đã được khởi tạo
def process_job_upsert(job_id: str, db_client: VectorDBClient):
    """
    Logic thực hiện việc fetch dữ liệu và upsert vào VectorDB.
    """
    logger.info(f"Bắt đầu xử lý nền cho Job ID: {job_id}")
    
    try:
        # 1. Lấy dữ liệu Job chi tiết từ Backend
        # Khởi tạo Fetcher tại đây (vì nó không phải là Singleton tốn kém)
        base_url = "http://localhost:8080/api/job_posts" # Giả định Base URL cho Fetcher
        # CÓ THỂ CẦN SỬA settings.BACKEND_API_URL nếu bạn có
        # base_url = settings.BACKEND_API_URL 
        
        fetcher = JobPostFetcher(base_url)
        
        # Giả định fetcher trả về List[Dict] hoặc Dict (tùy vào Job ID)
        job_data = fetcher.fetch_job_post_by_id(job_id) 
        
        # Nếu fetcher chỉ lấy 1 job, ta gói nó thành list để dùng hàm add_jobs
        if not isinstance(job_data, list):
             job_data = [job_data]
        
        if not job_data or not job_data[0]:
            logger.error(f"❌ Xử lý nền thất bại: Không tải được dữ liệu cho Job ID {job_id}.")
            return
            
        # 2. Upsert vào VectorDB
        # SỬ DỤNG instance db_client đã được truyền vào
        success = db_client.add_jobs(job_data) 
        
        if success:
            logger.info(f"✅ Đồng bộ Job ID {job_id} hoàn tất.")
        else:
            logger.error(f"❌ Đồng bộ Job ID {job_id} thất bại trong bước VectorDB.")
            
    except Exception as e:
        logger.error(f"❌ Lỗi tổng quát trong quá trình xử lý nền cho Job ID {job_id}: {e}")

# --- ENDPOINT (Router) ---
# Tách các dependencies thành một hàm riêng để làm gọn
def get_sync_context(
    db_client: VectorDBClient = Depends(get_vector_db_client),
):
    """Dependency chỉ để lấy các client cần thiết cho việc đồng bộ."""
    # Chỉ trả về client cần thiết cho Background Task.
    return db_client

@router.put("/sync/job/{job_id}", summary="Đồng bộ (Upsert) Job Post mới/cập nhật vào VectorDB", tags=["Sync"])
def sync_job_post(
    job_id: str, 
    background_tasks: BackgroundTasks,
    # Gọn gàng hơn: Chỉ gọi một dependency đã gom
    db_client: VectorDBClient = Depends(get_sync_context)
):
    """
    Nhận yêu cầu đồng bộ từ Backend.
    Lấy dữ liệu Job chi tiết và upsert vào VectorDB trong Background.
    """
    logger.info(f"Nhận request đồng bộ Job ID: {job_id}")
    
    # 2. PASS instance db_client đã được inject vào hàm nền
    background_tasks.add_task(process_job_upsert, job_id, db_client)
    
    return {"message": f"Yêu cầu đồng bộ Job ID {job_id} đã được chấp nhận và đang xử lý nền."}