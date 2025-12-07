from fastapi import APIRouter
from AI_service.api.v1.endpoints import consult
from AI_service.api.v1.endpoints import chat
from AI_service.api.v1.endpoints import status
from AI_service.api.v1.endpoints import sync
api_router = APIRouter()
# Gắn router con vào đường dẫn /pipeline
api_router.include_router(consult.router, prefix="/pipeline")
api_router.include_router(chat.router, prefix="/chat", tags=["AI Chat"])
api_router.include_router(status.router)
api_router.include_router(sync.router)