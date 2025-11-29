import sys
import os
import asyncio # Cần import asyncio để chạy các hàm async
from typing import List, Dict, Any, Type

# Thêm thư mục gốc vào Python Path
# Giả định cấu trúc thư mục là: AI_service/scripts/seed_job.py
sys.path.append(os.path.join(os.path.dirname(__file__), '..')) 

# Giả định các import này là hợp lệ
from AI_service.service.ai.clients import FPTAIClient 
from AI_service.service.ai.vectordb import VectorDBClient 
from AI_service.core.config import settings 

# Thiết lập Logging cơ bản để thấy được output
import logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


# --- KHỐI DỮ LIỆU MẪU (SỬ DỤNG BIẾN TOÀN CỤC) ---
SAMPLE_JOBS = [
    {
        # Cấu trúc đã được chuẩn hóa để phù hợp với JobPostData/add_jobs
        "id": "job_001", 
        "title": "Data Scientist (Python/Hà Nội)", 
        "description": "Yêu cầu kinh nghiệm làm việc với Python, SQL và các thư viện học máy như Scikit-learn, TensorFlow. Có khả năng xây dựng mô hình dự đoán và phân tích dữ liệu lớn.",
        "metadatas": {
            "group": "Data",
            "location": "Hanoi",
            "workType": "Full-time",
            "min_salary": 1800,
            "max_salary": 2500
        }
    },
    {
        "id": "job_002", 
        "title": "Backend Developer (Python/Django) - TP.HCM", 
        "description": "Tuyển dụng lập trình viên Backend thông thạo Python và framework Django/FastAPI. Kinh nghiệm làm việc với RESTful API, PostgreSQL và Docker là một lợi thế.",
        "metadatas": {
            "group": "Web",
            "location": "Ho Chi Minh",
            "workType": "Full-time",
            "min_salary": 1500,
            "max_salary": 2200
        }
    },
    {
        "id": "job_003", 
        "title": "AI Engineer (NLP)", 
        "description": "Cần tuyển kỹ sư AI có kiến thức về xử lý ngôn ngữ tự nhiên (NLP) và thị giác máy tính (Computer Vision). Sử dụng thành thạo PyTorch hoặc TensorFlow.",
        "metadatas": {
            "group": "AI",
            "location": "Hanoi",
            "workType": "Full-time",
            "min_salary": 2000,
            "max_salary": 3000
        }
    }
] 

# Dữ liệu CV mẫu (Sẽ được xử lý qua hàm add_user_cv)
SAMPLE_USER_CVS = [
    {
        "user_id": "test_user_001",
        "username": "AI_Engineer_Test",
        "full_cv_text": "Tôi có 5 năm kinh nghiệm làm Data Scientist và AI Engineer. Chuyên sâu về thuật toán học sâu (Deep Learning), xử lý ngôn ngữ tự nhiên (NLP) với PyTorch. Đã xây dựng và triển khai các mô hình phân loại văn bản và trích xuất thông tin.",
        "preferred_jobs": ["AI Engineer", "Data Scientist"],
        "metadatas": {"years_of_experience": 5, "position": "AI Engineer"}
    },
    {
        "user_id": "test_user_002",
        "username": "Backend_Dev_Test",
        "full_cv_text": "Kinh nghiệm 3 năm phát triển ứng dụng Backend bằng Python, Django, và FastAPI. Thành thạo cơ sở dữ liệu PostgreSQL và kỹ thuật CI/CD với Docker. Quan tâm đến các công việc phát triển Web.",
        "preferred_jobs": ["Backend Developer", "Web Developer"],
        "metadatas": {"years_of_experience": 3, "position": "Backend Developer"}
    }
]


# --- CÁC HÀM ASYNC THAO TÁC DB ---

async def add_sample_jobs_to_db(db_client_for_db: VectorDBClient, sample_jobs: List[Dict[str, Any]]):
    """Thêm dữ liệu job mẫu vào DB (ASYNC)."""
    try:
        logger.info(f"🔄 Đang thêm {len(sample_jobs)} job mẫu vào VectorDB...")
        # Gọi hàm async add_jobs
        await db_client_for_db.add_jobs(sample_jobs)
        logger.info("✅ Thêm job mẫu thành công! VectorDB đã sẵn sàng.")

        await check_db_status(db_client_for_db) 
        
    except Exception as e:
        logger.error(f"❌ Lỗi trong quá trình khởi tạo và thêm job: {e}")
        raise

