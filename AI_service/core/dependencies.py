import logging
from typing import Optional, AsyncGenerator

# --- KHẮC PHỤC LỖI: IMPORT CÁC CLASS CẦN THIẾT ---
# Bạn cần import chính xác từ đường dẫn mà các class này được định nghĩa.
from AI_service.service.ai.clients import FPTAIClient
from AI_service.service.ai.vectordb import VectorDBClient 
from AI_service.core.config import settings
# Nếu bạn có file config riêng
# from AI_service.core.config import settings 

logger = logging.getLogger(__name__)
# Đảm bảo logging được cấu hình nếu chạy độc lập
if not logger.handlers:
    logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')


# --- SINGLETON CONTAINERS ---
_ai_client_instance: Optional[FPTAIClient] = None
_db_client_instance: Optional[VectorDBClient] = None


def get_ai_client() -> FPTAIClient:
    """
    Trả về instance duy nhất của FPTAIClient.
    """
    global _ai_client_instance
    if _ai_client_instance is None:
        logger.info("📦 [Singleton] Khởi tạo FPTAIClient lần đầu...")
        _ai_client_instance = FPTAIClient()
    return _ai_client_instance


def get_vector_db_client() -> VectorDBClient:
    """
    Trả về instance duy nhất của VectorDBClient.
    Đảm bảo AI Client cũng được lấy từ Singleton.
    """
    global _db_client_instance
    if _db_client_instance is None:
        logger.info("📦 [Singleton] Khởi tạo VectorDBClient lần đầu...")
        # Lấy AI Client đã được khởi tạo Singleton
        ai_client = get_ai_client() 
        _db_client_instance = VectorDBClient(ai_client=ai_client)
    return _db_client_instance


