from fastapi import FastAPI
from AI_service.core.config import settings
from AI_service.api.v1.api import api_router
from AI_service.service.ai.vectordb import VectorDBClient
from AI_service.service.ai.clients import FPTAIClient
from AI_service.api.v1.endpoints.router import SemanticRouter
from contextlib import asynccontextmanager

import uvicorn
import logging

logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app:FastAPI):
    global ai_client
    global db_client
    global router
    logger.info("Bắt đầu quy trình khởi động ứng dụng...")
    ai_client = FPTAIClient()
    db_client = VectorDBClient(ai_client=ai_client)
    router = SemanticRouter(ai_client=ai_client)
    try:
        await db_client.initialize()
        await router.initialize()
    except Exception as e:
        logger.error(f"❌ Lỗi nghiêm trọng khi khởi tạo VectorDB. Chi tiết: {e}")
        # Quan trọng: Nếu DB không khởi động được, bạn có thể muốn dừng ứng dụng
        raise SystemExit(1)
        
    logger.info("Ứng dụng đã sẵn sàng. Bắt đầu nhận request.")
    db_client.update_status()
    # Yield cho phép các route handler bắt đầu chạy
    yield 

    #Thêm quy trình tắt ở đây, h chưa có:<
app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    lifespan=lifespan
)

# Gắn Router tổng vào ứng dụng với prefix /api/v1
app.include_router(api_router, prefix=settings.API_V1_STR)

@app.get("/")
def health_check():
    """Endpoint kiểm tra sức khỏe của dịch vụ."""
    return {"status": f"{settings.PROJECT_NAME} is Ready"}

if __name__ == "__main__":
   uvicorn.run(app,  port = 3000)