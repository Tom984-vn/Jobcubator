import requests
import logging
from typing import Optional, Dict, Any, TypedDict

from AI_service.schemas.schemas import JobPostData

# Cấu hình logging
logger = logging.getLogger(__name__)

class JobPostFetcher:
    """
    Lớp chịu trách nhiệm gọi API từ backend Spring Boot để lấy thông tin Job Post.
    """
    def __init__(self, base_url: str):
        """
        Khởi tạo với URL gốc của API.
        """
        self.base_url = base_url

    def fetch_job_post_by_id(self, job_id: str) -> Optional[JobPostData]:
        """
        Thực hiện GET request đến /api/job_posts/{id} để lấy chi tiết bài đăng.

        :param job_id: ID (UUID) của bài đăng cần lấy.
        :return: Đối tượng JobPostData (Dict) nếu thành công, ngược lại là None.
        """
        endpoint = f"{self.base_url}/api/job_posts/{job_id}"
        
        try:
            logger.info(f"Đang thực hiện gọi API: GET {endpoint}")
            
            # Giới hạn timeout để tránh treo chương trình
            response = requests.get(endpoint, timeout=10)
            
            # Kiểm tra mã trạng thái HTTP
            response.raise_for_status() 
            
            # Nếu request thành công (mã 200)
            job_data: JobPostData = response.json()
            logger.info(f"✅ Tải dữ liệu Job Post '{job_data.get('title', 'N/A')}' thành công.")
            
            return job_data

        except requests.exceptions.HTTPError as e:
            if e.response.status_code == 404:
                logger.warning(f"⚠️ Lỗi 404: Không tìm thấy Job Post với ID '{job_id}'.")
            else:
                logger.error(f"❌ Lỗi HTTP {e.response.status_code} khi gọi API: {e}")
            return None
        
        except requests.exceptions.RequestException as e:
            logger.error(f"❌ Lỗi kết nối hoặc yêu cầu: {e}")
            return None
            
        except ValueError as e:
            logger.error(f"❌ Lỗi phân tích cú pháp JSON từ phản hồi: {e}")
            return None


# --- 3. Script kiểm tra (Sử dụng tạm thời trong file này) ---
if __name__ == '__main__':
    # THAY THẾ BẰNG URL BACKEND THỰC CỦA BẠN KHI CHẠY
    MOCK_API_URL = "https://inns-courage-adjust-merit.trycloudflare.com/"
    SAMPLE_JOB_ID_SUCCESS = "019ac0ed-54c5-7fcd-adb1-9045f11e3960" 
    
    fetcher = JobPostFetcher(base_url=MOCK_API_URL)
    
    print("\n--- TEST: Lấy dữ liệu Job Post thành công ---")
    job_post = fetcher.fetch_job_post_by_id(SAMPLE_JOB_ID_SUCCESS)
    
    if job_post:
        print(f"\n[Kết quả] Title: {job_post.get('title')}, Lương: {job_post.get('minSalary')}-{job_post.get('maxSalary')}")
    else:
        print("[Kết quả] Không thể lấy dữ liệu.")