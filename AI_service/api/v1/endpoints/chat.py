# AI_service/api/v1/endpoints/chat.py
from fastapi import APIRouter
from fastapi.responses import StreamingResponse
import json # Cần cho việc xử lý stream
from typing import Generator, Dict, Any
import os
from .router import SemanticRouter
import torch 
import torch.nn.functional as F

# <-- Absolute Imports
from AI_service.schemas.schemas import TextRequest # Cần tạo TextRequest trong schemas/ai.py
from AI_service.service.ai.clients import FPTAIClient 
from AI_service.service.ai.vectordb import VectorDBClient
# Bạn sẽ cần import SemanticRouter nếu bạn định nghĩa nó ở file khác
# Ví dụ: from AI_service.services.ai.router import SemanticRouter
# --- KHỞI TẠO SERVICES ---
ai_client = FPTAIClient()
INTENT_ROUTER = SemanticRouter(ai_client= ai_client)
db_client = VectorDBClient(ai_client=ai_client)
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
                # Truyền đầy đủ các tham số, bao gồm cả `data.context`
        stream = ai_client.smart_chat(
            user_text=data.text, 
            router_instance=INTENT_ROUTER, 
            db_client=db_client,
            context=data.context  # Truyền ngữ cảnh người dùng vào
        )
        
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
    return INTENT_ROUTER.get_all_suggestions()
