import chromadb
from typing import Optional, List, Dict, Any
from AI_service.service.ai.clients import FPTAIClient, FPTChromaAdapter
from AI_service.schemas.schemas import JobFilter
from AI_service.core.config import settings
import logging
import os
import asyncio
from functools import partial 

# Thiết lập logging
logger = logging.getLogger(__name__)

# --- HÀM lọc các thông tin yêu cầu cứng ---
def build_chroma_filters(filter_obj: Optional[JobFilter]) -> Dict[str, Any]:
    """
    Xây dựng bộ lọc metadatas cho ChromaDB.
    SỬA LỖI: Tự động gỡ bỏ $or nếu chỉ có 1 điều kiện.
    """
    if not filter_obj:
        logger.info("Không có bộ lọc metadatas nào được áp dụng.")
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
        self.chroma_client = None
        self.client = chromadb.PersistentClient(path=settings.DB_PATH)
        self.ai_client = ai_client # [CHANGE] Lưu client được truyền vào
        self.embedding_func = FPTChromaAdapter(ai_client=self.ai_client)
        
        # 1. Khởi tạo Collection Job
        self.job_db_path = settings.COLLECTION_NAME
        self.cv_db_path = settings.USER_COLLECTION_NAME
        self.job_collection_name = "job_postings"
        self.cv_collection_name = "user_cvs"

        self.user_collection: Any = None 
        self.jobs_collection: Any = None


    async def initialize(self):
        """
        Khởi tạo ChromaDB client và các Collection (Không đồng bộ).
        Phải được gọi sau khi khởi tạo class.
        """
        logger.info("Bắt đầu khởi tạo VectorDBClient (Async)...")

        # Đảm bảo thư mục tồn tại
        os.makedirs(self.job_db_path, exist_ok=True)
        os.makedirs(self.cv_db_path, exist_ok=True)

        # Khởi tạo PersistentClient (Blocking I/O)
        # Ta sẽ dùng một client duy nhất cho cả hai collection trong ví dụ này
        # Mặc dù path khác nhau, ChromaDB client là blocking I/O.
        # Tuy nhiên, để đơn giản, ta chỉ cần một lần khởi tạo client.
        
        # Do bạn dùng các DB Path khác nhau, ta sẽ khởi tạo riêng client cho Job và CV
        
        # Khởi tạo Job Client
        job_client = await asyncio.to_thread(chromadb.PersistentClient, path=self.job_db_path)
        self.job_collection = await asyncio.to_thread(
            job_client.get_or_create_collection,
            name=self.job_collection_name,
            # Nếu bạn muốn ChromaDB tự embedding, hãy truyền embedding_function tại đây
            # Nhưng vì ta dùng FPTAIClient để embedding, ta sẽ không truyền.
        )
        logger.info(f"✅ Collection '{self.job_collection_name}' đã sẵn sàng.")
        
        # Khởi tạo CV Client
        cv_client = await asyncio.to_thread(chromadb.PersistentClient, path=self.cv_db_path)
        self.user_collection = await asyncio.to_thread(
            cv_client.get_or_create_collection,
            name=self.cv_collection_name,
        )
        logger.info(f"✅ Collection '{self.cv_collection_name}' đã sẵn sàng.")
        
        logger.info("✅ VectorDBClient (Async) đã khởi tạo hoàn tất.")

    def update_status(self):
            sample_results = self.job_collection.peek(limit=1)
            user_sample_results = self.user_collection.peek(limit=1)
            logger.info(sample_results)
            logger.info(user_sample_results)
            """
                        sample_id = sample_results.get('ids', ['N/A'])[0]

                        sample_doc = sample_results.get('documents', ['N/A'])[0]
                        sample_title = sample_results.get('title', ['N/A'])
            """
            # Trích xuất dữ liệu một cách an toàn từ kết quả peek()
            sample_id = "N/A"
            sample_doc = "N/A"
            sample_title = "N/A"

            if sample_results and sample_results.get('ids'):
                sample_id = sample_results['ids'][0]
                sample_doc = sample_results.get('documents', ['N/A'])[0]
                # SỬA LỖI: 'title' nằm trong 'metadatas', không phải ở cấp cao nhất.
                first_metadata = sample_results.get('metadatas', [{}])[0]
                sample_title = first_metadata.get('title', 'N/A') if first_metadata else 'N/A'

            logger.info("==================================================")
            logger.info("👀 DEBUG: Kiểm tra Job mẫu đầu tiên từ ChromaDB:")
            logger.info(f"   - ID: {sample_id}")
            logger.info(f"   - Title : {sample_title}")
            logger.info(f"   - Document (Mô tả): {sample_doc}")
            logger.info(f"   - Dùng để Lọc: {sample_results}")
            logger.info("==================================================")

    # =======================================================
    # PHẦN A: LOGIC CHO JOB (Nạp dữ liệu & Tìm kiếm)
    # =======================================================

    async def add_jobs(self, jobs: List[Dict[str, Any]]):
        """Thêm danh sách các job (dict) vào ChromaDB."""
        if not self.job_collection:
            raise RuntimeError("Job Collection chưa được khởi tạo.")
            
        if not jobs:
            logger.warning("Danh sách Jobs rỗng, không có gì để thêm.")
            return
        
        logger.info(f"🔄 Bắt đầu thêm {len(jobs)} jobs vào VectorDB...")

        embedding_tasks = []
        jobs_to_process = []
        
        for job in jobs:
            # Lấy thông tin cần thiết, đảm bảo kiểu dữ liệu là str cho ID
            job_id = str(job.get("id"))
            job_title = job.get("title", "Không tiêu đề")
            job_description = job.get("description", "")
            job_requirement = job.get("requirements", "Chưa có")
            job_benefits = job.get("benefits","Chưa có")
            job_tags_list = job.get("tags", [])
            # Đảm bảo tags là một chuỗi để nối vào text, xử lý trường hợp nó không phải list
            job_tag_str = ", ".join(job_tags_list) if isinstance(job_tags_list, list) else ""

            # Trích xuất văn bản để gọi embedding API (phải là ASYNC)
            text_to_embed = f"Tiêu đề: {job_title}. Mô tả: {job_description}. Yêu cầu: {job_requirement}. Quyền lợi: {job_benefits}. Từ khóa: {job_tag_str}"
 
            # Tạo danh sách các coroutine
            embedding_tasks.append(self.ai_client.get_embedding(text_to_embed))
            jobs_to_process.append(job) # Lưu lại đối tượng job gốc

        logger.info(f"\n[ADD_JOBS] Bắt đầu vector hóa đồng thời {len(jobs_to_process)} job...")

        # 2. Chạy tất cả các tác vụ Embedding cùng lúc (concurrently)
        # Sử dụng return_exceptions=True để không bị dừng nếu một API call bị lỗi
        vectors_result = await asyncio.gather(*embedding_tasks, return_exceptions=True) 

        # 3. Thu thập kết quả và chuẩn bị batch cho DB
        documents = []
        metadatas_list = []
        ids = []
        embeddings = []
        jobs_failed_count = 0
        
        for i, job in enumerate(jobs_to_process):
            job_id = str(job.get("id"))
            vector_list = vectors_result[i]
            
            # Kiểm tra lỗi (vector_list là Exception) hoặc vector rỗng
            is_valid_vector = not isinstance(vector_list, Exception) and \
                              vector_list and isinstance(vector_list, list) and \
                              len(vector_list) > 0

            if is_valid_vector:
                job_title = job.get("title", "Không tiêu đề")
                job_description = job.get("description", "")
                job_requirement = job.get("requirement", "Chưa có")
                job_benefits = job.get("benefits","Chưa có")
                text_to_embed = f"Tiêu đề: {job_title}. Mô tả: {job_description}. Yêu cầu: {job_requirement}. Quyền lợi: {job_benefits}" 
                print(text_to_embed) #Bỏ
                embeddings.append(vector_list)
                documents.append(text_to_embed)
                # 1. Chuyển đổi tags từ Set (trong DTO) sang List[str]
                tags_list = list(job.get("tags", [])) 
                
                # 2. FIX CUỐI CÙNG: Xử lý List Tags.
                # Vector DB không chấp nhận list. Chúng ta chuyển nó thành một chuỗi duy nhất.
                if tags_list:
                    # Chuyển List[str] thành một chuỗi duy nhất, phân tách bằng dấu phẩy
                    final_tags = ", ".join(tags_list) # Ví dụ: "Python, SQL, React"
                else:
                    # Nếu danh sách rỗng ([]), phải gán nó thành None để tránh lỗi List
                    final_tags = ""
                # Chuẩn bị Metadatas (Dựa trên logic và FIX của bạn)
                metadatas_list.append({
                    "id": job["id"], 
                    "title": job.get("title", job.get("title", "N/A")), 
                    "group": job.get("category", job.get("group", "N/A")), 
                    "companyName": job.get("companyName", "N/A"),
                    "location": job.get("location", "N/A"),
                    "workType": job.get("jobType", "N/A"), 
                    "min_salary": int(job.get("minSalary", 0)), 
                    "max_salary": int(job.get("maxSalary", 0)),
                    "tags": final_tags, # Dùng cho lọc/tìm kiếm theo kỹ năng
                })
                ids.append(job_id)
            else:
                if isinstance(vector_list, Exception):
                    logger.error(f"❌ LỖI VÉCTOR HÓA (ID {job_id}): {vector_list}")
                else:
                    logger.warning(f"⚠️ Job ID {job_id} không tạo được vector hoặc vector rỗng.")
                jobs_failed_count += 1

        # 4. Thêm vào DB (Thao tác Blocking I/O, phải dùng asyncio.to_thread)
        if len(ids) > 0:
            logger.info(f"⏳ Đang thêm {len(ids)} job vào DB (Blocking call)...")
            try:
                # Sử dụng partial để wrap hàm blocking self.job_collection.add
                add_func = partial(
                    self.job_collection.add,
                    documents=documents,
                    embeddings=embeddings,
                    metadatas=metadatas_list,
                    ids=ids
                )
                await asyncio.to_thread(add_func)
                logger.info(f"✅ THÀNH CÔNG: Đã thêm {len(ids)} job vào Collection.")
            except Exception as db_e:
                logger.error(f"❌ LỖI DB khi thêm batch: {db_e}")
                
        if jobs_failed_count > 0:
            logger.info(f"--- BÁO CÁO: {jobs_failed_count} Job thất bại ---")

    async def search_similar_jobs(self, 
                            query_text: Optional[str] = None, 
                            query_vector: Optional[List[float]] = None, 
                            n_results: int = 3, 
                            filter_obj: Optional[JobFilter] = None) -> List[Dict[str,Any]]:
        
        if not self.job_collection:
            raise RuntimeError("Job Collection chưa được khởi tạo.")
        
        chroma_where = build_chroma_filters(filter_obj)
        logger.info(f"Bộ lọc ChromaDB WHERE: {chroma_where}") # <-- LOG CẤU TRÚC LỌC ĐỂ DEBUG
        try:
            # [CHANGE] Sử dụng job_collection để tìm kiếm
            query_func = partial(
                self.job_collection.query,
                query_embeddings=[query_vector],
                n_results=n_results,
                include=["documents", "metadatas", "distances"],
                where=chroma_where
            )
            
            results = await asyncio.to_thread(query_func)
            if not results or not results['ids'] or not results['ids'][0]:
                return []
            
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

    async def add_user_cv(self, user_data_list: List[Dict[str, Any]]):
        if not self.user_collection:
            raise RuntimeError("CV Collection chưa được khởi tạo.")
        if not user_data_list:
            logger.warning("Không có dữ liệu User Profile để thêm.")
            return

        embedding_tasks = []
        users_to_process = []
        
        # 1. Chuẩn bị vector hóa
        for user in user_data_list:
            document_parts = [
                f"Hồ sơ người dùng: {user.get('fullName', 'N/A')}",
                f"Vị trí mong muốn: {user.get('position', 'N/A')}",
                f"Kinh nghiệm: {user.get('years_of_experience', 0)} năm",
            ]

            # Xử lý trường history (List[ProfileEntrySchema]) - Cần gộp vào document để vector hóa
            history_text = []
            for entry in user.get("history", []):
                # Tạo một chuỗi mô tả từ mỗi mục nhập lịch sử
                entry_parts = [
                    entry.get("type", ""),         # Ví dụ: EXPERIENCE, EDUCATION
                    entry.get("title", ""),        # Ví dụ: Kỹ sư Phần mềm / Cử nhân IT
                    entry.get("organization", ""), # Ví dụ: Công ty X / Đại học Y
                    entry.get("description", ""),  # Mô tả chi tiết (rất quan trọng cho vector)
                ]
                # Nối các phần tử không rỗng lại thành một đoạn văn bản
                history_text.append(" | ".join(filter(None, entry_parts)))

            if history_text:
                document_parts.append("\n--- CHI TIẾT KINH NGHIỆM VÀ HỌC VẤN ---")
                document_parts.extend(history_text)
            
            # Tạo chuỗi document cuối cùng cho việc vector hóa
            document = "\n".join(document_parts)
            
            # 2. TẠO TÁC VỤ EMBEDDING VÀ LƯU TRỮ USER
            
            # Thêm tác vụ vector hóa với document đã được xây dựng
            embedding_tasks.append(self.ai_client.get_embedding(document))
            # LƯU Ý: Phải thêm đối tượng user gốc vào đây để dùng cho việc trích xuất metadata sau
            users_to_process.append(user)

        vectors_result = await asyncio.gather(*embedding_tasks, return_exceptions=True)
        # 3. Thu thập kết quả và chuẩn bị batch
        documents = []
        metadatas = []
        ids = []
        embeddings = []
        
        for i, user in enumerate(users_to_process):
            user_id = str(user.get("id"))
            vector_list = vectors_result[i]
            
            is_valid_vector = not isinstance(vector_list, Exception) and \
                             vector_list and isinstance(vector_list, list) and \
                             len(vector_list) > 0
                             
            if is_valid_vector:
                document_parts = [
                    f"Hồ sơ người dùng: {user.get('fullName', 'N/A')}",
                    f"Vị trí: {user.get('position', 'N/A')}",
                    f"Tổ chức: {user.get('organization', 'N/A')}",
                    f"Kinh nghiệm: {user.get('years_of_experience', 0)} năm",
                    f"Mức lương mong muốn: {user.get('minSalary', 0)} - {user.get('maxSalary', 0)}",
                ]
                history_text = []
                for entry in user.get("history", []):
                    # Tạo một chuỗi mô tả từ mỗi mục nhập lịch sử
                    entry_parts = [
                        entry.get("type", ""), # EXPERIENCE, EDUCATION
                        entry.get("title", ""), # Chức danh/Văn bằng
                        entry.get("organization", ""), # Tên công ty/trường
                        entry.get("description", ""), # Mô tả chi tiết
                    ]
                    # Lọc các phần tử rỗng và nối lại bằng dấu gạch ngang
                    history_text.append(" | ".join(filter(None, entry_parts)))
                if history_text:
                    document_parts.append("\n--- CHI TIẾT LỊCH SỬ/KINH NGHIỆM ---")
                    document_parts.extend(history_text)
                
                # Tạo chuỗi document cuối cùng cho việc vector hóa (Document)
                user_cv_document = "\n".join(document_parts)
                
                embeddings.append(vector_list)
                documents.append(user_cv_document)
                user_metadata = {
                    "id": user_id,
                    "fullName": user.get("fullName", "N/A"),
                    "years_of_experience": int(user.get("years_of_experience", 0)), 
                    "preferred_location": user.get("preferredLocation", "N/A"),
                    "position": user.get("position", "N/A"),
                    "organization": user.get("organization", "N/A"),

                    # Lương (đảm bảo là int, dùng snake_case)
                    "min_salary": int(user.get("minSalary", 0)), 
                    "max_salary": int(user.get("maxSalary", 0)),
                    
                    # Các trường như email, phone number, gender thường không cần thiết
                    # cho việc tìm kiếm Vector, nhưng có thể thêm nếu muốn lọc.
                }
                
                metadatas.append(user_metadata)
                ids.append(user_id)
            else:
                 logger.error(f"❌ LỖI VÉCTOR HÓA (ID {user_id}): {vector_list}")
                 
        if not ids:
            logger.warning("Không có User CV nào được vector hóa thành công để thêm.")
            return

        # 4. Upsert vào DB (Blocking I/O)
        try:
            add_func = partial(
                self.user_collection.upsert, 
                embeddings=embeddings,
                documents=documents,
                metadatas=metadatas,
                ids=ids
            )
            await asyncio.to_thread(add_func)
            logger.info(f"✅ Đã upsert {len(ids)} User Profiles.")
        except Exception as e:
            logger.error(f"❌ Lỗi khi upsert User Profiles vào VectorDB: {e}")
            raise

    async def add_raw_user_cv(self, user_id: str, cv_text: str, vector: List[float]):
        """
        Thêm/cập nhật một CV người dùng từ văn bản thô và vector đã có.
        """
        if not self.user_collection:
            raise RuntimeError("CV Collection chưa được khởi tạo.")

        try:
            # Dùng partial để wrap hàm blocking self.user_collection.upsert
            upsert_func = partial(
                self.user_collection.upsert,
                ids=[user_id],
                documents=[cv_text],
                embeddings=[vector],
                metadatas=[{"id": user_id}] # Có thể thêm metadata khác nếu cần
            )
            await asyncio.to_thread(upsert_func)
            logger.info(f"✅ Đã upsert CV thô cho User ID: {user_id}")
        except Exception as e:
            logger.error(f"❌ Lỗi khi upsert CV thô cho User ID {user_id}: {e}")
            raise

    async def get_user_cv_vector(self, user_id: str) -> Optional[Dict[str, Any]]:
        """
        Lấy vector và CV gốc của người dùng theo ID từ user_collection.
        """
        if not self.user_collection:
            raise RuntimeError("CV Collection chưa được khởi tạo.")

        try:
            # Gọi API lấy dữ liệu
            get_func = partial(
                self.user_collection.get,
                ids=[user_id],
                include=["embeddings", "documents", "metadatas"]
            )
            results = await asyncio.to_thread(get_func)
            
            
            # 1. TRÍCH XUẤT AN TOÀN
            ids = results.get('ids', [])
            documents = results.get('documents', [])
            embeddings = results.get('embeddings', [])
            metadatas = results.get('metadatas', [])

            # 2. KIỂM TRA DỮ LIỆU
            if not ids or len(ids) == 0:
                logger.warning(f"⚠️ Không tìm thấy dữ liệu CV cho User ID: {user_id}")
                return None

            # 3. ĐÓNG GÓI KẾT QUẢ
            if embeddings is not None and len(embeddings) > 0:
                current_vector = embeddings[0]
            
            if current_vector is None:
                logger.warning(f"⚠️ CV User {user_id} tồn tại nhưng chưa có vector.")
                return None
            
            result_data = {
                "user_id": ids[0],
                "cv_text": documents[0] if documents and documents[0] is not None else "",
                "vector": current_vector,
                "metadatas": metadatas[0] if metadatas and metadatas[0] is not None else {}
            }
            # Debug
            logger.info(f"✅ Đã tìm thấy vector/CV cho User {user_id}.")
            print("testinG!!!!")
            print(result_data)
            
            return result_data
            
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