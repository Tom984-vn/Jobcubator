from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from fastapi.responses import StreamingResponse
from typing import List, Dict, Any, Optional
import json
import asyncio
import logging
from functools import partial

# Import các thành phần của Pipeline
from AI_service.schemas.schemas import ConsultRequest, ConsultReportResponse, JobFilter, JobInput # Giả định ConsultRequest có user_id, cv_text, filters
from AI_service.service.ai.clients import FPTAIClient
from AI_service.service.ai.vectordb import VectorDBClient
from AI_service.core.dependencies import AIClientDep, DBClientDep

logger = logging.getLogger(__name__)
router = APIRouter()


# Định nghĩa router
router = APIRouter()

# --- HÀM HỖ TRỢ CHO STREAMING ---
async def _create_and_store_cv_vector(
    user_id: str, 
    cv_text: str, 
    ai_client: FPTAIClient, 
    db_client: VectorDBClient
) -> Optional[List[float]]:
    """Hàm hỗ trợ: Vector hóa CV mới và lưu/cập nhật vào DB."""
    logger.info(f"🔄 Đang vector hóa CV mới cho user: {user_id}...")
    
    try:
        # Gọi FPTAIClient để tạo vector
        vector_list = await ai_client.get_embedding(cv_text)
        
        if vector_list is not None and len(vector_list) > 0:
            await db_client.add_raw_user_cv(
                user_id=user_id, cv_text=cv_text, vector=vector_list
            )
            return vector_list
    except Exception as e:
        logger.error(f"❌ Lỗi: Không thể tạo vector cho CV của {user_id}. {e}")
        return None

    return None

async def consult_job_rag_logic(
    user_id: str, 
    cv_text: str, 
    ai_client: FPTAIClient, 
    db_client: VectorDBClient,
    top_k: int = 3, 
    filters: Optional[JobFilter] = None
) -> Dict[str, Any]:
    """
    Thực hiện RAG Pipeline hoàn chỉnh non-streaming.
    """
    
    # --- BƯỚC 1: TRUY VẤN/TẠO CV VECTOR CỦA NGƯỜI DÙNG ---
    user_cv_data = await db_client.get_user_cv_vector(user_id)
    current_cv_vector = None
    cv_text_for_rag = cv_text  # Mặc định dùng CV text từ input
    if user_cv_data is not None:
        logger.info(f"✅ Dùng vector CV đã lưu trữ cho user: {user_id}.")
        current_cv_vector = user_cv_data.get('vector')
        if user_cv_data.get('cv_text'):
            cv_text_for_rag = user_cv_data.get('cv_text')  # Ưu tiên dùng CV đã lưu để nhất quán
    else:
        logger.info(f"Tạo vector mới cho CV đầu vào {user_id}")
        current_cv_vector = await _create_and_store_cv_vector(user_id, cv_text,ai_client,db_client)

    # --- BƯỚC 2: TRUY VẤN JOB PHÙ HỢP (Retrieval) ---
    logger.info(f"🔍 Đang tìm kiếm {top_k} job tương đồng bằng vector CV...")
    
    if current_cv_vector is None:
        logger.error(f"Không thể tạo vector cho CV của user: {user_id}.")
        return {"error": "Không thể xử lý CV của bạn. Vui lòng kiểm tra lại nội dung CV và thử lại."}
    matching_jobs = await db_client.search_similar_jobs(
        query_vector=current_cv_vector,
        n_results=top_k,
        filter_obj=None #filters
)
    
    if not matching_jobs:
        return {"error": "Xin lỗi, không tìm thấy công việc nào phù hợp với CV của bạn."}

    # --- BƯỚC 3: GỌI LLM VÀ NỐI CHUỖI (Generation & Aggregation) ---
    logger.info(" Đang gọi LLM và chờ phản hồi hoàn chỉnh...")
    
    llm_result = await ai_client.rag_job_advisory( # Đổi tên để phân biệt với hàm cũ
        cv_text=cv_text_for_rag, 
        matched_jobs=matching_jobs
    )
    
# Lấy kết quả duy nhất từ generator
    if 'error' in llm_result:
        logger.error(f"❌ Lỗi từ LLM: {llm_result['error']}")
        return {"error": f"Lỗi từ mô hình AI: {llm_result['error']}"}
        
    full_report_text = llm_result.get('text', '')
    
    if not full_report_text:
        logger.error("⚠️ LLM đã trả về kết quả nhưng nội dung báo cáo trống.")
        return {"error": "Mô hình AI không tạo ra nội dung báo cáo."}

    logger.info("✅ Báo cáo hoàn chỉnh đã được tạo.")
    
    return {"report_text": full_report_text, "matched_jobs": matching_jobs}


