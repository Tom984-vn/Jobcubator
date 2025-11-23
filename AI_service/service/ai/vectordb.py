import chromadb
from chromadb.utils import embedding_functions
from typing import Optional, List, Dict, Any # Thêm Any
from AI_service.service.ai.clients import FPTAIClient, FPTChromaAdapter # Sửa thành services
from AI_service.schemas.schemas import JobFilter # Giả sử schemas của bạn là ai.py
from AI_service.core.config import settings
import json # Cần nếu bạn muốn in log/debug

ai_client = FPTAIClient() # Khởi tạo global client, chấp nhận được

# Hàm hỗ trợ có thể giữ bên ngoài Class
def build_chroma_filters(filters: Optional[JobFilter]) -> Optional[Dict]:
    """Chuyển đổi JobFilter Pydantic model thành dict 'where' của ChromaDB."""
    # (GIỮ NGUYÊN CODE build_chroma_filters BẠN CUNG CẤP)
    if not filters: return None
    where_conditions = []
    
    # 1. Lọc theo Ngành nghề ($or)
    if filters.selectedJobGroups:
        or_block = [{"category": g} for g in filters.selectedJobGroups]
        # SỬA: Kiểm tra job_type hoặc location nếu bạn muốn lọc theo những trường này
        where_conditions.append({"$or": or_block} if len(or_block) > 1 else or_block[0])

    # 2. Lọc theo Lương ($gte)
    if filters.salaryRange and filters.salaryRange.min:
        # LƯU Ý: Trường này cần tồn tại trong metadata khi bạn thêm job (add_jobs)
        where_conditions.append({"min_salary": {"$gte": filters.salaryRange.min}})

    if not where_conditions: return None
    if len(where_conditions) == 1: return where_conditions[0]
    
    return {"$and": where_conditions}


class VectorDBClient:
    def __init__(self):
        print(f"📦 Đang khởi tạo VectorDB với model: {settings.EMBED_MODEL}")
        self.client = chromadb.PersistentClient(path=settings.DB_PATH)
        self.embedding_func = FPTChromaAdapter(ai_client=ai_client)
        self.collection = self.client.get_or_create_collection(
            name=settings.COLLECTION_NAME,
            embedding_function=self.embedding_func
        )
    
    def add_jobs(self, jobs_data: list):
        # (GIỮ NGUYÊN CODE add_jobs)
        # ...
        pass
    
    # ⚠️ THÊM PHƯƠNG THỨC TÌM KIẾM VÀO BÊN TRONG CLASS (thêm self)
    def search_similar_jobs(self, 
                           query_text: Optional[str] = None, 
                           query_vector: Optional[List[float]] = None, 
                           n_results=3, 
                           filter_obj: Optional[JobFilter] = None) -> List[Dict]:
        
        if not query_text and not query_vector:
            # Nên dùng Exception cụ thể hơn là ValueError trong production
            raise ValueError("Phải cung cấp query_text hoặc query_vector.")

        # Gọi hàm hỗ trợ build_chroma_filters
        chroma_where = build_chroma_filters(filter_obj)
        
        try:
            # Lựa chọn giữa query_embeddings và query_texts
            if query_vector:
                results = self.collection.query(
                    query_embeddings=[query_vector],
                    n_results=n_results,
                    where=chroma_where
                )
            else:
                results = self.collection.query(
                    query_texts=[query_text],
                    n_results=n_results,
                    where=chroma_where
                )
        except Exception as e:
            print(f"❌ Lỗi truy vấn ChromaDB: {e}")
            return []
            
        # Xử lý kết quả trả về
        clean_results = []
        if results and results.get('documents') and results['documents'][0]:
            for i in range(len(results['documents'][0])):
                clean_results.append({
                    "id": results['ids'][0][i],
                    "description": results['documents'][0][i],
                    "metadata": results['metadatas'][0][i] if results.get('metadatas') else {},
                    "distance": results['distances'][0][i] if results.get('distances') else None
                })
        return clean_results
# --- Cách sử dụng trong main.py ---
# from vectordb import VectorDBClient
# db_client = VectorDBClient()
# db_client.search_similar_jobs("Kế toán")