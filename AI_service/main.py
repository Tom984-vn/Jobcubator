import requests
from fastapi import FastAPI, HTTPException
from fastapi.responses import StreamingResponse    
from schemas import TextRequest, MatchRequest  # Import từ schemas.py
from clients import FPTAIClient                # Import từ clients.py
from utils import JobMatcher       
from router import SemanticRouter           

# Khởi tạo App
app = FastAPI()

intent_router = SemanticRouter()

# Khởi tạo các object xử lý (Dependency Injection cơ bản)
ai_client = FPTAIClient()
matcher = JobMatcher()

@app.get("/")
def root():
    return {"message": "Jobcubator API is running!"}

@app.post("/centroid_vector")
def endpoint_centroid_vector():
    pass

@app.post("/embed")
def endpoint_embed(data: TextRequest):
    vector = ai_client.get_embedding(data.text)
    if not vector:
        raise HTTPException(status_code=500, detail="Lỗi tạo embedding từ AI")
    return {"embedding": vector}

@app.post("/match")
def endpoint_match(data: MatchRequest):
    score = matcher.compute_similarity(data.user_embedding, data.job_embedding)
    return {"score": score}

@app.post("/pipeline")
def endpoint_pipeline(data: TextRequest):
    # 1. Refine text
    refined_text = ai_client.chat_refine(data.text)
    
    # 2. Embed text đã refine
    vector = ai_client.get_embedding(refined_text)

    top_suitable_job = []    #tìm cách để phân loại job và tính điểm từ đấy
                             # Tạo và lưu trữ một centroid vector cho mỗi ngành nghề
    endpoint_match()

    #report = ai_client.generate_report(job_id_list=)
    
    return {
        "original": data.text,
        "refined": refined_text,
        "embedding": vector
    }
@app.post("/chat/general")  #Hàm gọi API khi người dùng chat
def endpoint_general_chat(data: TextRequest):
    def output_generator():
        # Truyền router vào hàm xử lý
        stream = ai_client.smart_chat(data.text, intent_router)
        
        for chunk in stream:
            if "choices" in chunk and len(chunk["choices"]) > 0:
                delta = chunk["choices"][0].get("delta", {})
                if "content" in delta:
                    yield delta["content"]

    return StreamingResponse(output_generator(), media_type="text/plain")

@app.get("/config/suggestions")  #Phải init ngay khi người dùng mở trang web
def get_chat_suggestions():
    """
    API trả về danh sách câu hỏi gợi ý cho người dùng chọn.
    """
    suggestions = intent_router.get_all_suggestions()
    return {
        "suggestions": suggestions,
        "count": len(suggestions)
    }