from pydantic import BaseModel
from typing import List, Optional

class TextRequest(BaseModel):
    text: str
    user_id: Optional[str] = None

class MatchRequest(BaseModel):
    user_embedding: List[float]
    job_embedding: List[float]

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