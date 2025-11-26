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
def build_chroma_filters(filter_obj: Optional[JobFilter]) -> Dict[str, Any]:
    """
    Xây dựng bộ lọc metadata cho ChromaDB.
    SỬA LỖI: Tự động gỡ bỏ $or nếu chỉ có 1 điều kiện.
    """
    if not filter_obj:
        logger.info("Không có bộ lọc metadata nào được áp dụng.")
        return None

    filter_conditions = []
    
    # --- 1. Lọc theo Category (Logic thông minh cho $or) ---
    if filter_obj.selectedJobGroups:
        group_conds = [{'group': g} for g in filter_obj.selectedJobGroups]
        if len(group_conds) > 1:
            filter_conditions.append({'$or': group_conds})
        elif len(group_conds) == 1:
            filter_conditions.append(group_conds[0]) # Chỉ có 1 thì lấy trực tiếp, không bọc $or

    # --- 2. Lọc theo Location (Logic thông minh cho $or) ---
    if filter_obj.selectedCities:
        loc_conds = [{'location': c} for c in filter_obj.selectedCities]
        if len(loc_conds) > 1:
            filter_conditions.append({'$or': loc_conds})
        elif len(loc_conds) == 1:
            filter_conditions.append(loc_conds[0])

    # --- 3. Lọc theo Salary (Khoảng giao nhau) ---
    if filter_obj.salaryRange and filter_obj.salaryRange.min is not None and filter_obj.salaryRange.max is not None:
        user_min = filter_obj.salaryRange.min
        user_max = filter_obj.salaryRange.max
        
        # Logic lương dùng $and cứng (2 điều kiện) nên không bị lỗi này
        salary_conditions = {
            '$and': [
                {'min_salary': {'$lte': user_max}},
                {'max_salary': {'$gte': user_min}}
            ]
        }
        filter_conditions.append(salary_conditions)
        
    # --- 4. Lọc theo Work Type ---
    if filter_obj.workType:
        filter_conditions.append({'workType': filter_obj.workType})

    # --- KẾT HỢP TẤT CẢ ---
    if not filter_conditions:
        return None
        
    # Nếu chỉ có 1 điều kiện tổng, trả về trực tiếp (không bọc $and)
    if len(filter_conditions) == 1:
        return filter_conditions[0]
        
    return {'$and': filter_conditions}
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
        else:
            sample_results = self.job_collection.peek(limit=1)
                
            # Trích xuất dữ liệu mẫu
            sample_id = sample_results.get('ids', ['N/A'])[0]
            sample_doc = sample_results.get('documents', ['N/A'])[0]
            sample_metadata = sample_results.get('metadatas', [{}])[0]
            
            logger.info("==================================================")
            logger.info("👀 DEBUG: Kiểm tra Job mẫu đầu tiên từ ChromaDB:")
            logger.info(f"   - ID: {sample_id}")
            logger.info(f"   - Document (Tiêu đề + Mô tả): {sample_doc}")
            logger.info(f"   - metadatas Dùng để Lọc: {sample_metadata}")
            logger.info("==================================================")
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
            
            # --- FIX 1: Truy cập dictionary metadatas lồng ---
            # Sử dụng .get("metadatas", {}) để tránh lỗi nếu key 'metadatas' không tồn tại
            job_metadata = job.get("metadatas", {}) 

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
                embeddings.append(vector_list)
                documents.append(text_to_embed)
                
                # --- FIX 2 & 3: CHUẨN BỊ metadatas ĐÚNG CẤU TRÚC VÀ KIỂU DỮ LIỆU ---
                metadatas.append({
                    "id": job["id"], 
                    "title": job["title"], 
                    
                    # FIX 2: SỬ DỤNG KEY CHUẨN TỪ SAMPLE_JOBS
                    # 'group' thay cho 'category'
                    "group": job_metadata.get("group", job.get("group", "N/A")), 
                    "location": job_metadata.get("location", "N/A"),
                    "workType": job_metadata.get("workType", "N/A"), # Giữ nguyên tên key này

                    # FIX 3: ÉP KIỂU SỐ VÀ TRUY CẬP ĐÚNG CHỖ
                    # Lấy từ dictionary lồng 'metadatas' và ép kiểu int (dùng 0 mặc định)
                    "min_salary": int(job_metadata.get("min_salary", 0)), 
                    "max_salary": int(job_metadata.get("max_salary", 0)) # Bắt buộc phải thêm max_salary
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
                    embeddings=embeddings,
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
        logger.info(f"Bộ lọc ChromaDB WHERE: {chroma_where}") # <-- LOG CẤU TRÚC LỌC ĐỂ DEBUG
        try:
            # [CHANGE] Sử dụng job_collection để tìm kiếm
            if query_vector is not None and len(query_vector) > 0:
                logger.info("Dùng query_vector")
                results = self.job_collection.query(
                    query_embeddings=[query_vector],
                    n_results=n_results,
                    where=chroma_where,
                    include=['metadatas', 'documents', 'distances']
                )
            elif query_text is not None and len(query_text) > 0:
                results = self.job_collection.query(
                    query_texts=[query_text],
                    n_results=n_results,
                    where=chroma_where,
                    include=['metadatas', 'documents', 'distances']
                )
            else: 
                logger.error("Cần nhập query_vector hoặc query_text đầu vào!")
            clean_results = []
            
            # Validate that all result arrays are present and have the same length
            ids = results.get('ids', [[]])[0]
            documents = results.get('documents', [[]])[0]
            metadatas = results.get('metadatas', [[]])[0] if results.get('metadatas') else [{}] * len(documents)
            distances = results.get('distances', [[]])[0] if results.get('distances') else [None] * len(documents)
            min_len = min(len(ids), len(documents), len(metadatas), len(distances))
            for i in range(min_len):
                clean_results.append({
                    "id": ids[i],
                    "description": documents[i],
                    "metadatas": metadatas[i],
                    "distance": distances[i]
                })
            return clean_results
        except Exception as e:
            logger.error(f"❌ Lỗi truy vấn ChromaDB: {e}")
            return []
    # =======================================================
    # PHẦN B: LOGIC CHO USER CV (Sửa lỗi thụt lề & Array Ambiguous)
    # =======================================================

    def add_user_cv(self, user_id: str, cv_text: str, vector: List[float], metadatas: Dict = None):
        """Lưu/cập nhật CV vào user_collection."""
        try:
            self.user_collection.upsert(
                documents=[cv_text],
                embeddings=[vector],
                metadatas=[metadatas or {}],
                ids=[user_id]
            )
            logger.info(f"✅ Đã lưu/cập nhật CV cho user: {user_id}")
        except Exception as e:
            logger.error(f"❌ Lỗi khi lưu CV cho user {user_id}: {e}")

    def get_user_cv_vector(self, user_id: str) -> Optional[Dict[str, Any]]:
        """
        Lấy vector và CV gốc của người dùng theo ID.
        (Đã cập nhật phong cách 'Trích xuất an toàn' giống search_similar_jobs)
        """
        try:
            # Gọi API lấy dữ liệu
            results = self.user_collection.get(
                ids=[user_id], 
                include=['embeddings', 'documents', 'metadatas'] 
            )
            
            # 1. TRÍCH XUẤT AN TOÀN (Safe Extraction)
            # Sử dụng .get() với giá trị mặc định là list rỗng []
            ids = results.get('ids', [])
            documents = results.get('documents', [])
            embeddings = results.get('embeddings', [])
            metadatas = results.get('metadatas', [])

            # 2. KIỂM TRA DỮ LIỆU
            # Nếu không có ID nào được trả về, tức là User không tồn tại
            if not ids or len(ids) == 0:
                logger.warning(f"⚠️ Không tìm thấy dữ liệu cho User ID: {user_id}")
                return None

            # 3. ĐÓNG GÓI KẾT QUẢ
            # Vì get(ids=[user_id]) chỉ trả về 1 kết quả duy nhất tại vị trí [0]
            
            # Kiểm tra vector có tồn tại và hợp lệ không
            current_vector = embeddings[0] if embeddings and len(embeddings) > 0 else None
            
            if current_vector is None:
                logger.warning(f"⚠️ User {user_id} tồn tại nhưng chưa có vector (lỗi vector hóa trước đó).")
                return None

            return {
                "user_id": ids[0],
                "cv_text": documents[0] if documents else "",
                "vector": current_vector,
                "metadata": metadatas[0] if metadatas else {}
            }
            
        except Exception as e:
            logger.error(f"❌ Lỗi khi lấy vector/CV cho User {user_id}: {e}")
            return None
        
#-------------------------------DEBUGGER------------------------------------------------------------------- 
    def get_collection_ids(self, collection_type: str = 'jobs', limit: int = 3) -> Dict[str, Any]:
        """
        Lấy danh sách ID và số lượng (count) của một collection cụ thể.
        :param collection_type: 'jobs' hoặc 'user_cvs'.
        :param limit: Số lượng IDs tối đa trả về.
        :return: Dict chứa thông tin collection.
        """
        if collection_type == 'job':
            collection = self.job_collection
            name = "job"
        elif collection_type == 'user_cv':
            collection = self.user_collection
            name = "user_cv"
        else:
            return {"error": "Loại collection không hợp lệ. Chỉ chấp nhận 'jobs' hoặc 'user_cvs'."}
            
        if collection is None:
            return {"error": f"Collection '{name}' chưa được khởi tạo."}
            
        try:
            count = collection.count()
            
            # Lấy toàn bộ IDs
            results = collection.get(
                ids=None, # Lấy tất cả IDs
                include=[] # Không cần documents, metadatas, embeddings
            )
            
            all_ids = results.get('ids', [])
            
            # Giới hạn số lượng ID trả về
            limited_ids = all_ids[:limit]
            
            return {
                "collection_name": name,
                "total_count": count,
                "ids": limited_ids
            }
        except Exception as e:
            logger.error(f"❌ Lỗi khi lấy IDs từ collection '{name}': {e}")
            return {"error": f"Lỗi không xác định khi truy vấn DB: {e}"}

    def clear_all_data(self, collection_type: str = 'all') -> Dict[str, Any]:
        """
        Xóa toàn bộ dữ liệu trong một hoặc tất cả các collection.
        :param collection_type: 'job', 'user_cv', hoặc 'all' để xóa tất cả.
        :return: Dict chứa số lượng bản ghi đã xóa và trạng thái.
        """
        try:
            deleted_count = 0
            
            if collection_type in ['job', 'all']:
                # Xóa tất cả bản ghi trong job collection
                job_count = self.job_collection.count()
                if job_count > 0:
                    # Lấy tất cả IDs
                    results = self.job_collection.get(ids=None, include=[])
                    all_ids = results.get('ids', [])
                    
                    # Xóa từng batch (Chroma có giới hạn lệnh xóa)
                    batch_size = 100
                    for i in range(0, len(all_ids), batch_size):
                        batch_ids = all_ids[i:i+batch_size]
                        self.job_collection.delete(ids=batch_ids)
                    
                    deleted_count += job_count
                    logger.info(f"✅ Đã xóa {job_count} bản ghi từ Job Collection.")
            
            if collection_type in ['user_cv', 'all']:
                # Xóa tất cả bản ghi trong user_cv collection
                user_count = self.user_collection.count()
                if user_count > 0:
                    # Lấy tất cả IDs
                    results = self.user_collection.get(ids=None, include=[])
                    all_ids = results.get('ids', [])
                    
                    # Xóa từng batch
                    batch_size = 100
                    for i in range(0, len(all_ids), batch_size):
                        batch_ids = all_ids[i:i+batch_size]
                        self.user_collection.delete(ids=batch_ids)
                    
                    deleted_count += user_count
                    logger.info(f"✅ Đã xóa {user_count} bản ghi từ User CV Collection.")
            
            if collection_type not in ['job', 'user_cv', 'all']:
                return {"error": f"Loại collection không hợp lệ. Chỉ chấp nhận 'job', 'user_cv', hoặc 'all'."}
            
            return {
                "status": "success",
                "total_deleted": deleted_count,
                "message": f"Đã xóa thành công {deleted_count} bản ghi."
            }
            
        except Exception as e:
            logger.error(f"❌ Lỗi khi xóa dữ liệu: {e}")
            return {
                "status": "error",
                "message": f"Lỗi khi xóa dữ liệu: {e}"
            }
