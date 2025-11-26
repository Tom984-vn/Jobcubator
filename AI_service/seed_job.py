
import sys
import os
from typing import List, Dict, Any

# Thêm thư mục gốc vào Python Path
sys.path.append(os.path.join(os.path.dirname(__file__), '..')) 

from AI_service.service.ai.clients import FPTAIClient
from AI_service.service.ai.vectordb import VectorDBClient 
from AI_service.core.config import settings 


# --- KHỐI DỮ LIỆU MẪU (SỬ DỤNG BIẾN TOÀN CỤC) ---
SAMPLE_JOBS = [
    {
        "id": 1, 
        "title": "Data Scientist (Python/Hà Nội)", 
        "group": "Data", 
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
        "id": 2, 
        "title": "Backend Developer (Python/Django) - TP.HCM", 
        "group": "Web", 
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
        "id": 3, 
        "title": "Frontend Developer", 
        "group": "Web", 
        "description": "Tìm kiếm ứng viên có kinh nghiệm từ 2 năm trở lên với ReactJS, Redux, và HTML/CSS. Có kinh nghiệm làm việc với các UI component library.",
        "metadatas": {
            "group": "Web",
            "location": "Hanoi",
            "workType": "Full-time",
            "min_salary": 1000,
            "max_salary": 2000
        }
    },
    {
        "id": 4, 
        "title": "AI Engineer (NLP)", 
        "group": "AI", 
        "description": "Cần tuyển kỹ sư AI có kiến thức về xử lý ngôn ngữ tự nhiên (NLP) và thị giác máy tính (Computer Vision). Sử dụng thành thạo PyTorch hoặc TensorFlow.",
        "metadatas": {
            "group": "AI",
            "location": "Hanoi",
            "workType": "Full-time",
            "min_salary": 2000,
            "max_salary": 3000
        }
    },
    {
        "id": 5, 
        "title": "Kế toán tổng hợp", 
        "group": "Kinh tế", 
        "description": "Yêu cầu tốt nghiệp chuyên ngành kế toán, kiểm toán. Có ít nhất 3 năm kinh nghiệm ở vị trí tương đương, nắm vững các quy định về thuế và báo cáo tài chính.",
        "metadatas": {
            "group": "Kinh tế",
            "location": "Hanoi",
            "workType": "Full-time",
            "min_salary": 1500,
            "max_salary": 3000
        }
    }
] 


def add_sample_jobs_to_db(db_client_for_db: VectorDBClient, sample_jobs: List[Dict[str, Any]]):
    """Thêm dữ liệu job mẫu vào DB."""
    try:
        print(f"🔄 Đang thêm {len(sample_jobs)} job mẫu vào VectorDB...")
        # LƯU Ý: Nếu hàm này không in ra lỗi, hãy kiểm tra lại logic trong VectorDBClient.add_jobs
        db_client_for_db.add_jobs(sample_jobs)
        print("✅ Thêm job mẫu thành công! VectorDB đã sẵn sàng.")

        print("\n--- TRẠNG THÁI SAU KHI THÊM/CẬP NHẬT ---")
        # Gọi hàm kiểm tra status
        check_db_status(db_client_for_db) 
        
    except Exception as e:
        print(f"❌ Lỗi trong quá trình khởi tạo và thêm job: {e}")


def check_db_status(db_client_for_db: VectorDBClient):
    """Kiểm tra và in ra trạng thái hiện tại của DB (Số lượng và 3 job mẫu)."""
    print("\n--- BẮT ĐẦU KIỂM TRA VECTORDB ---")
    
    # SỬA LỖI: Gọi hàm thông qua đối tượng
    job_count = db_client_for_db.update_status () # Dùng count_jobs() thay vì update_status()
    print(f"Tổng số job hiện có trong DB: {job_count}")

    if job_count > 0:
        print("✅ Dữ liệu mẫu đã được nhập thành công.")
        # Thêm logic in 3 job mẫu ở đây nếu bạn đã implement get_first_n_jobs
    else:
        print("❌ DB chưa có dữ liệu nào.")


def add_jobs_if_empty(db_client_for_db: VectorDBClient):
    """Kiểm tra xem DB có trống không để quyết định thêm dữ liệu."""
    
    # SỬA LỖI: Gọi hàm thông qua đối tượng
    if db_client_for_db.update_status() == 0: # Dùng count_jobs() thay vì update_status()
        print("-> DB trống, đang nạp dữ liệu mẫu...")
        return True # Trả về True để chạy hàm thêm
    else:
        print("-> DB đã có dữ liệu, bỏ qua bước nạp mẫu.")
        return False # Trả về False

