from fastapi import APIRouter, HTTPException
from AI_service.schemas.schemas import DBStatusResponse
from AI_service.service.ai.clients import FPTAIClient 
from AI_service.service.ai.vectordb import VectorDBClient
import logging
logger = logging.getLogger(__name__)
ai_client = FPTAIClient()
db_client = VectorDBClient(ai_client=ai_client)
router = APIRouter()
@router.get("/debug/db-status/{collection_type}", response_model=DBStatusResponse, summary="Kiểm tra trạng thái VectorDB", tags=["Debug"])
def get_db_status(collection_type: str, limit: int = 3):
    """
    Endpoint kiểm tra số lượng và IDs mẫu của Collection Jobs hoặc User CVs.
    
    - **collection_type**: 'jobs' hoặc 'user_cvs'
    - **limit**: Số lượng ID tối đa trả về (mặc định 3).
    """
    logger.info(f"Nhận request kiểm tra trạng thái DB cho loại: {collection_type}")
    
    # Gọi hàm đã được chọn
    result = db_client.get_collection_ids(collection_type=collection_type, limit=limit)
    
    if "error" in result:
        raise HTTPException(status_code=400, detail=result["error"])
        
    return DBStatusResponse(**result)
