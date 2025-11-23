import chromadb
from chromadb.utils import embedding_functions
from typing import Optional, List, Dict
from AI_service.service.ai.clients import FPTAIClient, FPTChromaAdapter
from AI_service.schemas.schemas import JobFilter
from AI_service.core.config import settings # Import biến cấu hình chung

ai_client = FPTAIClient()
class VectorDBClient:
    def __init__(self):
        print(f"📦 Đang khởi tạo VectorDB với model: {settings.EMBED_MODEL}")
        self.client = chromadb.PersistentClient(path=settings.DB_PATH)
        """
        self.embedding_func = ExternalAPIEmbeddingFunction(
            api_url=settings.ENDPOINT,
            api_key=settings.API_KEY
        )
        """
        self.embedding_func = FPTChromaAdapter(ai_client=ai_client)
        self.collection = self.client.get_or_create_collection(
            name=settings.COLLECTION_NAME,
            embedding_function=self.embedding_func
        )
    
    def add_jobs(self, jobs_data: list):
        """
        Thêm danh sách job vào DB.
        Input: List of Dict [{"id": "1", "description": "...", "category": "..."}]
        """
        if not jobs_data:
            return False

        try:
            # Tách các trường ra thành các list riêng biệt theo yêu cầu của Chroma
            ids = [str(j["id"]) for j in jobs_data]
            documents = [j["description"] for j in jobs_data]
            
            # Metadata giúp lọc sau này (Vd: chỉ tìm job lương cao)
            metadatas = [{"category": j.get("category", "General")} for j in jobs_data]

            self.collection.add(
                ids=ids,
                documents=documents,
                metadatas=metadatas
            )
            return True
        except Exception as e:
            print(f"❌ Lỗi thêm job: {e}")
            return False

def build_chroma_filters(filters: Optional[JobFilter]) -> Optional[Dict]:
    """Chuyển đổi JobFilter Pydantic model thành dict 'where' của ChromaDB."""
    if not filters: return None
    where_conditions = []

    # 1. Lọc theo Ngành nghề ($or)
    if filters.selectedJobGroups:
        or_block = [{"category": g} for g in filters.selectedJobGroups]
        where_conditions.append({"$or": or_block} if len(or_block) > 1 else or_block[0])

    # 2. Lọc theo Thành phố ($or)
    if filters.selectedCities:
        or_block = [{"location": c} for c in filters.selectedCities]
        where_conditions.append({"$or": or_block} if len(or_block) > 1 else or_block[0])

    # 3. Lọc theo Loại hình làm việc
    if filters.workType:
        where_conditions.append({"job_type": filters.workType})

    # 4. Lọc theo Lương ($gte)
    if filters.salaryRange and filters.salaryRange.min:
        where_conditions.append({"min_salary": {"$gte": filters.salaryRange.min}})

    if not where_conditions: return None
    if len(where_conditions) == 1: return where_conditions[0]
    
    # Gom tất cả điều kiện lại bằng AND
    return {"$and": where_conditions}

def search_similar_jobs(self, 
                           query_text: Optional[str] = None, 
                           query_vector: Optional[List[float]] = None, # <-- Thêm tham số vector
                           n_results=3, 
                           filter_obj: Optional[JobFilter] = None) -> List[Dict]:
        
        if not query_text and not query_vector:
            raise ValueError("Phải cung cấp query_text hoặc query_vector.")

        chroma_where = build_chroma_filters(filter_obj)
        
        # CHROMADB QUERY: Sử dụng query_embeddings nếu vector được cung cấp
        if query_vector:
            results = self.collection.query(
                query_embeddings=[query_vector], # Dùng vector trực tiếp
                n_results=n_results,
                where=chroma_where
            )
        else:
            # Nếu không có vector, fallback về query_text (embedding nội bộ)
            results = self.collection.query(
                query_texts=[query_text],
                n_results=n_results,
                where=chroma_where
            )
            
        clean_results = []
        if results and results['documents'] and results['documents'][0]:
            for i in range(len(results['documents'][0])):
                clean_results.append({
                    "id": results['ids'][0][i],
                    "description": results['documents'][0][i],
                    "metadata": results['metadatas'][0][i] if results['metadatas'] else {}
                })
        return clean_results

# --- Cách sử dụng trong main.py ---
# from vectordb import VectorDBClient
# db_client = VectorDBClient()
# db_client.search_similar_jobs("Kế toán")