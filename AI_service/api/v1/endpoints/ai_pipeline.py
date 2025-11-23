from fastapi import APIRouter
from fastapi.responses import StreamingResponse

from AI_service.schemas.schemas import TextRequest, MatchRequest, ConsultRequest, ConsultReportResponse
from AI_service.service.ai.clients import FPTAIClient, FPTChromaAdapter
from AI_service.service.ai.vectordb import VectorDBClient

router = APIRouter()

ai_client = FPTAIClient()
db_client = VectorDBClient()

def get_user_context_mock(user_id: str) -> str:
    if user_id == "user_thich_remote":
        return "Người dùng có xu hướng tìm kiếm các công việc làm từ xa (Remote/Hybrid)."
    return ""
@router.post("/consult")
def endpoint_pipeline(data: ConsultRequest):
    # 1. Refine text
    refined_text = ai_client.chat_refine(data.cv_text)
    
    # 2. Embed text đã refine
    vector = ai_client.get_embedding(refined_text)

    user_context = get_user_context_mock(data.user_id)

    yield "🔍 Đang quét cơ sở dữ liệu việc làm...\n"
        
    matched_jobs = db_client.search_similar_jobs(
            query_vector=vector, 
            n_results=3,
            filter_obj=data.filters
        )
    if not matched_jobs:
        return ConsultReportResponse(
            title="Không tìm thấy việc làm",
            summary="Không có công việc nào phù hợp tiêu chí.",
            job_details=[],
            recommendations="Hãy thử mở rộng bộ lọc tìm kiếm."
        )

    report_data = ai_client.generate_report(
        cv_text=data.cv_text,
        matched_jobs=matched_jobs,
        user_behavior_text=user_context
    )

    return report_data
    