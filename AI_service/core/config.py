import os
from dotenv import load_dotenv

# Load biến từ file .env vào môi trường
load_dotenv()

class Settings:
    PROJECT_NAME = "Jobcubator"
    API_KEY = os.getenv("FPT_API_KEY")
    ENDPOINT = os.getenv("FPT_ENDPOINT")
    
    API_V1_STR: str = "/api/v1"
    # Các cấu hình mặc định khác
    EMBED_MODEL = "Vietnamese_Embedding"
    L_LLM_MODEL = "Llama-3.3-Swallow-70B-Instruct-v0.4"
    H_LLM_MODEL = "DeepSeek-R1"

    DB_PATH = "./chroma_data" # Tên thư mục chứa DB
    COLLECTION_NAME = "job_listings"
# Tạo một biến settings để dùng chung
settings = Settings()