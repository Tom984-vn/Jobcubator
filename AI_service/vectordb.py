import chromadb
from chromadb.utils import embedding_functions
from config import settings # Import biến cấu hình chung

class VectorDBClient:
    def __init__(self):
        
        # 1. Khởi tạo Client (Kết nối đến thư mục lưu DB)
        self.client = chromadb.PersistentClient(path=settings.DB_PATH)
        
        # 2. Chọn hàm Embedding (Dùng model local hoặc API)
        # Ở đây mình giữ nguyên model local như code mẫu của bạn
        print(f"📦 Đang khởi tạo VectorDB với model: {settings.EMBED_MODEL}")
        self.client = chromadb.PersistentClient(path=settings.DB_PATH)
        self.embedding_func = embedding_functions.SentenceTransformerEmbeddingFunction(
            model_name=settings.EMBED_MODEL
        )

        # 3. Lấy hoặc Tạo Collection (Bảng dữ liệu)
        self.collection = self.client.get_or_create_collection(
            name=settings.COLLECTION_NAME,
            embedding_function=self.embedding_func
        )
        print(f"✅ Đã kết nối Vector DB tại: {settings.DB_PATH}")

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
        """Tìm kiếm Job phù hợp với text"""
        try:
            results = self.collection.query(
                query_texts=[query_text],
                n_results=n_results
            )
            return results
        except Exception as e:
            print(f"❌ Lỗi tìm kiếm: {e}")
            return None

# --- Cách sử dụng trong main.py ---
# from vectordb import VectorDBClient
# db_client = VectorDBClient()
# db_client.search_similar_jobs("Kế toán")