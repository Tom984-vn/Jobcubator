import chromadb
from typing import Optional, List, Dict, Any
from AI_service.service.ai.clients import FPTAIClient, FPTChromaAdapter
from AI_service.schemas.schemas import JobFilter
from AI_service.core.config import settings
import logging

# Thiết lập logging
logging.basicConfig(level=logging.INFO, format='[%(levelname)s] %(message)s')
logger = logging.getLogger(__name__)

# --- HÀM UTILITY (Giữ nguyên logic của bạn) ---
def build_chroma_filters(filters: Optional[JobFilter]) -> Optional[Dict]:
    """Chuyển đổi JobFilter Pydantic model thành dict 'where' của ChromaDB."""
    if not filters: return None
    where_conditions = []
    
    # 1. Lọc theo Ngành nghề ($or)
    if filters.selectedJobGroups:
        or_block = [{"category": g} for g in filters.selectedJobGroups]
        where_conditions.append({"$or": or_block} if len(or_block) > 1 else or_block[0])

    # 2. Lọc theo Lương ($gte)
    if filters.salaryRange and filters.salaryRange.min:
        where_conditions.append({"min_salary": {"$gte": filters.salaryRange.min}})

    if not where_conditions: return None
    if len(where_conditions) == 1: return where_conditions[0]
    return {"$and": where_conditions}

# -----------------------------------------------------------------

