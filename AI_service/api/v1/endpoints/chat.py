# AI_service/api/v1/endpoints/chat.py
import json
import asyncio
import inspect
import logging
from fastapi import APIRouter, HTTPException

# <-- Absolute Imports
from AI_service.schemas.schemas import ChatRequest
from AI_service.core.dependencies import AIClientDep, DBClientDep, SemanticRouterDep

logger = logging.getLogger(__name__)
router = APIRouter()

@router.post("/general", summary="Chat tổng quát với AI (JSON Response)")
async def general_chat_endpoint(
    data: ChatRequest,
    ai_client: AIClientDep,
    db_client: DBClientDep,
    router_client: SemanticRouterDep,
):
    """
    Endpoint xử lý chat tổng quát, sử dụng Semantic Router và trả về một JSON object hoàn chỉnh.
    
    1. Gọi hàm `smart_chat` để lấy về một `async_generator`.
    2. Tiêu thụ (consume) generator này để ghép các mảnh phản hồi lại.
    3. Trả về một JSON object chứa toàn bộ nội dung chat.
    """
    response_generator = None

    # PHÂN NHÁNH LOGIC: Kiểm tra xem có job_ids để so sánh không
    if data.job_ids:
        logger.info(f"Nhận request chat so sánh cho các Job IDs: {data.job_ids}")
        # 1. Lấy thông tin chi tiết của các jobs từ DB
        job_fetch_tasks = [db_client.get_job_by_id(job_id) for job_id in data.job_ids]
        job_details_list = await asyncio.gather(*job_fetch_tasks)
        
        # Lọc ra các job thực sự tìm thấy
        found_jobs = [job for job in job_details_list if job is not None]
        
        if not found_jobs:
            raise HTTPException(status_code=404, detail="Không tìm thấy thông tin cho bất kỳ Job ID nào được cung cấp.")

        # 2. Gọi logic chat so sánh mới
        # SỬA LỖI: compare_jobs_chat là một coroutine, cần `await` để nó thực thi và trả về generator.
        response_generator = await ai_client.compare_jobs_chat(
            user_query=data.text,
            jobs_data=found_jobs,
            context=data.context
        )

    else:
        # Logic cũ: Dùng smart_chat cho các câu hỏi chung
        logger.info("Nhận request chat chung (không có Job ID).")
        response_generator = await ai_client.smart_chat(
            user_text=data.text,
            router_instance=router_client,
            db_client=db_client,
            context=data.context
        )
        
    # 2. **QUAN TRỌNG**: Tiêu thụ generator để xây dựng chuỗi phản hồi đầy đủ
    full_response_str = ""
    try:
        # Kiểm tra xem có phải là generator không
        if inspect.isasyncgen(response_generator):
            async for chunk in response_generator:
                # Logic xử lý chunk từ FPT AI
                if "choices" in chunk and len(chunk["choices"]) > 0:
                    delta = chunk["choices"][0].get("delta", {})
                    if "content" in delta:
                        full_response_str += delta["content"]
                elif "error" in chunk:
                    logger.error(f"Lỗi stream từ LLM: {chunk['error']}")
                    raise HTTPException(status_code=500, detail=f"Lỗi từ mô hình AI: {chunk['error']}")
        else: # Nếu không phải generator, nó là một coroutine trả về kết quả cuối cùng
            result = await response_generator
            full_response_str = str(result)

    except Exception as e:
        logger.error(f"Lỗi khi xử lý stream từ LLM: {e}")
        raise HTTPException(status_code=500, detail=f"Lỗi khi nhận dữ liệu từ mô hình AI: {e}")

    # 3. Trả về đối tượng JSON hoàn chỉnh cho frontend
    return {"text": full_response_str}