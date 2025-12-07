import sys
import os
import asyncio 
from typing import List, Dict, Any

# Thêm thư mục gốc vào Python Path
# Giả định cấu trúc thư mục là: AI_service/seed_job.py (hoặc scripts/seed_job.py)
# Dùng os.path.join(os.path.dirname(__file__), '..') để thêm thư mục gốc
sys.path.append(os.path.join(os.path.dirname(__file__), '..')) 

# Giả định các import này là hợp lệ
from AI_service.service.ai.clients import FPTAIClient 
from AI_service.service.ai.vectordb import VectorDBClient 
from AI_service.core.config import settings 
# ĐÃ SỬA LỖI: Thay HistoryEntry bằng ProfileEntrySchema
from AI_service.schemas.schemas import ProfileEntrySchema, JobPostData, UserProfileData 

# Thiết lập Logging cơ bản để thấy được output
import logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


# --- DỮ LIỆU MẪU ĐÃ MỞ RỘNG (Sử dụng cấu trúc gần với Pydantic schema) ---

# Dữ liệu Jobs mẫu
SAMPLE_JOBS_RAW = [
    {
        "id": "job_001", 
        "title": "Senior Data Scientist (Python/Hà Nội)", 
        "numberOfVacancies": 10,
        "companyName": "TechCorp Vietnam",
        "companyId": "xyz-abcd",
        "description": "Yêu cầu kinh nghiệm xây dựng và triển khai các mô hình học máy (Deep Learning) trong môi trường sản xuất. Đánh giá và tối ưu hóa hiệu suất mô hình liên tục. Chịu trách nhiệm về pipeline dữ liệu.",
        "requirements": "5+ năm kinh nghiệm Data Scientist. Thành thạo Python, SQL, Docker, Kubeflow. Kiến thức vững về thống kê và thử nghiệm A/B.",
        "benefits": "Lương 2500 - 3500 USD, làm việc hybrid, bảo hiểm sức khỏe cao cấp.",
        "category": "Data & AI",
        "location": "Hanoi",
        "jobType": "Full-time",
        "minSalary": 2500,
        "maxSalary": 3500,
        "tags": ["Python", "Deep Learning", "SQL", "Scikit-learn", "Hanoi"]
    },
    {
        "id": "job_002", 
        "title": "Backend Developer (Node.js/TypeScript) - TP.HCM", 
        "numberOfVacancies": 10,
        "companyName": "Digital Pioneer Co.",
        "companyId": "abcd-xyz",
        "description": "Thiết kế và phát triển các API hiệu suất cao cho ứng dụng di động và web. Duy trì và cải thiện kiến trúc microservices hiện có.",
        "requirements": "3 năm kinh nghiệm lập trình Backend, thông thạo Node.js, TypeScript. Kinh nghiệm với MongoDB/PostgreSQL và CI/CD (Gitlab, Jenkins).",
        "benefits": "Môi trường trẻ trung, thưởng dự án, làm việc linh hoạt. Lương 1500 - 2000 USD.",
        "category": "Web Development",
        "location": "Ho Chi Minh",
        "jobType": "Full-time",
        "minSalary": 1500,
        "maxSalary": 2000,
        "tags": ["Node.js", "TypeScript", "Microservices", "MongoDB", "Ho Chi Minh"]
    },
]

# Dữ liệu User mẫu
SAMPLE_USERS_RAW = [
    {
        "id": "user_001",
        "fullName": "Nguyễn Văn A",
        "email": "a.nguyen@example.com",
        "phoneNumber": "0901234567",
        "position": "AI Engineer",
        "organization": "Independent",
        "years_of_experience": 5,
        "preferredLocation": "Hanoi",
        "minSalary": 2000,
        "maxSalary": 3000,
        "history": [
            {
                "type": "EXPERIENCE", 
                "title": "Lead Data Scientist", 
                "organization": "Innovate AI", 
                "description": "Lãnh đạo đội 5 người xây dựng mô hình NLP cho thị trường Việt Nam. Giảm thiểu 20% lỗi phân loại văn bản.",
                "startDate": "2022-01-01", 
                "endDate": "2024-01-01"
            },
            {
                "type": "EDUCATION", 
                "title": "Thạc sĩ Khoa học Máy tính", 
                "organization": "Đại học Bách Khoa Hà Nội", 
                "description": "Chuyên ngành AI và Machine Learning. Luận văn về Tối ưu hóa mô hình Transformer.",
                "startDate": "2018-09-01", 
                "endDate": "2020-09-01"
            }
        ]
    }
]

