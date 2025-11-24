from pydantic import BaseModel, Field
from typing import List, Optional

# --- Ngữ cảnh người dùng ---
class UserContext(BaseModel):
    """Chứa thông tin ngữ cảnh về người dùng để cá nhân hóa câu trả lời."""
    age_range: Optional[str] = Field(None, description="Khoảng tuổi của người dùng, ví dụ: '25-34'")
    cv_industry: Optional[str] = Field(None, description="Ngành nghề chính rút ra từ CV.")
    interested_industry: Optional[str] = Field(None, description="Ngành nghề người dùng đang quan tâm.")

# --- Request Models ---
class TextRequest(BaseModel):
    text: str
    user_id: Optional[str] = None
    context: Optional[UserContext] = None # Thêm ngữ cảnh vào request

class MatchRequest(BaseModel):
    user_embedding: List[float]
    job_embedding: List[float]

class JobInput(BaseModel):
    id: str
    description: str
    category: str
    location: str
    min_salary: int
    job_type: str

class SalaryRange(BaseModel):
    min: Optional[int] = None
    max: Optional[int] = None

class JobFilter(BaseModel):
    selectedJobGroups: List[str] = []
    selectedCities: List[str] = []
    salaryRange: Optional[SalaryRange] = None
    workType: Optional[str] = None

class ConsultRequest(BaseModel):
    cv_text: str
    user_id: Optional[str] = None
    top_k: int = 3
    filters: Optional[JobFilter] = None

# --- Response Models ---
class ConsultReportResponse(BaseModel):
    title: str = "Báo cáo Phân tích Sự nghiệp Cá nhân"
    summary: str
    job_details: List[JobInput]
    recommendations: str
