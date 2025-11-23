from fastapi import APIRouter
from fastapi.responses import StreamingResponse

from ....schemas.schemas import TextRequest, MatchRequest, ConsultRequest
from ....service.ai.clients import FPTAIClient, FPTChromaAdapter
from ....service.ai.vectordb import VectorDBClient

router = APIRouter()

ai_client = FPTAIClient()
ADAPTER = FPTChromaAdapter(ai_client)
db_client = VectorDBClient(ADAPTER)

def get_user_context_mock(user_id: str) -> str:
    if user_id == "user_thich_remote":
        return "Người dùng có xu hướng tìm kiếm các công việc làm từ xa (Remote/Hybrid)."
    return ""
@router.post("/consult")
def endpoint_pipeline(data: ConsultRequest):
    # 1. Refine text
    refined_text = ai_client.chat_refine(data.text)
    
    # 2. Embed text đã refine
    vector = ai_client.get_embedding(refined_text)

    user_context = get_user_context_mock(data.user_id)

    yield "🔍 Đang quét cơ sở dữ liệu việc làm...\n"
        
    matched_jobs = db_client.search_similar_jobs(
            query_text=data.cv_text, 
            n_results=3,
            filter_obj=data.filters
        )

    report_data = ai_client.generate_structured_report(
        cv_text=data.cv_text,
        matched_jobs=matched_jobs,
        user_behavior_text=user_context
    )

    return report_data
    