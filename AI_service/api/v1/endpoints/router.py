import json
import torch.nn.functional as F
import torch
import os
from AI_service.core.config import settings
from AI_service.service.ai.clients import FPTAIClient

# Khởi tạo AI client một lần và tái sử dụng
ai_client = FPTAIClient()

# Build the absolute path to respond.json
RESPOND_JSON_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(__file__)))), 'respond.json')


class SemanticRouter:
    def __init__(self):
        # Load file mẫu câu hỏi
        with open(RESPOND_JSON_PATH, "r", encoding="utf-8") as f:
            self.intents = json.load(f)
        
        # Không cần FPTChromaAdapter ở đây nữa
        
        # Pre-compute: Mã hóa tất cả câu mẫu thành vector
        self.sample_vectors = []
        self.intent_map = []

        print("🔄 Đang khởi tạo Router...")
        for item in self.intents:
            for sample in item["samples"]:
                # Sửa lỗi: Gọi đúng phương thức get_embedding từ ai_client
                embedding_list = ai_client.get_embedding(sample)
                if embedding_list:
                    vec = torch.tensor(embedding_list, dtype=torch.float32)
                    self.sample_vectors.append(vec)
                    # Lưu lại instruction tương ứng với vector này
                    self.intent_map.append(item["system_instruction"])
        
        # Stack lại thành 1 matrix lớn để tính toán song song
        if self.sample_vectors:
            self.sample_vectors = torch.stack(self.sample_vectors)
        print("✅ Router đã sẵn sàng!")

    def find_best_instruction(self, user_query: str , threshold=0.75):
        """
        Tìm xem câu hỏi user có khớp với mẫu nào không.
        """
        if not self.sample_vectors:
            return None, False

        # 1. Embed câu hỏi người dùng
        # Sửa lỗi: Gọi đúng phương thức get_embedding từ ai_client
        query_embedding_list = ai_client.get_embedding(user_query)
        if not query_embedding_list:
            return None, False
        
        query_vec = torch.tensor(query_embedding_list, dtype=torch.float32)
        
        # 2. Tính độ giống nhau với TOÀN BỘ mẫu (Cosine Similarity)
        # Đảm bảo query_vec có cùng số chiều với sample_vectors để so sánh
        scores = F.cosine_similarity(query_vec.unsqueeze(0), self.sample_vectors)
        
        # 3. Lấy điểm cao nhất
        max_score, idx = torch.max(scores, dim=0)
        
        print(f"🔍 Router Score: {max_score.item():.2f}")

        if max_score.item() >= threshold:
            # Tìm thấy mẫu khớp -> Trả về Instruction chuyên gia
            return self.intent_map[idx.item()], True
        
        return None, False
        
    def get_all_suggestions(self):
        """
        Trả về danh sách tất cả câu hỏi mẫu để hiển thị lên Frontend.
        """
        suggestion_list = []
        for category in self.intents:
            suggestion_list.extend(category["samples"][:2]) 
        return suggestion_list
