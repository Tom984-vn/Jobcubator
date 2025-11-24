from fastapi import APIRouter
from AI_service.api.v1.endpoints import consult
from AI_service.api.v1.endpoints import chat

api_router = APIRouter()
# Gắn router con vào đường dẫn /pipeline
api_router.include_router(consult.router, prefix="/pipeline")
api_router.include_router(chat.router, prefix="/chat", tags=["AI Chat"])