from pydantic import BaseModel, Field, validator
from typing import List, Optional, Set, Union, Any
from datetime import datetime

class MatchRequest(BaseModel):
    user_embedding: List[float]
    job_embedding: List[float]

class UserContext(BaseModel):
    """
    Context tạm thời dùng để cá nhân hóa câu trả lời.
    Dữ liệu này được trích xuất từ VectorDB hoặc Session hiện tại.
    """
    cv_industry: Optional[str] = None       # Ngành nghề từ CV (Lấy từ metadatas VectorDB)
    interested_industry: Optional[str] = None # Ngành quan tâm (Lấy từ Filter request)
    age_range: Optional[str] = None         # Độ tuổi (Lấy từ metadatas hoặc User Profile)
    experience_level: Optional[str] = None  # Kinh nghiệm (Junior, Senior...)
    last_conversation_summary: Optional[str] = None # Tóm tắt câu hỏi cũ (nếu có)

class TextRequest(BaseModel):
    text: str
    user_id: Optional[str] = None
    context: Optional[UserContext] = None
# --- 1. DTO cho Thêm Job (/add-job) ---
class JobInput(BaseModel):
    id: str
    title: str
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
    cv_text: str  #Thường cho = None
    user_id: Optional[str] = None
    top_k: int = 3
    filters: Optional[JobFilter] = None

class ConsultReportResponse(BaseModel):
    title: str = "Báo cáo Phân tích Sự nghiệp Cá nhân" #PROMPT
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
    
class ProfileEntrySchema(BaseModel):
    """Schema cho một mục nhập Lịch sử (kinh nghiệm/học vấn) - tương ứng ProfileEntryDTO."""
    # Giả định ProfileEntryType được gửi dưới dạng string (vd: 'EXPERIENCE', 'EDUCATION')
    type: str = Field(..., description="Loại mục nhập (EXPERIENCE, EDUCATION, etc.)")
    organization: Optional[str] = Field(None, description="Tổ chức/Trường học")
    title: Optional[str] = Field(None, description="Chức danh/Văn bằng")
    startDate: Optional[str] = Field(None, description="Ngày bắt đầu")
    endDate: Optional[str] = Field(None, description="Ngày kết thúc")
    description: Optional[str] = Field(None, description="Mô tả công việc/thành tích")

# 4. class for DTO backend -------------------------------------------------------------------
class JobPostData(BaseModel):
    """Định nghĩa cấu trúc dữ liệu JobPost dựa trên JobPostDTO của backend."""
    id: str
    companyName: Optional[str] = None
    title: str
    category: Optional[str] = None
    location: Optional[str] = None
    numberOfVacancies: Optional[int] = 0
    jobType: Optional[str] = None
    applicationDeadline: Optional[Union[str, float, int]] = None
    minSalary: Optional[int] = 0
    maxSalary: Optional[int] = 0
    companyId: Optional[str] = None
    description: Optional[str] = ""
    requirements: Optional[str] = ""
    benefits: Optional[str] = ""
    schedule: Optional[str] = ""
    tags: Set[str] = set()

    @validator('applicationDeadline', pre=True)
    def parse_deadline(cls, v):
        if v is None:
            return None
        if isinstance(v, (int, float)):
            # Chuyển timestamp (giây) sang ISO format string
            return datetime.fromtimestamp(v).isoformat()
        return str(v)

class UserProfileData(BaseModel):
        userId: str
        fullName: str
        username: str
        email: str
        phoneNumber: str
        gender: str
        birthDate: str
        years_of_experience: int
        organization: str
        position: str
        preferredLocation: str
        minSalary: int
        maxSalary: int
        history: List[ProfileEntrySchema] = Field(default_factory=list, description="Danh sách các mục nhập lịch sử (kinh nghiệm, học vấn)")

class UserSyncSchema(BaseModel):
    id: str = Field(..., alias="userId")
    fullName: Optional[str] = None
    username: Optional[str] = None
    email: Optional[str] = None
    
    # SỬA: Cho phép nhận None (Optional[str] = None là chưa đủ với Pydantic v2 strict mode đôi khi)
    # Nhưng quan trọng nhất là type hint phải là Optional[str]
    phoneNumber: Optional[str] = None
    gender: Optional[str] = None
    birthDate: Optional[str] = None
    
    years_of_experience: Optional[int] = 0
    organization: Optional[str] = None
    position: Optional[str] = None
    preferredLocation: Optional[str] = None
    
    minSalary: Optional[int] = 0
    maxSalary: Optional[int] = 0
    
    history: List[Any] = []

    class Config:
        populate_by_name = True
        from_attributes = True
