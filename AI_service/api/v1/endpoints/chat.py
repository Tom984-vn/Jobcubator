# AI_service/api/v1/endpoints/chat.py
from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from typing import Generator
import os

# <-- Absolute Imports
from AI_service.schemas.schemas import TextRequest
from AI_service.service.ai.clients import FPTAIClient
# Import SemanticRouter từ file router.py đã được sửa lỗi đường dẫn
from AI_service.api.v1.endpoints.router import SemanticRouter

# --- KHỞI TẠO SERVICES ---
# Khởi tạo AI client
ai_client = FPTAIClient()

# Khởi tạo Router (sử dụng lớp đã import)
# Bây giờ nó sẽ sử dụng logic đúng và đường dẫn tuyệt đối đến respond.json
INTENT_ROUTER = SemanticRouter()

router = APIRouter()

# ------------------------------------------------------------------------
# ENDPOINT: CHAT CHUNG (/general)
# ------------------------------------------------------------------------
@router.post("/general")
def endpoint_general_chat(data: TextRequest):
    """
    Xử lý câu hỏi chat chung, dùng Semantic Router để điều phối
    hoặc Light LLM để chuẩn hóa câu hỏi. Trả về streaming response.
    """
    
    # Hàm tạo luồng (Generator)
    def output_generator() -> Generator[str, None, None]:
        # Dùng logic smart_chat mà bạn đã định nghĩa
        stream = ai_client.smart_chat(data.text, INTENT_ROUTER) 
        
        for chunk in stream:
            # Xử lý các chunk từ hàm chat_respond_custom (streaming)
            if "choices" in chunk and len(chunk["choices"]) > 0:
                delta = chunk["choices"][0].get("delta", {})
                if "content" in delta:
                    yield delta["content"]
            # Xử lý lỗi
            elif "error" in chunk:
                 yield f"\n[ERROR]: {chunk['error']}"
                 break
        
    return StreamingResponse(output_generator(), media_type="text/plain")

# ------------------------------------------------------------------------
# ENDPOINT: GỢI Ý (Nếu cần cho Frontend)
# ------------------------------------------------------------------------
@router.get("/suggestions")
def get_chat_suggestions():
    # Lấy gợi ý từ thực thể router đã được khởi tạo
    # Giả sử bạn có một phương thức get_all_suggestions trong SemanticRouter
    # Nếu chưa có, bạn cần thêm nó vào file router.py
    if hasattr(INTENT_ROUTER, 'get_all_suggestions'):
        return INTENT_ROUTER.get_all_suggestions()
    return {"suggestions": ["Không có gợi ý nào."]}
