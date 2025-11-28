import json
import torch.nn.functional as F
import torch
from AI_service.core.config import settings
from AI_service.service.ai.clients import FPTAIClient
from typing import Dict, Any
import chromadb
import logging
import os
from pathlib import Path

logger = logging.getLogger(__name__)

CURRENT_FILE = Path(__file__).resolve()

# Hoặc đơn giản hơn, nếu bạn đặt file JSON trong thư mục AI_service/
AI_SERVICE_DIR = CURRENT_FILE.parents[3] # Nếu client.py ở cấp 3

# Xây dựng đường dẫn tuyệt đối đến respond.json (Giả sử nằm trong thư mục AI_SERVICE)
JSON_FILE_PATH = AI_SERVICE_DIR / "respond.json"
class SemanticRouter:
    def __init__(self, ai_client: FPTAIClient):
        self.ai_client = ai_client
        self.intents: Dict[str, Any] = {}
        self.sample_vectors = []
        self.intent_map = []
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
        
                # --- Cấu hình Persistence cho Router ---
        router_db_path = settings.Respond_vector_PATH
        router_col_name = "ai_intent_router"
        
        # Khởi tạo Client và Collection riêng cho Router
        # Đảm bảo thư mục tồn tại nếu là PersistentClient
        os.makedirs(router_db_path, exist_ok=True)
        self.router_db_client = chromadb.PersistentClient(path=router_db_path)  
        self.router_collection = self.router_db_client.get_or_create_collection(
            name=router_col_name,
        )
        # --- Logic Tải hoặc Vector hóa/Lưu ---
        router_count = self.router_collection.count()
        
        if router_count > 0:
            # 1. TẢI TỪ VECTORDB (Khởi động nhanh)
            logger.info(f"🔄 Đang tải Router từ VectorDB ({router_count} mẫu)...")
            
            try:
                # Lấy toàn bộ vector và metadata
                results = self.router_collection.get(
                    include=['embeddings', 'metadatas']
                )
                
                # Chuyển đổi sang PyTorch Tensor để tính toán
                self.sample_vectors = torch.tensor(results['embeddings'], dtype=torch.float32)
                
                # Ánh xạ từ metadatas (giả định metadatas chứa key 'system_instruction')
                self.intent_map = [m.get('system_instruction', 'UNKNOWN_INTENT') for m in results['metadatas']] 
                
                logger.info(f"✅ Router đã sẵn sàng (Tải từ DB). Tổng số mẫu: {len(self.sample_vectors)}.")

            except Exception as e:
                logger.error(f"❌ LỖI khi tải Router từ ChromaDB: {e}. Thử vector hóa lại.")
                self.router_collection.delete(where={}) # Xóa để vector hóa lại
                self._vectorize_and_store() # Thực hiện vector hóa và lưu mới
            
        else:
            # 2. VECTOR HÓA VÀ LƯU (Lần chạy đầu tiên)
            logger.info("🔄 Router rỗng. Đang vector hóa, khởi tạo và lưu trữ...")
            self._vectorize_and_store()


    def _vectorize_and_store(self):
        """
        Thực hiện vector hóa các mẫu câu và lưu trữ vào ChromaDB và PyTorch Tensor.
        """
        # --- Cần phải khởi tạo các biến này để lưu vào ChromaDB ---
        vectors_to_add = []      # List of lists (dữ liệu thô cho ChromaDB)
        metadatas_to_add = []    # List of dicts (metadata cho ChromaDB)
        in_memory_tensors = []   # List of Tensors (dữ liệu tạm thời cho PyTorch)

        ids_to_add = []
        current_id = 0
        
        self.intent_map = [] # Đảm bảo reset intent_map vì nó sẽ được xây dựng lại

        for item in self.intents:
            if isinstance(item, dict) and "samples" in item:
                for sample in item["samples"]:
                    try:
                        vec_list = self.ai_client.get_embedding(sample)
                        
                        if vec_list:
                            # 1. Chuẩn bị cho ChromaDB
                            vectors_to_add.append(vec_list) # Vector thô
                            metadatas_to_add.append({"system_instruction": item["system_instruction"]}) # Metadata Dict
                            ids_to_add.append(str(current_id))
                            
                            # 2. Chuẩn bị cho PyTorch (Tính toán nhanh trong bộ nhớ)
                            vec_tensor = torch.tensor(vec_list, dtype=torch.float32)
                            in_memory_tensors.append(vec_tensor) # Lưu Tensor vào list tạm
                            
                            # 3. Chuẩn bị cho Logic Router (String Lookup)
                            self.intent_map.append(item["system_instruction"]) # Lưu chuỗi instruction
                            
                            current_id += 1
                            
                    except Exception as e:
                        logger.error(f"❌ LỖI Vector hóa mẫu '{sample[:20]}...': {e}")
                        continue
            else:
                logger.warning(f"Cấu trúc Intent không hợp lệ: {item}")
        
        # 4. Lưu vào ChromaDB (Persistence)
        if vectors_to_add:
            try:
                # SỬ DỤNG vectors_to_add và metadatas_to_add đã được định dạng đúng
                self.router_collection.add(
                    embeddings=vectors_to_add,
                    metadatas=metadatas_to_add,
                    ids=ids_to_add
                )
                logger.info(f"✅ Đã lưu {len(vectors_to_add)} mẫu vào Router VectorDB.")
            except Exception as e:
                logger.error(f"❌ LỖI DB khi lưu Router vectors: {e}")
                
        # 5. Stack lại thành 1 matrix lớn cho PyTorch (Tính toán nhanh)
        if in_memory_tensors:
            self.sample_vectors = torch.stack(in_memory_tensors)
            # Dùng logger thay vì print để nhất quán
            logger.info(f"✅ Router đã sẵn sàng với {len(self.sample_vectors)} mẫu câu!") 
        else:
            self.sample_vectors = torch.empty(0, 0)
            logger.warning("⚠️ Cảnh báo: Router rỗng (không có vector).")

    def find_best_instruction(self, user_query: str , threshold=0.7):
        """
        Tìm xem câu hỏi user có khớp với mẫu nào không.
        Trả về: (Instruction, True) nếu khớp.
        Trả về: (None, False) nếu không khớp.
        """
        # Kiểm tra an toàn
        if not isinstance(self.sample_vectors, torch.Tensor) or self.sample_vectors.numel() == 0:
            return None, False
        
        # Embed câu hỏi người dùng
        query_list = self.ai_client.get_embedding(user_query)
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