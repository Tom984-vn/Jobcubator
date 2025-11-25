import requests
import json
from typing import List, Dict, Generator, Any, Optional
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
        # self.endpoint = settings.ENDPOINT.rstrip('/')

    def get_embedding(self, text: str) -> List[float]:
        url = f"{self.endpoint}/embeddings"
        payload = {
            "input": [text],
            "model": settings.EMBED_MODEL
        }

        try:
            response = requests.post(url, headers=self.headers, json=payload)
            response.raise_for_status()
            data = response.json()
            
            if "data" in data and len(data["data"]) > 0:
                print(data["data"][0]["embedding"][1])
                return data["data"][0]["embedding"]
            return []
        except Exception as e:
            print(f"DEBUG API: Lỗi khi gọi API: {e}")
            return []

    def chat_refine(self, text: str) -> str:
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
            response = requests.post(url, headers=self.headers, json=payload)
            response.raise_for_status()
            return response.json()["choices"][0]["message"]["content"]
        except Exception as e:
            print(f"Lỗi Chat: {e}")
            return "Lỗi xử lý văn bản"
    def generate_report(self, original_cv: str, refined_cv: str, matched_jobs: List[Dict]) -> Dict:  #cần generate tối thiểu 3 recommend dựa theo các tiêu chí khác nhau
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
                // ... (Các job khác)
            ]
        }}
        """
        
        payload = {
            "model": settings.H_LLM_MODEL,
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": f"Phân tích CV gốc: {original_cv}"}
            ],
            "temperature": 0.2
        }

        try:
            response = requests.post(url, headers=self.headers, json=payload)
            response.raise_for_status()
            return response.json()["choices"][0]["message"]["content"]
        except Exception as e:
            print(f"Lỗi Chat: {e}")
            return "Lỗi xử lý văn bản"
        
    def chat_respond_custom(self, user_text: str, sys_prompt: str, context: Optional[UserContext] = None):
        final_user_text = user_text
        # --- TẠO QUY TẮC HẬU XỬ LÝ ---
        if context:
            rule_post = "\n\n--- QUY TẮC BẮT BUỘC KHI TRẢ LỜI ---\n"
            rule_post += "Luôn luôn cá nhân hóa câu trả lời dựa trên các thông tin sau về người dùng:\n"

            # Xác định ngành nghề ưu tiên
            industry = "chưa xác định"
            if context.interested_industry:
                industry = context.interested_industry
            elif context.cv_industry:
                industry = context.cv_industry

            rule_post += f"- Ngành nghề: {industry}. Hãy ưu tiên đưa ra lời khuyên và ví dụ liên quan đến ngành này.\n"

            if context.age_range:
                rule_post += f"- Khoảng tuổi: {context.age_range}. Lời khuyên nên phù hợp với giai đoạn sự nghiệp của lứa tuổi này.\n"

            rule_post += "Đây là yêu cầu quan trọng nhất, phải được ưu tiên hàng đầu."

            # Gắn quy tắc vào cuối prompt của người dùng
            final_user_text += rule_post
        url = f"{self.endpoint}/chat/completions"
        payload = {
            "model": settings.H_LLM_MODEL,
            "messages": [
                {"role": "system", "content": sys_prompt},
                {"role": "user", "content": final_user_text}
            ],
            "temperature": 0.1,
            "stream": True
        }
        try:
            response = requests.post(url, headers=self.headers, json=payload, stream=True)
            response.raise_for_status()
            for line in response.iter_lines():
                if not line: continue
                text = line.decode("utf-8")
                if text.startswith("data: "): text = text[6:].strip()
                if text == "[DONE]": break
                yield json.loads(text)
        except Exception as e:
            print(f"Lỗi Chat Stream: {e}")
            yield {"error": f"Lỗi xử lý văn bản: {e}"}

    def normalize_question(self, text: str) -> str:
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
            res = requests.post(url, headers=self.headers, json=payload)
            return res.json()["choices"][0]["message"]["content"]
        except:
            return text # Nếu lỗi thì dùng nguyên văn

    def smart_chat(self, user_text: str, router_instance, db_client: 'VectorDBClient', context: Optional[UserContext] = None):
        """
        Hàm chat thông minh kết hợp Router
        """
        # BƯỚC 1: Hỏi Router xem có trúng tủ không?
        instruction, is_match = router_instance.find_best_instruction(user_text)
        
        final_prompt = user_text
        system_prompt = "Bạn là trợ lý HR hữu ích." # Mặc định

        if is_match:
            print("🎯 HIT: Trúng câu hỏi mẫu -> Lấy thêm ngữ cảnh từ VectorDB.")
            context_jobs = db_client.search_similar_jobs(query_text=user_text)
            jobs_context_str = ""
            if context_jobs:
                jobs_context_str += "Dưới đây là một vài công việc liên quan được tìm thấy trên thị trường:\n"
                for job in context_jobs:
                    title = job.get('metadata', {}).get('title', 'Không có tiêu đề')
                    description_snippet = job.get('description', '')[:150] + "..."
                    jobs_context_str += f"- {title}: {description_snippet}\n"

            system_prompt = "Bạn là trợ lý HR hữu ích của jobcubator "
            final_prompt = f'''**Yêu cầu của người dùng:**
"{user_text}"
**Hướng dẫn chuyên gia để trả lời (lấy từ câu hỏi tương tự):**
"{instruction}"
**Ngữ cảnh thị trường việc làm (tham khảo):**
{jobs_context_str if jobs_context_str else "Không tìm thấy công việc liên quan."}
**Nhiệm vụ của bạn:**
Hãy kết hợp **cả ba** thông tin trên...
'''
        else:
            print("⚠️ MISS: Câu hỏi lạ -> Dùng Light LLM chuẩn hóa")
            # BƯỚC 2: Nếu không trúng, nhờ Light LLM sửa lại câu hỏi
            refined_text = self.normalize_question(user_text)
            print(f"   Gốc: {user_text} \n   Sửa: {refined_text}")
            final_prompt = refined_text

        # BƯỚC 3: Gửi cho Heavy LLM (Model xịn) trả lời
        # (Code gọi API stream giống hệt bài trước, chỉ thay content)
        return self.chat_respond_custom(final_prompt, system_prompt, context)
    def _build_rag_prompt(self, cv_text: str, matched_jobs: List[Dict]) -> str:
            """Xây dựng System Prompt và User Prompt dựa trên CV và các Job phù hợp."""
            
            system_instruction = (
                "Bạn là một chuyên gia tư vấn tuyển dụng cấp cao. Nhiệm vụ của bạn là phân tích CV của ứng viên "
                "và đánh giá mức độ phù hợp của họ với các công việc được cung cấp. Phản hồi phải chuyên nghiệp, "
                "chi tiết, và trả lời đầy đủ các phần sau đây:"
                "\n1. Tóm tắt điểm mạnh, điểm yếu của ứng viên dựa trên CV."
                "\n2. Đánh giá mức độ phù hợp (từ 1 đến 10) và lý do cho từng công việc."
                "\n3. Đề xuất 3-5 khóa học hoặc kỹ năng cụ thể cần bổ sung để ứng viên nâng cao cơ hội đậu phỏng vấn "
                "cho các công việc này. Phản hồi phải được định dạng Markdown rõ ràng."
            )

            job_context = "\n\n--- DANH SÁCH CÔNG VIỆC TƯƠNG ĐỒNG ---\n"
            for i, job in enumerate(matched_jobs):
                # Giả định metadata chứa title, description và các thông tin quan trọng khác
                title = job.get('metadata', {}).get('title', 'N/A')
                description = job.get('description', 'Không có mô tả chi tiết.')
                distance = job.get('distance')
                
                job_context += f"## Công việc {i+1}: {title}\n"
                job_context += f"Mô tả: {description[:300]}...\n" # Giới hạn mô tả để tiết kiệm token
                job_context += f"Khoảng cách Vector (Distance): {distance:.4f}\n"
                job_context += "--------------------------------------\n"

            user_prompt = (
                f"Đây là CV của tôi:\n\n{cv_text}\n\n"
                f"Và đây là danh sách các công việc được hệ thống tìm kiếm:\n\n{job_context}\n\n"
                "Hãy thực hiện phân tích và tạo báo cáo tư vấn theo yêu cầu của System Instruction."
            )
            
            return json.dumps({
                "systemInstruction": system_instruction,
                "userPrompt": user_prompt
            })


    def rag_job_advisory(self, cv_text: str, matched_jobs: List[Dict]) -> Generator[Dict[str, Any], None, None]:
            """
            Gửi yêu cầu RAG tới mô hình LLM để tạo báo cáo tư vấn. Trả về Generator (stream).
            """
            # 1. Xây dựng Prompt
            try:
                prompt_payload_str = self._build_rag_prompt(cv_text, matched_jobs)
                prompt_payload = json.loads(prompt_payload_str)
            except Exception as e:
                logger.error(f"❌ Lỗi khi xây dựng RAG Prompt: {e}")
                yield {"error": "Lỗi khi chuẩn bị dữ liệu cho AI."}
                return
                
            # 2. Chuẩn bị Request Payload
            payload = {
                "contents": [{
                    "parts": [{"text": prompt_payload["userPrompt"]}]
                }],
                "systemInstruction": {
                    "parts": [{"text": prompt_payload["systemInstruction"]}]
                },
                # Cấu hình model và streaming (Giả định FPT Endpoint hỗ trợ streaming)
                "model": settings.L_LLM_MODEL,
                "config": {"stream": True} # Yêu cầu streaming
            }
            
            # 3. Gửi Request và Stream
            url = f"{self.endpoint}/v1/models/{settings.L_LLM_MODEL}:generateContent" 
            
            try:
                # Lưu ý: requests.post() không hỗ trợ stream response
                # Trong môi trường thực, bạn cần dùng session hoặc thư viện hỗ trợ stream
                # Tạm thời, ta sẽ giả định dùng requests.post và đọc response.iter_content
                
                response = requests.post(
                    url, 
                    headers=self.headers, 
                    json=payload, 
                    stream=True
                )
                response.raise_for_status() # Bắt lỗi HTTP (4xx, 5xx)

                # Xử lý Stream Response (Tùy thuộc vào định dạng của FPT)
                for line in response.iter_lines():
                    if line:
                        # Giả định FPT trả về JSON chunks
                        try:
                            chunk_data = json.loads(line.decode('utf-8'))
                            # Cần xác định cấu trúc JSON mà FPT trả về để trích xuất text
                            # Tạm thời giả định nó có trường 'text' hoặc tương tự
                            text_part = chunk_data.get('text', '') # Thay thế 'text' bằng trường thực tế
                            if text_part:
                                yield {"text": text_part}
                        except json.JSONDecodeError:
                            # Bỏ qua dòng không phải JSON (ví dụ: Keep-alive)
                            continue
                        except Exception as e:
                            logger.warning(f"Lỗi xử lý chunk JSON: {e}")
                            continue
                            
            except requests.exceptions.HTTPError as e:
                logger.error(f"❌ Lỗi HTTP khi gọi LLM: {e.response.text}")
                yield {"error": f"Lỗi HTTP từ LLM: {e.response.text[:100]}..."}
            except requests.exceptions.RequestException as e:
                logger.error(f"❌ Lỗi kết nối khi gọi LLM: {e}")
                yield {"error": "Lỗi kết nối mạng hoặc endpoint AI không khả dụng."}
            except Exception as e:
                logger.error(f"❌ Lỗi không xác định trong RAG advisory: {e}")
                yield {"error": "Lỗi không xác định khi tạo báo cáo."}

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
            # Gọi hàm FPTAIClient của bạn để lấy embedding cho từng văn bản
            embedding = self.ai_client.get_embedding(text) 
            embeddings.append(embedding)
            
        return embeddings