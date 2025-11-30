import logging
from fastapi import HTTPException, Request, status, Depends
from AI_service.service.ai.clients import FPTAIClient
from AI_service.service.ai.vectordb import VectorDBClient
from AI_service.api.v1.endpoints.router import SemanticRouter 
from typing import Annotated

logger = logging.getLogger(__name__)

# --- DEPENDENCY FUNCTIONS SỬ DỤNG APP STATE ---

def get_ai_client(request: Request) -> FPTAIClient:
    """
    Lấy FPTAIClient instance đã được khởi tạo trong lifespan thông qua app.state.
    
    LƯU Ý: Đây là phương pháp chuẩn và đáng tin cậy nhất trong FastAPI. 
    Các endpoint sử dụng Depends(get_ai_client) không cần thay đổi.
    """
    # Lấy client từ request.app.state (Được gán trong lifespan của main.py)
    ai_client = getattr(request.app.state, 'ai_client', None)
    
    if ai_client is None:
        logger.error("❌ Lỗi 503: FPTAI Client chưa được khởi tạo. Kiểm tra lỗi trong lifespan của main.py.")
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE, 
            detail="AI Client chưa sẵn sàng."
        )
    return ai_client


def get_db_client(request: Request) -> VectorDBClient:
    """
    Lấy VectorDBClient instance đã được khởi tạo trong lifespan thông qua app.state.
    """
    # Lấy client từ request.app.state (Được gán trong lifespan của main.py)
    db_client = getattr(request.app.state, 'db_client', None)

    if db_client is None:
        logger.error("❌ Lỗi 503: VectorDB Client chưa được khởi tạo. Kiểm tra lỗi trong lifespan của main.py.")
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE, 
            detail="VectorDB Client chưa sẵn sàng."
        )
    return db_client


def get_semantic_router(request: Request) -> SemanticRouter:
    """
    Lấy SemanticRouter instance đã được khởi tạo trong lifespan thông qua app.state.
    """
    # Lấy client từ request.app.state (Được gán trong lifespan của main.py)
    router = getattr(request.app.state, 'router', None)

    if router is None:
        logger.error("❌ Lỗi 503: Semantic Router chưa được khởi tạo. Kiểm tra lỗi trong lifespan của main.py.")
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE, 
            detail="Semantic Router chưa sẵn sàng."
        )
    return router

# Loại tham chiếu (Type Aliases) để dùng trong route handlers (Rất tiện lợi)
AIClientDep = Annotated[FPTAIClient, Depends(get_ai_client)]
DBClientDep = Annotated[VectorDBClient, Depends(get_db_client)]
SemanticRouterDep = Annotated[SemanticRouter, Depends(get_semantic_router)]