class VectorDBClient:
    # [CHANGE] Nhận ai_client vào __init__ thay vì dùng biến global để tránh lỗi khởi tạo
    def __init__(self, ai_client: FPTAIClient): 
        logger.info(f"📦 Đang khởi tạo VectorDB với model: {settings.EMBED_MODEL}")
        
        self.client = chromadb.PersistentClient(path=settings.DB_PATH)
        self.ai_client = ai_client # [CHANGE] Lưu client được truyền vào
        self.embedding_func = FPTChromaAdapter(ai_client=self.ai_client)
        
        # 1. Khởi tạo Collection Job
        self.job_collection = self.client.get_or_create_collection(
            name=settings.COLLECTION_NAME,
            embedding_function=self.embedding_func
        )
        job_count = self.job_collection.count()
        # [CHANGE] Dùng logger thay vì print
        logger.info(f"📦 [VectorDB] Đã tải thành công Collection '{settings.COLLECTION_NAME}'. Tổng số job: {job_count}")
        
        if job_count == 0:
            logger.warning("⚠️ [VectorDB] Cảnh báo: DB rỗng, cần chạy seed_db.py để nạp dữ liệu mẫu.")
        
        # 2. Khởi tạo Collection User CV
        # [CHANGE] Tự động tạo tên Collection CV nếu chưa có trong settings (hoặc dùng settings nếu có)
        user_col_name = getattr(settings, 'USER_COLLECTION_NAME', f"{settings.COLLECTION_NAME}_USER_CV")
        self.user_collection = self.client.get_or_create_collection(
            name=user_col_name,
            embedding_function=self.embedding_func
        )
        logger.info(f"✅ User CV Collection '{user_col_name}' sẵn sàng. Số CV: {self.user_collection.count()}")

    def update_status(self):
        """Kiểm tra trạng thái số lượng Job."""
        job_count = self.job_collection.count()
        logger.info(f"📦 [VectorDB] Tổng số job hiện tại: {job_count}")
        return job_count

    # =======================================================
    # PHẦN A: LOGIC CHO JOB (Nạp dữ liệu & Tìm kiếm)
    # =======================================================

    def add_jobs(self, jobs: list):
        """Thêm danh sách các job (dict) vào ChromaDB."""
        documents = []
        metadatas = []
        ids = []
        embeddings = []
        jobs_failed_count = 0
        
        logger.info(f"\n[ADD_JOBS] Bắt đầu vector hóa và thêm {len(jobs)} job...")

        for job in jobs:
            job_id = str(job.get("id"))
            job_title = job.get("title", "Không tiêu đề")
            job_description = job.get("description", "")
            
            # Trích xuất văn bản
            text_to_embed = f"Tiêu đề: {job_title}. Mô tả: {job_description}"

            # Gọi API
            try:
                vector_list = self.ai_client.get_embedding(text_to_embed)
            except Exception as api_e:
                logger.error(f"❌ LỖI VÉCTOR HÓA (ID {job_id}): {api_e}")
                jobs_failed_count += 1
                continue

            # Kiểm tra kết quả
            if vector_list and isinstance(vector_list, list) and len(vector_list) > 0: 
                embeddings.append(vector_list) # [CHANGE] Quan trọng: Gom tất cả vector vào list lớn
                documents.append(text_to_embed)
                
                # Metadata
                metadatas.append({
                    "id": job["id"], 
                    "title": job["title"], 
                    "category": job.get("category"), 
                    "workType": job.get("workType", "N/A"),
                    "min_salary": job.get("min_salary", 0) # [CHANGE] Thêm trường lương để lọc
                })
                ids.append(job_id)
            else:
                logger.warning(f"⚠️ Job ID {job_id} không tạo được vector.")
                jobs_failed_count += 1

        # Thêm vào DB
        if len(ids) > 0:
            try:
                self.job_collection.add(
                    documents=documents,
                    embeddings=embeddings, # [CHANGE] Truyền danh sách vector đã gom
                    metadatas=metadatas,
                    ids=ids
                )
                logger.info(f"✅ THÀNH CÔNG: Đã thêm {len(ids)} job vào Collection.")
            except Exception as db_e:
                logger.error(f"❌ LỖI DB: {db_e}")

        if jobs_failed_count > 0:
             logger.info(f"--- BÁO CÁO: {jobs_failed_count} Job thất bại ---")

    def search_similar_jobs(self, 
                            query_text: Optional[str] = None, 
                            query_vector: Optional[List[float]] = None, 
                            n_results=3, 
                            filter_obj: Optional[JobFilter] = None) -> List[Dict]:
        

        chroma_where = build_chroma_filters(filter_obj)
        
        try:
            # [CHANGE] Sử dụng job_collection để tìm kiếm
            if query_vector is not None and len(query_vector) > 0:
                results = self.job_collection.query(
                    query_embeddings=[query_vector],
                    n_results=n_results,
                    where=chroma_where,
                    include=['metadatas', 'documents', 'distances']
                )
            else:
                results = self.job_collection.query(
                    query_texts=[query_text],
                    n_results=n_results,
                    where=chroma_where,
                    include=['metadatas', 'documents', 'distances']
                )
            
            clean_results = []
            
            #if results and results.get('documents') and results['documents'][0]:
            for i in range(len(results['documents'][0])):
                    clean_results.append({
                        "id": results['ids'][0][i],
                        "description": results['documents'][0][i],
                        "metadata": results['metadatas'][0][i] if results.get('metadatas') else {},
                        "distance": results['distances'][0][i] if results.get('distances') else None
                    })
            return clean_results    
        except Exception as e:
            logger.error(f"❌ Lỗi truy vấn ChromaDB: {e}")
            return []

    # =======================================================
    # PHẦN B: LOGIC CHO USER CV (Sửa lỗi thụt lề & Array Ambiguous)
    # =======================================================

    def add_user_cv(self, user_id: str, cv_text: str, vector: List[float], metadata: Dict = None):
        """Lưu/cập nhật CV vào user_collection."""
        try:
            self.user_collection.upsert(
                documents=[cv_text],
                embeddings=[vector],
                metadatas=[metadata or {}],
                ids=[user_id]
            )
            logger.info(f"✅ Đã lưu/cập nhật CV cho user: {user_id}")
        except Exception as e:
            logger.error(f"❌ Lỗi khi lưu CV cho user {user_id}: {e}")

    def get_user_cv_vector(self, user_id: str) -> Optional[Dict[str, Any]]:
        """Lấy vector và CV gốc của người dùng theo ID (Đã sửa lỗi NumPy)."""
        try:
            results = self.user_collection.get(
                ids=[user_id], 
                include=['embeddings', 'documents'] 
            )
            
            # Kiểm tra an toàn từng lớp
            if results and results.get('documents') and len(results['documents']) > 0:
                if results['documents'][0]: # Văn bản CV không rỗng
                    embeddings = results.get('embeddings')
                    
                    # SỬA LỖI QUAN TRỌNG: Kiểm tra độ dài thay vì boolean trực tiếp
                    if embeddings is not None and len(embeddings) > 0:
                        return {
                            "vector": embeddings[0],
                            "cv_text": results['documents'][0]
                        }
            return None 
            
        except Exception as e:
            logger.error(f"❌ Lỗi khi lấy vector/CV cho User {user_id}: {e}")
            return None