# --- ENDPOINT CHÍNH ---
@router.post("/consult", response_model=ConsultReportResponse, summary="Tư vấn Job RAG chuyên sâu (JSON)", tags=["AI Consultation"])
async def consult_pipeline_endpoint(
    data: ConsultRequest,
    ai_client: AIClientDep, 
    db_client: DBClientDep
):
    """
    Endpoint thực hiện toàn bộ Pipeline RAG và trả về báo cáo JSON hoàn chỉnh.
    """
    
    # 1. Chạy logic cốt lõi
    pipeline_result = await consult_job_rag_logic(
        user_id=data.user_id,
        cv_text=data.cv_text,
        ai_client=ai_client,
        db_client=db_client,
        top_k=3,
        filters=data.filters
    )
    # 2. Xử lý lỗi  
    if "error" in pipeline_result:
        # Trả về lỗi 400 Bad Request nếu là lỗi nghiệp vụ (không tìm thấy job, không tạo được vector)
        raise HTTPException(status_code=400, detail=pipeline_result["error"])

# 3. Định dạng kết quả về Pydantic Model (ConsultReportResponse)
    try:
        full_report_text = pipeline_result['report_text']
        matched_jobs = pipeline_result['matched_jobs']
        
        # 3.1. Trích xuất và Parse JSON từ LLM Response
        try:
            if full_report_text.startswith("```json"):
                json_str = full_report_text.strip().replace("```json", "").replace("```", "").strip()
            else:
                json_str = full_report_text.strip()
                
            report_data = json.loads(json_str)
        except json.JSONDecodeError:
            logger.error(f"❌ Lỗi JSON Decode từ phản hồi LLM: {json_str[:100]}...")
            raise HTTPException(status_code=500, detail="Phản hồi LLM không phải JSON hợp lệ.")
        

        # 3.2. Ánh xạ dữ liệu Job sang JobInput (Khắc phục lỗi Pydantic)
        job_details_list = []
        for job in matched_jobs:
            # Job thô từ ChromaDB có cấu trúc: {'id': ..., 'description': ..., 'metadatas': {...}}
            metadatas = job.get('metadatas', {}) 
            
            try:
                # JobInput là schema bạn định nghĩa: id, description, category, location, min_salary, job_type
                job_detail = JobInput(
                    id=job.get('id', 'N/A'),
                    title=metadatas.get('title', 'Không có tiêu đề'),
                    description=job.get('description', 'Không có mô tả chi tiết.'),
                    # Ánh xạ các trường bị thiếu từ metadatas:
                    # Dùng 'group' và 'workType' làm dự phòng vì dữ liệu mẫu của bạn dùng các key này
                    category=metadatas.get('category', metadatas.get('group', 'N/A')),
                    location=metadatas.get('location', 'N/A'),
                    min_salary=metadatas.get('min_salary', 0),
                    job_type=metadatas.get('job_type', metadatas.get('workType', 'N/A')),
                )
                job_details_list.append(job_detail)
            except Exception as e:
                logger.warning(f"Bỏ qua Job ID {job.get('id', 'N/A')} do lỗi Pydantic JobInput: {e}")
                continue # Bỏ qua Job bị lỗi và tiếp tục

        # 3.3. Ánh xạ Lời khuyên (recommendations)
        # Vì Schema của bạn dùng 'recommendations: str', chúng ta sẽ kết hợp tất cả lời khuyên từ LLM 
        # (thường nằm trong trường 'advice_sections' hoặc 'recommendations' của JSON LLM trả về)
        recommendations_text = ""
        advice_sections = report_data.get('advice_sections', []) # Lấy từ JSON LLM (giả định)
        
        if advice_sections:
            # Nếu LLM trả về danh sách sections, nối nội dung lại thành một chuỗi lớn
            recommendations_text = "\n\n".join([
                f"**{section.get('title', 'Lời khuyên')}**\n{section.get('content', '')}" 
                for section in advice_sections
            ])
        else:
            # Nếu LLM trả về chuỗi recommendations trực tiếp
            recommendations_text = report_data.get('recommendations', 'Không có lời khuyên chi tiết.')

                
        # Lấy tiêu đề job đầu tiên (dùng để đặt tiêu đề báo cáo)
        first_job_metadata = matched_jobs[0].get('metadatas', {}) if matched_jobs else {}
        first_job_title = first_job_metadata.get('title', 'N/A')

        # 3.4. Xây dựng và xác thực báo cáo cuối cùng
        report = ConsultReportResponse(
            title=f"Báo cáo tư vấn CV - Phù hợp nhất với {first_job_title}",
            summary=report_data.get('summary', 'Báo cáo tóm tắt không có.'),
            job_details=job_details_list,
            recommendations=recommendations_text # Gán chuỗi đã được tổng hợp
        )
        
        logger.info(f"✅ Báo cáo Pydantic đã được tạo và xác thực thành công. Job Details: {len(job_details_list)}")
        return report

    except Exception as e:
        logger.error(f"❌ Lỗi khi định dạng báo cáo cuối cùng: {e}")
        # Trả về lỗi 500 kèm chi tiết lỗi
        raise HTTPException(status_code=500, detail=f"Lỗi khi xử lý báo cáo cuối cùng từ AI: {e}")