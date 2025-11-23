import json
import torch.nn.functional as F
import torch
from AI_service.core.config import settings
from AI_service.service.ai.clients import FPTAIClient, FPTChromaAdapter
from typing import Dict, Any
from pathlib import Path

CURRENT_FILE = Path(__file__).resolve()

# Hoặc đơn giản hơn, nếu bạn đặt file JSON trong thư mục AI_service/
AI_SERVICE_DIR = CURRENT_FILE.parents[3] # Nếu client.py ở cấp 3

# Xây dựng đường dẫn tuyệt đối đến respond.json (Giả sử nằm trong thư mục AI_SERVICE)
JSON_FILE_PATH = AI_SERVICE_DIR / "respond.json"

ai_client = FPTAIClient()
class SemanticRouter:
    def __init__(self):
        print(JSON_FILE_PATH)
        self.intents: Dict[str, Any] = {}
        try:
        # Load file mẫu câu hỏi
            with open(JSON_FILE_PATH, "r", encoding="utf-8") as f:
                self.intents = json.load(f)
            print(f"✅ Đã tải file intents từ: {JSON_FILE_PATH}")
            
        except FileNotFoundError:
             # In ra đường dẫn bị lỗi để tiện debug
             print(f"❌ Lỗi TẢI FILE: Không tìm thấy file tại '{JSON_FILE_PATH}'. Vui lòng kiểm tra lại số cấp .parents[X].") 
        except json.JSONDecodeError as e:
             print(f"❌ Lỗi JSON: File '{JSON_FILE_PATH}' không hợp lệ. Chi tiết: {e}")
        
        # Load model Embedding (Dùng chung model với Vector DB cho nhẹ)
        self.embed_model = FPTChromaAdapter(ai_client=ai_client)
        
        # Pre-compute: Mã hóa tất cả câu mẫu thành vector NGAY KHI KHỞI ĐỘNG
        # Để lúc chạy thật không phải tính lại -> Cực nhanh
        self.sample_vectors = []
        self.intent_map = []

        print("🔄 Đang khởi tạo Router...")
        for item in self.intents:
            for sample in item["samples"]:
                vec_list = ai_client.get_embedding(sample)
                if vec_list:
                    # Chuyển List thành Tensor để tính toán
                    vec_tensor = torch.tensor(vec_list, dtype=torch.float32)
                    self.sample_vectors.append(vec_tensor)
                    self.intent_map.append(item["system_instruction"])
        
        # Stack lại thành 1 matrix lớn để tính toán song song
        if self.sample_vectors:
            self.sample_vectors = torch.stack(self.sample_vectors)
            print(f"✅ Router đã sẵn sàng với {len(self.sample_vectors)} mẫu câu!")
        else:
            print("⚠️ Cảnh báo: Router rỗng (không có vector).")

    def find_best_instruction(self, user_query: str , threshold=0.75):
        """
        Tìm xem câu hỏi user có khớp với mẫu nào không.
        Trả về: (Instruction, True) nếu khớp.
        Trả về: (None, False) nếu không khớp.
        """
        # Kiểm tra an toàn
        if not isinstance(self.sample_vectors, torch.Tensor) or self.sample_vectors.numel() == 0:
            return None, False
        
        # Embed câu hỏi người dùng
        query_list = ai_client.get_embedding(user_query)
        if not query_list: return None, False
        
        query_vec = torch.tensor(query_list, dtype=torch.float32)
        
        # Tính Cosine Similarity
        if self.sample_vectors.dim() == 1:
             scores = F.cosine_similarity(query_vec.unsqueeze(0), self.sample_vectors.unsqueeze(0))
        else:
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