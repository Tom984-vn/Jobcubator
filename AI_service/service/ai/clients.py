import httpx
import asyncio
import json
from typing import List, Dict, Generator, Any, Optional, AsyncGenerator
from AI_service.core.config import settings  # Import settings từ file config.py
from chromadb.api.types import Documents, Embeddings, EmbeddingFunction
from AI_service.schemas.schemas import UserContext  
import logging
logger = logging.getLogger(__name__)
class FPTAIClient:
    def __init__(self):
        self.headers = {
            "Authorization": f"Bearer {settings.API_KEY}",
            "Content-Type": "application/json"
        }
        self.endpoint = settings.ENDPOINT

    async def get_embedding(self, text: str) -> List[float]:
        url = f"{self.endpoint}/embeddings"
        payload = {
            "input": [text],
            "model": settings.EMBED_MODEL
        }

        try:
            async with httpx.AsyncClient(timeout=10) as client:
                response = await client.post(url, headers=self.headers, json=payload) # <--- ASYNC CHANGE: Thêm await
                response.raise_for_status()
                data = response.json()
            
            if "data" in data and len(data["data"]) > 0:
                print(data["data"][0]["embedding"][1])    #Bỏ
                return data["data"][0]["embedding"]
            return []
        except Exception as e:
            print(f"DEBUG API: Lỗi khi gọi API: {e}")
            return []
        except httpx.RequestError as e:
            logger.error("Request Error on embedding: {e}")
            return []

    async def chat_refine(self, text: str) -> str:
        url = f"{self.endpoint}/chat/completions"
        prompt = f"{text}\n\nHãy tóm tắt lại thông tin ứng viên ngắn gọn."
        
        payload = {
            "model": settings.L_LLM_MODEL,
            "messages": [
                {"role": "system", "content": "Bạn là trợ lý HR nhiệt tình và trả lời chi tiết đầy đủ và theo prompt có sẵn."},
                {"role": "user", "content": prompt}
            ],
            "temperature": 0.1
        }

        try:
            async with httpx.AsyncClient(timeout=30) as client:
                response = await client.post(url, headers=self.headers, json=payload)
                response.raise_for_status()
                return response.json()["choices"][0]["message"]["content"]
        except Exception as e:
            logger.error(f"Lỗi Chat: {e}")
            return "Lỗi xử lý văn bản"
    async def generate_report(self, original_cv: str, refined_cv: str, matched_jobs: List[Dict]) -> str:  #cần generate tối thiểu 3 recommend dựa theo các tiêu chí khác nhau
        url = f"{self.endpoint}/chat/completions"

        jobs_summary = json.dumps(matched_jobs, ensure_ascii=False, indent=2)
        system_prompt = f"""Bạn là một chuyên gia phân tích dữ liệu và nhân sự. 
        Nhiệm vụ của bạn là phân tích CV và so sánh với danh sách các công việc phù hợp (matched_jobs).
        
        Dữ liệu cung cấp:
        - CV Đã Chuẩn Hóa: {refined_cv}
        - Danh sách Job Phù Hợp: {jobs_summary}
        
        Hãy tuân thủ nghiêm ngặt và chỉ trả về DƯỚI DẠNG ĐỐI TƯỢNG JSON theo cấu trúc sau:
        {{
            "cv_analysis": "Phân tích điểm mạnh, kinh nghiệm nổi bật trong CV, và các kỹ năng còn thiếu sót (Tối đa 200 từ).",
            "match_summary": "Tóm tắt mức độ phù hợp tổng thể giữa CV và các Job được tìm thấy (Tối đa 100 từ).",
            "job_recommendations": [
                {{
                    "job_title": "[Tiêu đề Job]",
                    "match_score": "[Mức độ phù hợp, ví dụ: 85%]",
                    "reasoning": "Giải thích chi tiết tại sao Job này phù hợp với ứng viên (Tối đa 100 từ)."
                }},
                // ... (tương tự với các job khác, default sẽ có 3 jobs)
            ]
        }}
        """
        
        payload = {
            "model": settings.H_LLM_MODEL,
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": f"Phân tích CV gốc: {original_cv}"}
            ],
            "temperature": 0.1
        }

        try:
            async with httpx.AsyncClient(timeout=60) as client:
                response = await client.post(url, headers=self.headers, json=payload)
                response.raise_for_status()
                return response.json()["choices"][0]["message"]["content"]
        except Exception as e:
            print(f"Lỗi Chat: {e}")
            return "Lỗi xử lý văn bản"
        
    async def chat_respond_custom(self, user_text: str, sys_prompt: str, context: Optional[UserContext] = None) -> AsyncGenerator[Dict[str, Any], None]:
        final_sys_text = sys_prompt
        # --- TẠO QUY TẮC HẬU XỬ LÝ ---
        if context:
            rule_post = "\n\n--- QUY TẮC BẮT BUỘC KHI TRẢ LỜI ---\n"
            rule_post += "Luôn luôn cá nhân hóa câu trả lời dựa trên các thông tin sau về người dùng.\n"
            rule_post += "Phải Luôn luôn trả lời bằng tiếng việt/vietnamese always please, ngoại trừ những tên riêng (giả sử tên riêng phần mềm Excel)"

            # Xác định ngành nghề ưu tiên
            industry = "chưa xác định"
            if context.interested_industry:
                industry = context.interested_industry
            elif context.cv_industry:
                industry = context.cv_industry

            rule_post += f"- Ngành nghề: {industry}. Hãy ưu tiên đưa ra lời khuyên và ví dụ liên quan đến ngành này.\n"

            if context.age_range:
                rule_post += f"- Khoảng tuổi: {context.age_range}. Lời khuyên nên phù hợp với giai đoạn sự nghiệp của lứa tuổi này.\n"

            rule_post += "Phải luôn dựa vào user_cv và những thông tin được cung cấp trước khi trả lời và trả lời bằng tiếng việt dễ hiểu, mọi hướng dẫn đều được tính toán kĩ lưỡng với các đối tượng trường hợp đó."
            rule_post += "Đây là yêu cầu quan trọng nhất, phải được ưu tiên hàng đầu."
            rule_post += "Nếu thực sự bế tắc hoặc cần hỏi câu hỏi thì hãy tóm tắt và xác nhận lại những thông tin biết về người dùng trước khi đặt câu hỏi."

            # Gắn quy tắc vào cuối prompt của người dùng
            final_sys_text += rule_post
        logger.info(final_sys_text)  #Bỏ
        logger.info(user_text) #Bỏ
        url = f"{self.endpoint}/chat/completions"
        payload = {
            "model": settings.H_LLM_MODEL,
            "messages": [
                {"role": "system", "content": final_sys_text},
                {"role": "user", "content": user_text}
            ],
            "temperature": 0.1,
            "stream": True
        }
        try:
            async with httpx.AsyncClient(timeout=None) as client:
                async with client.stream("POST", url, headers=self.headers, json=payload) as response:
                    response.raise_for_status()
                    # SỬA LỖI: Dùng `aiter_lines()` và `async for` cho stream bất đồng bộ
                    async for line in response.aiter_lines():
                        if not line: continue
                        # aiter_lines() đã tự động decode, không cần gọi .decode() nữa
                        text = line
                        if text.startswith("data: "): text = text[6:].strip()
                        if text == "[DONE]": break
                        yield json.loads(text)
        except Exception as e:
            logger.error(f"Lỗi Chat Stream: {e}")
            yield {"error": f"Lỗi xử lý văn bản: {e}"}
    
    async def _analyze_single_job_for_comparison(self, user_query: str, job_data: Dict[str, Any], context: Optional[UserContext] = None) -> str:
        """
        [Hàm nội bộ] Dùng LLM để phân tích MỘT công việc dựa trên câu hỏi của người dùng.
        Trả về một chuỗi phân tích.
        """
        metadata = job_data.get('metadata', {})
        document = job_data.get('document', 'Không có mô tả.')
        job_title = metadata.get('title', 'N/A')

        context_str = ""
        if context:
            context_str += "\n**Thông tin về người dùng (để tham khảo khi phân tích):**\n"
            if context.experience_level:
                context_str += f"- Kinh nghiệm: {context.experience_level}\n"
            if context.cv_industry or context.interested_industry:
                context_str += f"- Ngành nghề quan tâm: {context.interested_industry or context.cv_industry}\n"

        prompt = f"""**Yêu cầu của người dùng:** "{user_query}"

**Thông tin công việc cần phân tích:**
- Tiêu đề: {job_title}
- Công ty: {metadata.get('companyName', 'N/A')}
- Địa điểm: {metadata.get('location', 'N/A')}
- Lương: {metadata.get('min_salary', 0)} - {metadata.get('max_salary', 0)}
- Mô tả chi tiết: {document}
{context_str}

**Nhiệm vụ của bạn:**
Dựa vào yêu cầu của người dùng và thông tin về họ, hãy đưa ra một đoạn phân tích ngắn gọn (tối đa 100 từ) về công việc này. Chỉ tập trung vào các khía cạnh liên quan đến câu hỏi của người dùng.
"""
        # Sử dụng một hàm gọi LLM non-streaming đơn giản
        # (Giả sử có hàm chat_refine hoặc tương tự, nếu không có thì tạo một hàm mới)
        try:
            analysis = await self.chat_refine(prompt)
            return f"**Phân tích cho công việc '{job_title}':**\n{analysis}\n"
        except Exception as e:
            logger.error(f"Lỗi khi phân tích job '{job_title}': {e}")
            return f"**Phân tích cho công việc '{job_title}':**\nKhông thể phân tích do lỗi.\n"

    async def compare_jobs_chat(self, user_query: str, jobs_data: List[Dict[str, Any]], context: Optional[UserContext] = None) -> AsyncGenerator[Dict[str, Any], None]:
        """
        Xử lý chat so sánh công việc bằng phương pháp Map-Reduce.
        1. (Map) Phân tích từng công việc một cách riêng rẽ.
        2. (Reduce) Tổng hợp các phân tích và đưa ra kết luận cuối cùng.
        """
        # --- BƯỚC 1: MAP - Phân tích từng job đồng thời ---
        logger.info(f"Bắt đầu giai đoạn MAP: Phân tích {len(jobs_data)} jobs...")
        analysis_tasks = [self._analyze_single_job_for_comparison(user_query, job, context) for job in jobs_data]
        individual_analyses = await asyncio.gather(*analysis_tasks)

        # --- BƯỚC 2: REDUCE - Tổng hợp kết quả ---
        logger.info("Bắt đầu giai đoạn REDUCE: Tổng hợp các phân tích...")
        
        # Ghép các phân tích riêng lẻ lại
        combined_analysis_text = "\n".join(individual_analyses)

        system_prompt = """Bạn là một chuyên gia tư vấn nghề nghiệp cấp cao của Jobcubator.
Nhiệm vụ của bạn là tổng hợp các phân tích đã có và đưa ra một câu trả lời so sánh cuối cùng, mạch lạc và hữu ích cho người dùng."""

        final_prompt = f"""**Yêu cầu ban đầu của người dùng:**
"{user_query}"

**Các phân tích riêng lẻ cho từng công việc:**
{combined_analysis_text}

**Nhiệm vụ cuối cùng của bạn:**
Dựa trên các phân tích trên, hãy viết một câu trả lời tổng hợp để so sánh các công việc này theo đúng yêu cầu của người dùng. 
Hãy trình bày một cách có cấu trúc (ví dụ: dùng gạch đầu dòng, in đậm) để làm nổi bật các điểm chính. Đưa ra kết luận hoặc lời khuyên cuối cùng nếu có thể.
"""

        # Gọi hàm chat streaming đã có
        return self.chat_respond_custom(
            user_text=final_prompt, 
            sys_prompt=system_prompt,
            context=context
        )

    async def normalize_question(self, text: str) -> str:
        """
        Dùng Light LLM (Model nhỏ/nhanh) để viết lại câu hỏi cho rõ nghĩa.
        """
        url = f"{self.endpoint}/chat/completions"
        payload = {
            "model": settings.L_LLM_MODEL, # Dùng model Distill (Nhẹ)
            "messages": [
                {"role": "system", "content": "Nhiệm vụ: Viết lại câu hỏi của người dùng ngắn gọn, rõ ràng, đủ chủ ngữ vị ngữ để AI dễ hiểu. Không trả lời, chỉ viết lại."},
                {"role": "user", "content": text}
            ],
            "temperature": 0.1
        }
        try:
            async with httpx.AsyncClient(timeout=10) as client:
                res = await client.post(url, headers=self.headers, json=payload)
                res.raise_for_status()
                return res.json()["choices"][0]["message"]["content"]
        except Exception as e:
            logger.error("Lỗi normalize question: {e}")
            return text # Nếu lỗi thì dùng nguyên văn

    async def smart_chat(self, user_text: str, router_instance, db_client, context: Optional[UserContext] = None):
        """
        Hàm chat thông minh kết hợp Router
        """
        # BƯỚC 1: Hỏi Router xem có trúng tủ không?
        instruction, is_match = await router_instance.find_best_instruction(user_text)
        
        final_prompt = user_text
        system_prompt = "Bạn là trợ lý HR hữu ích." # Mặc định

        if is_match:
            print("🎯 HIT: Trúng câu hỏi mẫu -> Lấy thêm ngữ cảnh từ VectorDB.")
            context_jobs = await db_client.search_similar_jobs(query_text=user_text) 
            logger.info(context_jobs)
            jobs_context_str = ""
            if context_jobs:
                jobs_context_str += "Dưới đây là một vài công việc liên quan được tìm thấy trên thị trường:\n"
                logger.info(jobs_context_str)
                for job in context_jobs:
                    title = job.get('metadatas', {}).get('title', 'Không có tiêu đề')
                    description_snippet = job.get('description', '')
                    jobs_context_str += f"- {title}: {description_snippet}\n"

            system_prompt = "Bạn là trợ lý HR hữu ích của jobcubator"
            final_prompt = f'''**Yêu cầu của người dùng:**
"{user_text}"
"{instruction}"
**Ngữ cảnh thị trường việc làm (tham khảo):**
{jobs_context_str if jobs_context_str else "Không tìm thấy công việc liên quan."}
**Nhiệm vụ của bạn:**
Hãy kết hợp **cả ba** thông tin trên...
'''
        else:
            print("⚠️ MISS: Câu hỏi lạ -> Dùng Light LLM chuẩn hóa")
            # BƯỚC 2: Nếu không trúng, nhờ Light LLM sửa lại câu hỏi
            refined_text = await self.normalize_question(user_text)
            print(f"   Gốc của người dùng: {user_text} \n   Prompt sau khi đã sửa: {refined_text}")
            final_prompt = "Gốc của người dùng: {user_text} \n   Prompt sau khi đã sửa: {refined_text}"

        # BƯỚC 3: Gửi cho Heavy LLM (Model xịn) trả lời
        # (Code gọi API stream giống hệt bài trước, chỉ thay content)
        return self.chat_respond_custom(final_prompt, system_prompt, context)
    def _build_rag_prompt(self, cv_text: str, matched_jobs: List[Dict]) -> str:
        """Xây dựng System Prompt và User Prompt dựa trên CV và các Job phù hợp (đã được sửa để yêu cầu JSON)."""
        
        # 1. System Instruction MỚI - Yêu cầu JSON (Dựa trên Schema của bạn)
        jobs_summary = json.dumps(matched_jobs, ensure_ascii=False, indent=2)
        system_instruction = f"""
            Bạn là một chuyên gia tư vấn tuyển dụng cấp cao và phân tích dữ liệu chuyên nghiệp.
            Nhiệm vụ của bạn là phân tích kỹ lưỡng CV của ứng viên và đánh giá mức độ phù hợp của họ
            với danh sách các công việc được cung cấp.
            
            Dữ liệu Ngữ cảnh:
            - CV: {cv_text}... (CV đầy đủ được cung cấp trong User Prompt)
            - Danh sách Job Phù Hợp: {jobs_summary}
            
            QUY TẮC BẮT BUỘC:
            1. PHẢI tuân thủ nghiêm ngặt và **chỉ trả về một đối tượng JSON DUY NHẤT**.
            2. KHÔNG được thêm bất kỳ văn bản, giải thích hoặc markdown block (như ```json) nào bên ngoài đối tượng JSON.
            3. Cấu trúc JSON PHẢI tuân thủ các trường sau:

            {{
                "summary": "Tóm tắt chung về điểm mạnh, kinh nghiệm nổi bật và mức độ phù hợp tổng thể của ứng viên với các công việc này (Tối đa 150 từ).",
                "advice_sections": [
                    {{
                        "title": "Phân tích Điểm mạnh và Điểm yếu",
                        "content": "Phân tích chi tiết điểm mạnh, kinh nghiệm và các kỹ năng còn thiếu sót so với các công việc đã tìm thấy."
                    }},
                    {{
                        "title": "Lời khuyên Phát triển Kỹ năng/Khóa học",
                        "content": "Đề xuất 3-5 khóa học hoặc kỹ năng CỤ THỂ cần bổ sung để ứng viên nâng cao cơ hội đậu phỏng vấn cho nhóm công việc này."
                    }},
                    {{
                        "title": "Chiến lược Ứng tuyển & Phỏng vấn",
                        "content": "Lời khuyên cá nhân hóa về cách ứng viên nên điều chỉnh CV và phong cách phỏng vấn khi nộp vào các vị trí này."
                    }}
                ]
            }}
        """

        job_context = "\n\n--- DANH SÁCH CÔNG VIỆC TƯƠNG ĐỒNG (Tham khảo) ---\n"
        for i, job in enumerate(matched_jobs):
            title = job.get('metadatas', {}).get('title', 'N/A')
            description = job.get('documents', 'Không có mô tả chi tiết.') # Đã sửa key từ 'description' sang 'document' nếu bạn dùng ChromaDB
            distance = job.get('distance')
            
            job_context += f"## Công việc {i+1}: {title}\n"
            job_context += f"Mô tả: {description}...\n"
            job_context += f"Khoảng cách Vector (Distance): {distance:.4f}\n"
            job_context += "--------------------------------------\n"

        user_prompt = (
            f"CV đầy đủ của tôi là:\n\n{cv_text}\n\n"
            f"{job_context}\n\n"
            "Hãy thực hiện phân tích và **chỉ** tạo đối tượng JSON theo yêu cầu của System Instruction. "
            "Đảm bảo JSON là hợp lệ tuyệt đối."
        )
        
        return json.dumps({
            "systemInstruction": system_instruction,
            "userPrompt": user_prompt
        })



    async def rag_job_advisory(self, cv_text: str, matched_jobs: List[Dict]) -> Dict[str, Any]:
        """
        Gửi yêu cầu RAG tới mô hình LLM để tạo báo cáo tư vấn (non-streaming). Trả về kết quả hoàn chỉnh.
        """
        # 1. Xây dựng Prompt (Lấy System và User content)
        try:
            prompt_payload_str = self._build_rag_prompt(cv_text, matched_jobs)
            prompt_payload = json.loads(prompt_payload_str)
            system_instruction = prompt_payload.get('systemInstruction')
            user_prompt = prompt_payload.get('userPrompt')
        except Exception as e:
            logger.error(f"❌ Lỗi khi xây dựng RAG Prompt: {e}")
            # Do non-streaming, ta trả về lỗi ngay {"error": "Lỗi khi chuẩn bị dữ liệu cho AI."}
            return {"error": "Lỗi khi chuẩn bị dữ liệu cho AI."}
            
        # 2. Chuẩn bị Request Payload (Chat Completion API)
        payload = {
            "model": settings.L_LLM_MODEL,  #CRITICAL, ưu tiên dùng mô hình H_LLM hơn tuy nhiên lỗi json do mô hình H trả về <think> </think> nữa
            "messages": [
                {
                    "role": "system", 
                    "content": system_instruction
                },
                {
                    "role": "user", 
                    "content": user_prompt
                }
            ],
            "temperature": 0.1,
            "stream": False # ĐÃ TẮT STREAMING
        }
        
        # 3. Gửi Request (Non-streaming)
        url = f"{self.endpoint}/chat/completions" 
        logger.info(f"🤖 Đang gọi LLM và chờ phản hồi hoàn chỉnh...")
        
        try:
            async with httpx.AsyncClient(timeout=120) as client:
                response = await client.post(
                    url, 
                    headers=self.headers, 
                    json=payload, 
                )
                response.raise_for_status()

            # 4. Xử lý response non-streaming (Lấy toàn bộ JSON)
            full_response_json = response.json()
            
            # Cấu trúc non-streaming: choices[0].message.content
            content_text = full_response_json.get('choices', [{}])[0].get('message', {}).get('content')
            
            if content_text:
                # Trả về kết quả hoàn chỉnh dưới dạng một chunk duy nhất
                return {"text": content_text}
            else:
                logger.error("⚠️ Phản hồi từ LLM không chứa nội dung (content).")
                return {"error": "LLM không tạo ra phản hồi hợp lệ."}
                
        except httpx.HTTPStatusError as e:
            # Xử lý lỗi HTTP và trích xuất thông báo lỗi từ server
            error_response = {}
            try:
                error_response = e.response.json()
            except:
                pass

            logger.error(f"❌ Lỗi HTTP khi gọi LLM: {e.response.text}")
            error_message = error_response.get('error', {}).get('message', f"Lỗi không xác định ({e.response.status_code})")
            return {"error": f"Lỗi HTTP từ LLM: {error_message}"}
            
        except httpx.RequestError as e:
            logger.error(f"❌ Lỗi kết nối khi gọi LLM: {e}")
            return {"error": "Lỗi kết nối mạng hoặc endpoint AI không khả dụng."}
            
        except Exception as e:
            logger.error(f"❌ Lỗi không xác định trong RAG advisory: {e}")
            return {"error": "Lỗi không xác định khi tạo báo cáo."}

class FPTChromaAdapter(EmbeddingFunction):
    """
    Adapter giúp kết nối FPTAIClient (gọi API) với ChromaDB
    """
    def __init__(self, ai_client: FPTAIClient):
        # Lưu client AI vào để sử dụng
        self.ai_client = ai_client

    def __call__(self, texts: Documents) -> Embeddings:
        """
        Phương thức bắt buộc của ChromaDB: Nhận List[str] và trả về List[List[float]]
        """
        embeddings = []
        
        # ChromaDB gửi một List[str], ta cần vòng lặp để gọi API từng cái một 
        # (hoặc tối ưu hơn là gọi batch nếu API FPT hỗ trợ)
        for text in texts:
            try:
            # Gọi hàm FPTAIClient của bạn để lấy embedding cho từng văn bản
                embedding = asyncio.run(self.ai_client.get_embedding(text)) 
                embeddings.append(embedding)
            except Exception as e:
                logger.error(f"Lỗi khi lấy embedding cho ChromaDB: {e}")
                embeddings.append([])
        return embeddings