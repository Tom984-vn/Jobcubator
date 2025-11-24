import chromadb
from chromadb.utils import embedding_functions
from typing import Optional, List, Dict, Any # Thêm Any
from AI_service.service.ai.clients import FPTAIClient, FPTChromaAdapter # Sửa thành services
from AI_service.schemas.schemas import JobFilter # Giả sử schemas của bạn là ai.py
from AI_service.core.config import settings
import logging

# Thiết lập logging cho dễ theo dõi
logging.basicConfig(level=logging.INFO, format='[%(levelname)s] %(message)s')
logger = logging.getLogger(__name__)

ai_client = FPTAIClient() # Khởi tạo global client, chấp nhận được

# Hàm hỗ trợ có thể giữ bên ngoài Class
def build_chroma_filters(filters: Optional[JobFilter]) -> Optional[Dict]:
    """Chuyển đổi JobFilter Pydantic model thành dict 'where' của ChromaDB."""
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
        self.ai_client = ai_client
        print(f"📦 Đang khởi tạo VectorDB với model: {settings.EMBED_MODEL}")
        self.client = chromadb.PersistentClient(path=settings.DB_PATH)
        self.embedding_func = FPTChromaAdapter(ai_client=ai_client)
        self.collection = self.client.get_or_create_collection(
            name=settings.COLLECTION_NAME,
            embedding_function=self.embedding_func
        )
        job_count = self.collection.count()
        print(f"📦 [VectorDB] Đã tải thành công Collection '{settings.COLLECTION_NAME}'. Tổng số job: {job_count}")
        
        if job_count == 0:
            print("⚠️ [VectorDB] Cảnh báo: DB rỗng, cần chạy seed_db.py để nạp dữ liệu mẫu.")
        else:
            print(f"Có {job_count} job mẫu ở trong db")

        # 2. Khởi tạo Collection User CV (Dữ liệu động)
        self.user_collection = self.client.get_or_create_collection(
            name=settings.USER_COLLECTION_NAME, # <--- ĐÃ SỬ DỤNG BIẾN MỚI
            embedding_function=self.embedding_func
        )
        logger.info(f"✅ User CV Collection sẵn sàng. Số CV: {self.user_collection.count()}")
    # ⚠️ THÊM PHƯƠNG THỨC TÌM KIẾM VÀO BÊN TRONG CLASS (thêm self)
    def update_status(self):
        job_count = self.collection.count()
        print(f"📦 [VectorDB] Đã tải thành công Collection '{settings.COLLECTION_NAME}'. Tổng số job: {job_count}")
        if job_count == 0:
            print("⚠️ [VectorDB] Cảnh báo: DB rỗng, cần chạy seed_db.py để nạp dữ liệu mẫu.")
        return job_count
    def add_jobs(self, jobs: list):
        """
        Thêm danh sách các job (dict) vào ChromaDB. 
        Mỗi job được vector hóa bằng FPTAIClient.
        """
        documents = []
        metadatas = []
        ids = []
        embeddings = []
        jobs_failed_count = 0
        
        print(f"\n[ADD_JOBS] Bắt đầu vector hóa và thêm {len(jobs)} job...")

        for job in jobs:
            job_id = str(job.get("id"))
            job_title = job.get("title", "Không tiêu đề")
            job_description = job.get("description", "")
            
            # 1. Trích xuất văn bản cần vector hoá
            text_to_embed = f"Tiêu đề: {job_title}. Mô tả: {job_description}"

            # 2. GỌI API ĐỂ TẠO VECTOR và xử lý lỗi
            try:
                vector_list = self.ai_client.get_embedding(text_to_embed)
            except Exception as api_e:
                # Bắt lỗi API và bỏ qua job này
                print(f"❌ LỖI VÉCTOR HÓA (ID {job_id} - {job_title}): Lỗi API: {api_e}")
                jobs_failed_count += 1
                continue

            # 3. Kiểm tra kết quả
            if vector_list and isinstance(vector_list, list) and len(vector_list) > 0: 
                # Thêm dữ liệu đã vector hóa
                embeddings.append(vector_list)
                documents.append(text_to_embed)
                
                # Lưu metadata (lưu ý: metadata cần phải là kiểu dữ liệu cơ bản)
                metadatas.append({
                    "id": job["id"], 
                    "title": job["title"], 
                    "category": job.get("category"), 
                    "workType": job.get("workType", "N/A") 
                    # Thêm các trường bạn cần cho việc lọc sau này
                })
                ids.append(job_id)
            else:
                print(f"⚠️ Cảnh báo: Job ID {job_id} không tạo được vector (API trả về rỗng).")
                jobs_failed_count += 1

        print(f"[ADD_JOBS] Chuẩn bị thêm {len(ids)}/{len(jobs)} job thành công vào DB...")
        
        # 4. Thêm vào ChromaDB
        if len(ids) > 0:
            try:
                self.collection.add(
                    documents=documents,
                    embeddings=embeddings,
                    metadatas=metadatas,
                    ids=ids
                )
                print(f"✅ THÀNH CÔNG: Đã thêm {len(ids)} job vào Collection '{self.collection.name}'.")
            except Exception as db_e:
                print(f"❌ LỖI DB: Lỗi khi thêm vào ChromaDB: {db_e}")
                return # Dừng hàm nếu lỗi DB

        # 5. Báo cáo cuối cùng
        if jobs_failed_count > 0:
             print(f"--- BÁO CÁO ---")
             print(f"Tổng số job: {len(jobs)}")
             print(f"Job được thêm thành công: {len(ids)}")
             print(f"Job thất bại/bị bỏ qua: {jobs_failed_count}")
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
            results = self.job_collection.query(
                query_embeddings=[query_vector],
                n_results=n_results,
                where=chroma_where, # Áp dụng filter
                include=['metadatas', 'documents', 'distances']
            )
            # ... (Logic làm sạch và định dạng kết quả) ...
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
        except Exception as e:
            logger.error(f"❌ Lỗi truy vấn ChromaDB (Job): {e}")
            return []
    
# --------------------------------------------- Phần user ----------------------------------------------------

    def add_user_cv(self, user_id: str, cv_text: str, vector: List[float], metadata: Dict = None):
            """Lưu/cập nhật CV và vector embedding của người dùng (thực hiện trên user_collection)."""
            try:
                self.user_collection.upsert( # Sử dụng user_collection
                    documents=[cv_text],
                    embeddings=[vector],
                    metadatas=[metadata or {}],
                    ids=[user_id]
                )
                logger.info(f"✅ Đã lưu/cập nhật CV cho user: {user_id}")
            except Exception as e:
                logger.error(f"❌ Lỗi khi lưu CV cho user {user_id}: {e}")

    def get_user_cv_vector(self, user_id: str) -> Optional[Dict[str, Any]]:
            """Lấy vector và CV gốc của người dùng theo ID (thực hiện trên user_collection)."""
            try:
                results = self.user_collection.get( # Sử dụng user_collection
                    ids=[user_id], 
                    include=['embeddings', 'documents'] 
                )
                
                if results and results.get('documents') and results['documents'] and results['documents'][0]:
            
                # Đảm bảo trường 'embeddings' tồn tại và có giá trị
                    embeddings = results.get('embeddings', [])
                    if embeddings and embeddings[0]:
                        return {
                            "vector": embeddings[0],
                            "cv_text": results['documents'][0]
                    }
            
                return None
                
            except Exception as e:
                logger.error(f"❌ Lỗi khi lấy vector/CV cho User {user_id}: {e}")
                return None