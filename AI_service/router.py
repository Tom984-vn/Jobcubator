import json
import torch.nn.functional as F
import torch
from config import settings

class SemanticRouter:
    def __init__(self):
        # Load file mẫu câu hỏi
        with open("respond.json", "r", encoding="utf-8") as f:
            self.intents = json.load(f)
        
        # Load model Embedding (Dùng chung model với Vector DB cho nhẹ)
        self.embed_model = settings.EMBED_MODEL
        
        # Pre-compute: Mã hóa tất cả câu mẫu thành vector NGAY KHI KHỞI ĐỘNG
        # Để lúc chạy thật không phải tính lại -> Cực nhanh
        self.sample_vectors = []
        self.intent_map = []

        print("🔄 Đang khởi tạo Router...")
        for item in self.intents:
            for sample in item["samples"]:
                vec = self.embed_model.encode(sample, convert_to_tensor=True)
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
        Trả về: (Instruction, True) nếu khớp.
        Trả về: (None, False) nếu không khớp.
        """
        # 1. Embed câu hỏi người dùng
        query_vec = self.embed_model.encode(user_query, convert_to_tensor=True)
        
        # 2. Tính độ giống nhau với TOÀN BỘ mẫu (Cosine Similarity)
        scores = F.cosine_similarity(query_vec, self.sample_vectors)
        
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
        Output: List[str] hoặc List[Dict]
        """
        suggestion_list = []
        for category in self.intents:
            # Lấy ra 1-2 câu mẫu tiêu biểu nhất của mỗi chủ đề để hiển thị thôi
            # Không cần lấy hết nếu danh sách quá dài
            suggestion_list.extend(category["samples"][:2]) 
        return suggestion_list