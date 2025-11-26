import os
from dotenv import load_dotenv
from pathlib import Path
# Lấy đường dẫn tuyệt đối của thư mục chứa file config.py
CONFIG_DIR = Path(__file__).resolve().parent

# Lấy đường dẫn đến file .env: Lùi một cấp từ core/ để đến AI_service/
DOTENV_PATH = CONFIG_DIR.parent / ".env" 

# Load biến từ file .env vào môi trường, sử dụng đường dẫn tuyệt đối
# Đây là bước quan trọng để đảm bảo .env được tìm thấy dù bạn chạy lệnh uvicorn ở đâu
load_dotenv(dotenv_path=DOTENV_PATH)

# Load biến từ file .env vào môi trường
load_dotenv()

class Settings:
    PROJECT_NAME = "Jobcubator"
    API_KEY = os.getenv("FPT_API_KEY")
    ENDPOINT = os.getenv("FPT_ENDPOINT")
    
    API_V1_STR: str = "/api/v1"
    # Các cấu hình mặc định khác
    EMBED_MODEL = "Vietnamese_Embedding"
    L_LLM_MODEL = "Llama-3.3-70B-Instruct"
    #H_LLM_MODEL = "DeepSeek-R1"
    H_LLM_MODEL = "GLM-4.5"

    DB_PATH = "./chroma_data" # Tên thư mục chứa DB
    COLLECTION_NAME = "job_listings"
    USER_COLLECTION_NAME = "user_cv_storage"
# Tạo một biến settings để dùng chung
settings = Settings()