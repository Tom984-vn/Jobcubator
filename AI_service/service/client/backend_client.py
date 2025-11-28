import httpx 
from httpx import AsyncClient
import logging
from typing import Optional, Dict, Any, AsyncGenerator

# Giả định bạn có một file config chứa các thiết lập môi trường
# Ví dụ: BACKEND_API_URL = "http://localhost:8080/api/v1"
from AI_service.core.config import settings 

logger = logging.getLogger(__name__)

class BackendClient:
    """
    Client bất đồng bộ (async) để tương tác với Backend Spring Boot.
    Sử dụng httpx cho các yêu cầu HTTP không chặn.
    """
    http_client: AsyncClient 
    def __init__(self):
        # Đảm bảo URL cơ sở (base URL) được chuẩn hóa (ví dụ: loại bỏ dấu '/')
        self.base_url = settings.BACKEND_API_URL.rstrip('/') 
        self.headers = {
            "Content-Type": "application/json",
            # Thêm các header cần thiết cho việc xác thực nội bộ (Internal API Key)
            # "X-Internal-Key": settings.INTERNAL_API_KEY 
        }
        # Thiết lập Timeout: Connection (5s), Read (10s)
        self.http_client = httpx.AsyncClient(
            base_url=self.base_url,
            timeout=10.0, # Đặt timeout mặc định
            # Có thể thêm các headers, giới hạn kết nối tại đây
            headers=self.headers,
            # Thêm các header cần thiết cho việc xác thực nội bộ (Internal API Key)
            # "X-Internal-Key": settings.INTERNAL_API_KEY 
        )

    async def get_job_details(self, job_id: str) -> Optional[Dict[str, Any]]:
        """
        Thực hiện gọi API GET để lấy chi tiết một Job Post từ Backend.
        
        Args:
            job_id (str): ID của Job Post.
            
        Returns:
            Optional[Dict[str, Any]]: Dữ liệu JSON của Job Post, hoặc None nếu có lỗi/không tìm thấy.
        """
        # Giả định endpoint để lấy chi tiết Job là /job_posts/{id}
        url = f"{self.base_url}/job_posts/{job_id}"
        
        # Dùng httpx.AsyncClient bên trong method để quản lý lifecycle (tài nguyên) của client
        # tốt hơn, đặc biệt trong các tác vụ nền.
        async with httpx.AsyncClient(timeout=self.timeout) as client:
            try:
                logger.info(f"🌍 Đang gửi yêu cầu GET tới Backend: {url}")
                
                # Thực hiện yêu cầu GET bất đồng bộ
                response = await client.get(url, headers=self.headers)
                
                # Kiểm tra trạng thái 404 (Không tìm thấy)
                if response.status_code == 404:
                    logger.warning(f"⚠️ Job ID {job_id} không tồn tại (404 Not Found) trên Backend.")
                    return None
                
                # Ném lỗi nếu trạng thái HTTP là lỗi (4xx hoặc 5xx, trừ 404 đã xử lý)
                response.raise_for_status()
                
                # Trả về dữ liệu JSON
                return response.json()
                
            except httpx.RequestError as e:
                # Xử lý các lỗi liên quan đến kết nối (DNS, Timeout, Connection Refused,...)
                logger.error(f"❌ Lỗi kết nối tới Backend Spring Boot tại {url}: {e}")
                return None
            except httpx.HTTPStatusError as e:
                # Xử lý các lỗi HTTP khác (5xx Server Errors, 4xx Client Errors)
                logger.error(f"❌ Lỗi HTTP từ Backend: {e.response.status_code} - {e.response.text[:100]}...")
                return None
            except Exception as e:
                # Xử lý các lỗi không xác định khác
                logger.error(f"❌ Lỗi không xác định khi gọi Backend API: {e}")
                return None

