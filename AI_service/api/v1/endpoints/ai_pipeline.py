from fastapi import APIRouter
from fastapi.responses import StreamingResponse

from ....schemas.schemas import TextRequest, MatchRequest, ConsultRequest
from ....service.ai.clients import FPTAIClient, FPTChromaAdapter
from ....service.ai.vectordb import VectorDBClient

router = APIRouter()

ai_client = FPTAIClient()
ADAPTER = FPTChromaAdapter(ai_client)
DB_CLIENT = VectorDBClient(ADAPTER)

@router.post("/consult")
def endpoint_pipeline(data: ConsultRequest):
    # 1. Refine text
    refined_text = ai_client.chat_refine(data.text)
    
    # 2. Embed text đã refine
    vector = ai_client.get_embedding(refined_text)

    yield "🔍 Đang quét cơ sở dữ liệu việc làm...\n"
        
    matched_jobs = DB_CLIENT.search_similar_jobs(
            query_text=data.cv_text, 
            n_results=3,
            filter_obj=data.filters
        )

    #report = ai_client.generate_report(job_id_list=)
    
    return {
        "original": data.text,
        "refined": refined_text,
        "embedding": vector
    }