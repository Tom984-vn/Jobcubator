from fastapi import FastAPI
from AI_service.core.config import settings
from AI_service.api.v1.api import api_router
from AI_service.service.ai.vectordb import VectorDBClient
from AI_service.service.ai.clients import FPTAIClient
from AI_service.api.v1.endpoints.router import SemanticRouter
from contextlib import asynccontextmanager

import uvicorn
import asyncio
import logging

# Thiết lập Logger cơ bản
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Biến Global được khai báo theo yêu cầu (Mặc dù không được sử dụng trực tiếp bởi deps)
ai_client = None
db_client = None
router = None

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Khai báo lại global để gán giá trị trong hàm lifespan
    global ai_client
    global db_client
    global router
    
    logger.info("Bắt đầu quy trình khởi động ứng dụng...")
    
    # 1. Khởi tạo clients
    ai_client = FPTAIClient()
    db_client = VectorDBClient(ai_client=ai_client)
    router = SemanticRouter(ai_client=ai_client)

    # 2. GÁN VÀO APP STATE (BƯỚC BẮT BUỘC cho Dependency Injection qua request.app.state)
    app.state.ai_client = ai_client
    app.state.db_client = db_client
    app.state.router = router
    
    try:
        # 3. Thực hiện Initialize
        logger.info("Đang khởi tạo VectorDB và SemanticRouter...")
        await app.state.db_client.initialize()
        await app.state.router.initialize()
        logger.info("✅ VectorDB và SemanticRouter đã khởi tạo thành công.")
        
    except Exception as e:
        logger.error(f"❌ Lỗi nghiêm trọng khi khởi tạo Client. Chi tiết: {e}")
        # Dừng ứng dụng nếu có lỗi khởi tạo nghiêm trọng
        raise SystemExit(1)
        
    logger.info("Ứng dụng đã sẵn sàng. Bắt đầu nhận request.")
    
    # Giả định một hàm cập nhật trạng thái nếu cần
    if hasattr(app.state.db_client, 'update_status'):
        app.state.db_client.update_status()
    
    # --- YIELD: Ứng dụng chạy và xử lý Request ---
    yield 

    # --- SHUTDOWN: Quy trình dọn dẹp sau khi server tắt ---
    logger.info("Bắt đầu quy trình tắt ứng dụng (cleanup)...")
    if hasattr(app.state, 'db_client') and app.state.db_client:
        if hasattr(app.state.db_client, 'shutdown'):
            logger.info("Đang đóng kết nối VectorDB...")
            # Nếu shutdown là async, hãy sử dụng await
            await app.state.db_client.shutdown() 
            logger.info("Kết nối VectorDB đã đóng.")
        
app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    lifespan=lifespan # Gán lifespan function vào ứng dụng
)

# Gắn Router tổng vào ứng dụng với prefix /api/v1
app.include_router(api_router, prefix=settings.API_V1_STR)

@app.get("/")
def health_check():
    """Endpoint kiểm tra sức khỏe của dịch vụ."""
    return {"status": f"{settings.PROJECT_NAME} is Ready"}

if __name__ == "__main__":
    # Đảm bảo chạy với cấu hình thích hợp
    uvicorn.run(app, host="0.0.0.0", port=3000)