async def check_db_status(db_client_for_db: VectorDBClient):
    """Kiểm tra và in ra trạng thái hiện tại của DB (ASYNC)."""
    logger.info("\n--- BẮT ĐẦU KIỂM TRA VECTORDB ---")
    
    try:
        # Gọi hàm async get_info
        status_info = await db_client_for_db.get_info()
        job_count = status_info.get("job_count", 0)
        
        logger.info(f"Tổng số job hiện có trong DB (jobs collection): {job_count}")
        logger.info(f"Tổng số User Profile (user_profiles collection): {status_info.get('user_profile_count', 0)}")
        logger.info(f"Tổng số CV (user_cvs collection): {status_info.get('user_cv_count', 0)}")


        if job_count > 0:
            logger.info("✅ Dữ liệu mẫu Job đã được nhập thành công.")
        else:
            logger.warning("❌ DB Jobs chưa có dữ liệu nào.")
            
    except Exception as e:
        logger.error(f"❌ Lỗi khi lấy trạng thái DB: {e}")
        raise

async def add_jobs_if_empty(db_client_for_db: VectorDBClient) -> bool:
    """Kiểm tra xem DB có trống không để quyết định thêm dữ liệu (ASYNC)."""
    try:
        status_info = await db_client_for_db.get_info()
        job_count = status_info.get("job_count", 0)
    except:
        # Nếu lỗi (ví dụ: DB không kết nối được), coi như trống và cố gắng nạp lại
        job_count = 0
        
    if job_count == 0: 
        logger.info("-> DB Jobs trống, đang nạp dữ liệu mẫu...")
        return True # Trả về True để chạy hàm thêm
    else:
        logger.info("-> DB Jobs đã có dữ liệu, bỏ qua bước nạp mẫu.")
        return False # Trả về False

async def add_sample_user_cvs(ai_client: FPTAIClient, db_client_for_db: VectorDBClient, sample_cvs: List[Dict[str, Any]]):
    """
    Vector hóa CV mẫu và thêm vào VectorDB (ASYNC).
    Sử dụng luồng add_user_cv (vector đã tính sẵn).
    """
    
    logger.info("\n[USER CV PIPELINE] Bắt đầu vector hóa CV và thêm vào DB...")
    
    for user in sample_cvs:
        user_id = user["user_id"]
        cv_text = user["full_cv_text"]
        metadatas = user["metadatas"]
        
        # 1. Pipeline Vector Embedding (Giả định ai_client.get_embedding là async)
        try:
            # Lưu ý: Nếu FPTAIClient không phải async, cần dùng asyncio.to_thread
            vector_list = await ai_client.get_embedding(cv_text)
        except AttributeError:
            # Xử lý khi ai_client.get_embedding là đồng bộ (blocking)
            logger.warning("FPTAIClient.get_embedding không phải async, đang chạy qua asyncio.to_thread...")
            try:
                vector_list = await asyncio.to_thread(ai_client.get_embedding, cv_text)
            except Exception as api_e:
                logger.error(f"❌ LỖI VÉCTOR HÓA CV ({user_id}): {api_e}")
                continue
        except Exception as api_e:
            logger.error(f"❌ LỖI VÉCTOR HÓA CV ({user_id}): {api_e}")
            continue

        if vector_list:
            # 2. Lưu trữ vào VectorDB (Gọi hàm async add_user_cv)
            try:
                await db_client_for_db.add_user_cv(user_id, cv_text, vector_list, metadatas)
                logger.info(f"   -> Đã lưu CV thành công cho User: {user_id}")

            except Exception as e:
                logger.error(f"❌ Lỗi DB khi lưu CV ({user_id}): {e}")
                
        else:
            logger.warning(f"⚠️ Cảnh báo: CV của {user_id} không tạo được vector.")
    
    logger.info("✅ Hoàn tất pipeline CV mẫu.")


# --- HÀM CHÍNH (ĐỒNG BỘ) ---

async def main():
    # Khởi tạo Client AI và DB Client MỘT LẦN duy nhất
    logger.info(f"📦 Đang khởi tạo AI Client với model: {settings.EMBED_MODEL}")
    # Giả định VectorDBClient chấp nhận ai_client làm embedding_model
    ai_client_for_db = FPTAIClient()
    db_client_for_db = VectorDBClient(ai_client=ai_client_for_db) 
    
    # 0. Xóa tất cả dữ liệu để chạy lại từ đầu (Tùy chọn)
    # db_client_for_db.clear_all_data('all') # Giả định hàm này tồn tại và là sync

    # 1. Kiểm tra và quyết định có thêm job hay không
    if await add_jobs_if_empty(db_client_for_db):
        # 2. Nếu trống, thì thêm dữ liệu Jobs
        await add_sample_jobs_to_db(db_client_for_db, SAMPLE_JOBS)
    
    # 3. Thêm dữ liệu CV mẫu (Luôn chạy để kiểm tra luồng CV)
    await add_sample_user_cvs(ai_client_for_db, db_client_for_db, SAMPLE_USER_CVS)
    
    # 4. Luôn kiểm tra trạng thái cuối cùng
    await check_db_status(db_client_for_db)


if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        logger.info("Dừng chương trình.")
    except Exception as e:
        logger.error(f"Lỗi không xác định: {e}")