import httpx
import logging
from typing import Optional, Dict, Any
from AI_service.core.config import settings

logger = logging.getLogger(__name__)

class BackendClient:
    def __init__(self):
        self.base_url = settings.BACKEND_API_URL
        self.headers = {
            "Content-Type": "application/json",
            # Thêm API Key nếu backend yêu cầu
            # "X-Internal-Key": settings.INTERNAL_API_KEY 
        }
        # Timeout: kết nối 5s, đọc 10s (cần thiết cho prod)
        self.timeout = httpx.Timeout(10.0, connect=5.0)

    async def get_job_details(self, job_id: str) -> Optional[Dict[str, Any]]:
        """
        Gọi API GET /api/job_posts/{id} của Spring Boot.
        """
        url = f"{self.base_url}/job_posts/{job_id}"
        
        async with httpx.AsyncClient(timeout=self.timeout) as client:
            try:
                logger.info(f"🌍 Fetching Job data from Backend: {url}")
                response = await client.get(url, headers=self.headers)
                
                # Xử lý các trường hợp lỗi HTTP
                if response.status_code == 404:
                    logger.warning(f"⚠️ Job ID {job_id} không tồn tại trên Backend.")
                    return None
                
                response.raise_for_status() # Ném lỗi nếu 500, 403, etc.
                
                return response.json()
                
            except httpx.RequestError as e:
                logger.error(f"❌ Lỗi kết nối tới Backend Spring Boot: {e}")
                return None
            except httpx.HTTPStatusError as e:
                logger.error(f"❌ Lỗi HTTP từ Backend: {e.response.status_code} - {e.response.text}")
                return None