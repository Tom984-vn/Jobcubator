import chromadb
from chromadb.utils import embedding_functions
from clients import FPTAIClient, FPTChromaAdapter
from config import settings # Import biến cấu hình chung

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

    def search_similar_jobs(self, query_text: str, n_results=5):
        """Tìm kiếm jobs và trả về kết quả dạng List of Dict"""
        try:
            results = self.collection.query(
                query_texts=[query_text],
                n_results=n_results
            )
            
            # Chroma trả về cấu trúc khá rối, ta cần làm phẳng nó lại
            clean_results = []
            if results and results['documents']:
                for i in range(len(results['documents'][0])):
                    clean_results.append({
                        "id": results['ids'][0][i],
                        "description": results['documents'][0][i],
                        "metadata": results['metadatas'][0][i] if results['metadatas'] else {}
                    })
            return clean_results
        except Exception as e:
            print(f"❌ Lỗi tìm kiếm Vector: {e}")
            return []


# --- Cách sử dụng trong main.py ---
# from vectordb import VectorDBClient
# db_client = VectorDBClient()
# db_client.search_similar_jobs("Kế toán")