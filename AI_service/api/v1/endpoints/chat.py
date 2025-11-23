# AI_service/api/v1/endpoints/chat.py
from fastapi import APIRouter
from fastapi.responses import StreamingResponse
import json # Cần cho việc xử lý stream
from typing import Generator, Dict, Any
import os

import torch 
import torch.nn.functional as F

# <-- Absolute Imports
from AI_service.schemas.schemas import TextRequest # Cần tạo TextRequest trong schemas/ai.py
from AI_service.service.ai.clients import FPTAIClient 
# Bạn sẽ cần import SemanticRouter nếu bạn định nghĩa nó ở file khác
# Ví dụ: from AI_service.services.ai.router import SemanticRouter 
class SemanticRouter:
    def __init__(self, fpt_client, intent_file="respond.json"):
        self.client = fpt_client
        
        # Đảm bảo file respond.json nằm ở thư mục gốc của ứng dụng (nơi bạn chạy uvicorn)
        if os.path.exists(intent_file):
            with open(intent_file, "r", encoding="utf-8") as f:
                self.intents = json.load(f)
        else:
            print(f"❌ Lỗi: Không tìm thấy file '{intent_file}'")
            self.intents = []

        self.sample_vectors = []
        self.intent_map = []
        print("🔄 Đang khởi tạo Router...")
        
        # Tải embeddings
        for item in self.intents:
            for sample in item["samples"]:
                vec_list = self.client.get_embedding(sample) # Gọi FPTAIClient
                if vec_list and vec_list[0]: # Kiểm tra vector không rỗng
                    vec_tensor = torch.tensor(vec_list, dtype=torch.float32)
                    self.sample_vectors.append(vec_tensor)
                    self.intent_map.append(item["system_instruction"])
        
        # Xử lý vector
        if self.sample_vectors:
            self.sample_vectors = torch.stack(self.sample_vectors)
            print("✅ Router đã sẵn sàng!")
        else:
            print("⚠️ Cảnh báo: Không tạo được vector nào cho Router.")
            
    def find_best_instruction(self, user_query: str, threshold=0.70):
        # ... (giữ nguyên logic find_best_instruction của bạn)
        if not isinstance(self.sample_vectors, torch.Tensor) or self.sample_vectors.numel() == 0:
            return None, False
        
        query_list = self.client.get_embedding(user_query)
        if not query_list: return None, False
        
        # Xử lý 1D vector
        query_vec = torch.tensor(query_list, dtype=torch.float32)
        
        # Thêm chiều (dimension) nếu cần cho cosine_similarity nếu sample_vectors không phải 2D
        if self.sample_vectors.dim() == 1:
            scores = F.cosine_similarity(query_vec.unsqueeze(0), self.sample_vectors.unsqueeze(0))
        else:
            scores = F.cosine_similarity(query_vec, self.sample_vectors)
            
        max_score, idx = torch.max(scores, dim=0)
        print(f"🔍 Router Score: {max_score.item():.2f}")
        
        if max_score.item() >= threshold:
            return self.intent_map[idx.item()], True
        return None, False


# --- KHỞI TẠO SERVICES ---
ai_client = FPTAIClient()
INTENT_ROUTER = SemanticRouter(ai_client)

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
    return INTENT_ROUTER.get_all_suggestions()
