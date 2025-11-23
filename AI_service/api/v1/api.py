from fastapi import APIRouter
from api.v1.endpoints import ai_pipeline 
from api.v1.endpoints import chat

api_router = APIRouter()
# Gắn router con vào đường dẫn /pipeline
api_router.include_router(ai_pipeline.router, prefix="/pipeline", tags=["AI Pipeline"])
api_router.include_router(chat.router, prefix="/chat", tags=["AI Chat"])