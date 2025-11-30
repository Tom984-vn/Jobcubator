from typing import Optional
import logging

# Lưu ý: Import các class Client của bạn
# Giả sử chúng được định nghĩa ở đây:
from AI_service.service.ai.clients import FPTAIClient
from AI_service.service.ai.vectordb import VectorDBClient
# Giả sử bạn có class cho SemanticRouter
from AI_service.api.v1.endpoints.router import SemanticRouter # Cập nhật đường dẫn này nếu cần

logger = logging.getLogger(__name__)

# --- CÁC BIẾN TOÀN CỤC SẼ ĐƯỢC GÁN TRONG LIFESPAN CỦA MAIN.PY ---
# Khởi tạo chúng là None. Lifespan sẽ gán các instance đã khởi tạo vào đây.

AI_CLIENT: Optional[FPTAIClient] = None
DB_CLIENT: Optional[VectorDBClient] = None
ROUTER: Optional[SemanticRouter] = None

logger.info("Created global client placeholders in globals.py.")