def add_sample_user_cvs(ai_client: FPTAIClient):
    """
    Thêm CV mẫu của người dùng vào VectorDB, kèm theo Vector Embedding.
    """


    sample_user_cvs = [
        {
            "user_id": "test_user_001",
            "username": "AI_Engineer_Test",
            "full_cv_text": "Tôi có 5 năm kinh nghiệm làm Data Scientist và AI Engineer. Chuyên sâu về thuật toán học sâu (Deep Learning), xử lý ngôn ngữ tự nhiên (NLP) với PyTorch. Đã xây dựng và triển khai các mô hình phân loại văn bản và trích xuất thông tin.",
            "preferred_jobs": ["AI Engineer", "Data Scientist"]
        },
        {
            "user_id": "test_user_002",
            "username": "Backend_Dev_Test",
            "full_cv_text": "Kinh nghiệm 3 năm phát triển ứng dụng Backend bằng Python, Django, và FastAPI. Thành thạo cơ sở dữ liệu PostgreSQL và kỹ thuật CI/CD với Docker. Quan tâm đến các công việc phát triển Web.",
            "preferred_jobs": ["Backend Developer", "Web Developer"]
        },
        {
            "user_id": "user_12345",
            "username": "LMAO IM SO FUCKING TIRED",
            "full_cv_text": "Tôi là một kỹ sư phần mềm có 5 năm kinh nghiệm làm việc với Python, đặc biệt là framework Django và FastAPI. Tôi có kinh nghiệm triển khai dự án trên AWS, sử dụng Docker và Kubernetes. Tôi quan tâm đến các vị trí Backend hoặc Cloud Engineering tại Hà Nội.",
            "preferred_jobs": ["AI Engineer", "Data Scientist"]
        }
    ]
    
    documents = []
    metadatas = []
    ids = []
    
    print("\n[USER CV PIPELINE] Bắt đầu vector hóa CV và thêm vào DB...")

    for user in sample_user_cvs:
        user_id = user["user_id"]
        cv_text = user["full_cv_text"]
        
        # 1. Pipeline Vector Embedding
        try:
            vector_list = ai_client.get_embedding(cv_text)
        except Exception as api_e:
            print(f"❌ LỖI VÉCTOR HÓA CV ({user_id}): {api_e}")
            continue
            
        if vector_list:
            documents.append(cv_text)
            metadatas.append({
                "user_id": user_id, 
                "username": user["username"], 
                "preferred_jobs": ", ".join(user["preferred_jobs"]) 
            })
            ids.append(user_id)
            print(f"   -> Vector hóa thành công cho User: {user_id}")
        else:
            print(f"⚠️ Cảnh báo: CV của {user_id} không tạo được vector.")

    # 2. Lưu trữ vào VectorDB (Nếu bạn có UserVectorDBClient, hãy dùng hàm add của nó)
    if ids:
        try:
            # ⚠️ LƯU Ý: Nếu bạn dùng chung Job DB (VectorDBClient), bạn phải dùng Collection khác!
            # Tôi giả định bạn đã tạo một Collection User riêng trong UserVectorDBClient
            
            # Nếu dùng chung client:
            # user_collection = db_client_for_db.client.get_or_create_collection(name="user_cvs", embedding_function=db_client_for_db.embedding_func)
            # user_collection.add(documents=documents, metadatas=metadatas, ids=ids, embeddings=vectors)
            
            print(f"✅ Thành công: Đã tạo {len(ids)} vector CV mẫu.")
            
            # --- KIỂM TRA ĐỘ CHÍNH XÁC ---
            test_query = "Tìm kiếm việc làm cho tôi"
            # ⚠️ Giả định hàm search_similar_jobs của bạn có thể nhận vector hoặc text
            results = db_client_for_db.search_similar_jobs(query_text=test_query, n_results=1) 
            # Dòng này chỉ để kiểm tra API, không phải logic tư vấn cuối cùng
            
        except Exception as e:
            print(f"❌ Lỗi DB/Kiểm tra: {e}")

if __name__ == "__main__":
    # Khởi tạo Client AI và DB Client MỘT LẦN duy nhất
    print(f"📦 Đang khởi tạo AI Client với model: {settings.EMBED_MODEL}")
    ai_client_for_db = FPTAIClient()
    db_client_for_db = VectorDBClient(ai_client=ai_client_for_db)
    result = db_client_for_db.clear_all_data('all')

    # 1. Kiểm tra và quyết định có thêm job hay không
    if add_jobs_if_empty(db_client_for_db):
        # 2. Nếu trống, thì thêm dữ liệu
        add_sample_jobs_to_db(db_client_for_db, SAMPLE_JOBS)
    
    # 3. Luôn kiểm tra trạng thái cuối cùng (trường hợp DB đã có dữ liệu từ đầu)
    check_db_status(db_client_for_db)
    add_sample_user_cvs(ai_client_for_db)