# --- HÀM HỖ TRỢ XÂY DỰNG TEXT CHO EMBEDDING ---


# --- CÁC HÀM ASYNC THAO TÁC DB ---

async def add_sample_jobs_to_db(db_client: VectorDBClient, sample_jobs_raw: List[Dict[str, Any]]):
    """Xử lý dữ liệu job thô, xây dựng text và thêm vào DB (ASYNC)."""

        
    try:
        logger.info(f"🔄 Đang thêm {len(sample_jobs_raw)} job mẫu vào VectorDB...")
        # Gọi hàm async add_jobs
        await db_client.add_jobs(sample_jobs_raw)
        logger.info("✅ Thêm job mẫu thành công!")
    except Exception as e:
        logger.error(f"❌ Lỗi trong quá trình thêm job: {e}")
        raise

async def add_sample_users_to_db(db_client: VectorDBClient, sample_users_raw: List[Dict[str, Any]]):

        
    try:
        logger.info(f"🔄 Đang thêm {len(sample_users_raw)} user profile mẫu vào VectorDB...")
        # Gọi hàm async add_users
        await db_client.add_user_cv(sample_users_raw)
        logger.info("✅ Thêm user profile mẫu thành công!")
    except Exception as e:
        logger.error(f"❌ Lỗi trong quá trình thêm user profile: {e}")
        raise


async def check_db_status(db_client: VectorDBClient):
    """Kiểm tra và in ra trạng thái hiện tại của DB (ASYNC)."""
    logger.info("\n--- BẮT ĐẦU KIỂM TRA VECTORDB ---")
    
    try:
        status_info = await db_client.get_info()
        job_count = status_info.get("job_count", 0)
        user_count = status_info.get("user_count", 0) # Giả định key là user_count
        
        logger.info(f"Tổng số job hiện có trong DB (jobs collection): {job_count}")
        logger.info(f"Tổng số User Profile (users collection): {user_count}")

        if job_count > 0 and user_count > 0:
            logger.info("✅ Dữ liệu mẫu Job và User đã được nhập thành công.")
        else:
            logger.warning("❌ DB thiếu dữ liệu mẫu.")
            
    except Exception as e:
        logger.error(f"❌ Lỗi khi lấy trạng thái DB: {e}")
        raise

async def add_data_if_empty(db_client: VectorDBClient) -> bool:
    """Kiểm tra xem DB có trống không để quyết định thêm dữ liệu (ASYNC)."""
    try:
        status_info = await db_client.get_info()
        job_count = status_info.get("job_count", 0)
        user_count = status_info.get("user_count", 0)
    except:
        job_count = 0
        user_count = 0
        
    if job_count == 0 or user_count == 0: 
        logger.info("-> DB Job hoặc User trống, đang nạp dữ liệu mẫu...")
        return True
    else:
        logger.info("-> DB đã có dữ liệu Job và User, bỏ qua bước nạp mẫu.")
        return False


# --- HÀM CHÍNH (ĐỒNG BỘ) ---

async def main():
    global ai_client
    global db_client
    logger.info("Bắt đầu quy trình khởi động ứng dụng...")
    ai_client = FPTAIClient()
    db_client = VectorDBClient(ai_client=ai_client)
    try:
        await db_client.initialize()
        logger.info(f"📦 Đang khởi tạo AI Client với model: {settings.EMBED_MODEL}")
    except Exception as e:
        logger.error(f"❌ Lỗi nghiêm trọng khi khởi tạo VectorDB. Chi tiết: {e}")
        # Quan trọng: Nếu DB không khởi động được, bạn có thể muốn dừng ứng dụng
        raise SystemExit(1)
    result = db_client.clear_all_data('all')
    if await add_data_if_empty(db_client):
        
        # 1. Thêm dữ liệu Jobs
        await add_sample_jobs_to_db(db_client, SAMPLE_JOBS_RAW)
        
        # 2. Thêm dữ liệu User Profiles
        await add_sample_users_to_db(db_client, SAMPLE_USERS_RAW)



if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        logger.info("Dừng chương trình.")
    except Exception as e:
        logger.error(f"Lỗi không xác định: {e}")