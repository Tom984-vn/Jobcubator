from pydantic import BaseModel
from typing import List, Optional

class MatchRequest(BaseModel):
    user_embedding: List[float]
    job_embedding: List[float]

class UserContext(BaseModel):
    """
    Context tạm thời dùng để cá nhân hóa câu trả lời.
    Dữ liệu này được trích xuất từ VectorDB hoặc Session hiện tại.
    """
    cv_industry: Optional[str] = None       # Ngành nghề từ CV (Lấy từ Metadata VectorDB)
    interested_industry: Optional[str] = None # Ngành quan tâm (Lấy từ Filter request)
    age_range: Optional[str] = None         # Độ tuổi (Lấy từ Metadata hoặc User Profile)
    experience_level: Optional[str] = None  # Kinh nghiệm (Junior, Senior...)
    last_conversation_summary: Optional[str] = None # Tóm tắt câu hỏi cũ (nếu có)

class TextRequest(BaseModel):
    text: str
    user_id: Optional[str] = None
    context: Optional[UserContext] = None
# --- 1. DTO cho Thêm Job (/add-job) ---
class JobInput(BaseModel):
    id: str
    description: str
    category: str
    location: str
    min_salary: int
    job_type: str # E.g., 'Toàn thời gian', 'Remote'

# --- 2. DTO cho Lọc (Filters) ---
class SalaryRange(BaseModel):
    min: Optional[int] = None
    max: Optional[int] = None

class JobFilter(BaseModel):
    selectedJobGroups: List[str] = []
    selectedCities: List[str] = []
    salaryRange: Optional[SalaryRange] = None
    workType: Optional[str] = None
    # Lưu ý: Các filter khác như experience, position có thể được thêm sau

# --- 3. DTO cho Yêu cầu Tư vấn (/consult) ---
class ConsultRequest(BaseModel):
    cv_text: str
    user_id: Optional[str] = None
    top_k: int = 3
    filters: Optional[JobFilter] = None

class ConsultReportResponse(BaseModel):
    title: str = "Báo cáo Phân tích Sự nghiệp Cá nhân"
    summary: str # Tóm tắt chung về sự phù hợp CV
    job_details: List[JobInput] # Chi tiết từng job
    recommendations: str # Lời khuyên cá nhân hóa dựa trên hành vi (Context)

class DBStatusResponse(BaseModel):
    """
    Đầu ra cho endpoint kiểm tra trạng thái VectorDB (/debug/db-status).
    """
    collection_name: str
    total_count: int
    ids: List[str]
    message: str = "Thành công. Đã trả về các ID được giới hạn."