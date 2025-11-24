# AI_service/api/v1/endpoints/chat.py
from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from typing import Generator

# <-- Absolute Imports
from AI_service.schemas.schemas import TextRequest
from AI_service.service.ai.clients import FPTAIClient
from AI_service.api.v1.endpoints.router import SemanticRouter
from AI_service.service.ai.vectordb import VectorDBClient

# --- KHỞI TẠO SERVICES ---
# Khởi tạo các client cần thiết một lần khi ứng dụng khởi động
ai_client = FPTAIClient()
db_client = VectorDBClient()
# Sửa lỗi: Truyền ai_client vào khi khởi tạo SemanticRouter
INTENT_ROUTER = SemanticRouter(ai_client=ai_client)

router = APIRouter()

# ------------------------------------------------------------------------
# ENDPOINT: CHAT CHUNG (/general)
# ------------------------------------------------------------------------
@router.post("/general")
def endpoint_general_chat(data: TextRequest):
    """
    Xử lý câu hỏi chat chung, có kèm theo ngữ cảnh người dùng để cá nhân hóa.
    """
    
    # Hàm tạo luồng (Generator)
    def output_generator() -> Generator[str, None, None]:
        # Truyền đầy đủ các tham số, bao gồm cả `data.context`
        stream = ai_client.smart_chat(
            user_text=data.text, 
            router_instance=INTENT_ROUTER, 
            db_client=db_client,
            context=data.context  # Truyền ngữ cảnh người dùng vào
        )
        
        for chunk in stream:
            if "choices" in chunk and len(chunk["choices"]) > 0:
                delta = chunk["choices"][0].get("delta", {})
                if "content" in delta:
                    yield delta["content"]
            elif "error" in chunk:
                 yield f"\n[ERROR]: {chunk['error']}"
                 break
        
    return StreamingResponse(output_generator(), media_type="text/plain")

# ------------------------------------------------------------------------
# ENDPOINT: GỢI Ý (Nếu cần cho Frontend)
# ------------------------------------------------------------------------
@router.get("/suggestions")
def get_chat_suggestions():
    if hasattr(INTENT_ROUTER, 'get_all_suggestions'):
        return INTENT_ROUTER.get_all_suggestions()
    return {"suggestions": ["Không có gợi ý nào."]}
