import requests
import json
from typing import List, Dict
from AI_service.core.config import settings  # Import settings từ file config.py
from chromadb.api.types import Documents, Embeddings, EmbeddingFunction

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
                return data["data"][0]["embedding"]
            return []
        except Exception as e:
            print(f"Lỗi Embedding: {e}")
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
        
    def chat_respond_custom(self, user_text: str, sys_prompt: str):
        url = f"{self.endpoint}/chat/completions"
        payload = {
            "model": settings.H_LLM_MODEL,
            "messages": [
                {"role": "system", "content": sys_prompt},
                {"role": "user", "content": user_text}
            ],
            "temperature": 0.3,
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

    def smart_chat(self, user_text: str, router_instance):
        """
        Hàm chat thông minh kết hợp Router
        """
        # BƯỚC 1: Hỏi Router xem có trúng tủ không?
        instruction, is_match = router_instance.find_best_instruction(user_text)
        
        final_prompt = user_text
        system_prompt = "Bạn là trợ lý HR hữu ích." # Mặc định

        if is_match:
            print("🎯 HIT: Trúng câu hỏi mẫu -> Dùng Instruction chuyên gia")
            system_prompt = instruction
        else:
            print("⚠️ MISS: Câu hỏi lạ -> Dùng Light LLM chuẩn hóa")
            # BƯỚC 2: Nếu không trúng, nhờ Light LLM sửa lại câu hỏi
            refined_text = self.normalize_question(user_text)
            print(f"   Gốc: {user_text} \n   Sửa: {refined_text}")
            final_prompt = refined_text

        # BƯỚC 3: Gửi cho Heavy LLM (Model xịn) trả lời
        # (Code gọi API stream giống hệt bài trước, chỉ thay content)
        return self.chat_respond_custom(final_prompt, system_prompt)


    def rag_job_advisory(self, cv_text: str, matched_jobs: list):
        """
        RAG: Đọc CV + Đọc kết quả từ Vector DB -> Tư vấn chuyên sâu
        """
        url = f"{self.endpoint}/chat/completions"
        
        # 1. Biến đổi danh sách job thành văn bản để nhét vào Prompt
        jobs_context = ""
        for idx, job in enumerate(matched_jobs):
            info = job['metadata']
            desc = job['description'][:300] + "..." # Cắt ngắn bớt cho đỡ tốn token
            jobs_context += f"[{idx+1}] Vị trí: {info.get('category', 'N/A')} | Mô tả: {desc}\n"

        # 2. Tạo Prompt RAG
        system_prompt = "Bạn là chuyên gia tuyển dụng AI. Dựa vào CV và Danh sách công việc phù hợp tìm thấy từ Database, hãy phân tích."
        
        user_content = f"""
        === CV CỦA ỨNG VIÊN ===
        {cv_text}

        === CÔNG VIỆC TÌM THẤY TỪ HỆ THỐNG (Độ khớp cao nhất) ===
        {jobs_context}

        === YÊU CẦU ===
        1. Hãy chọn ra 1 công việc phù hợp nhất trong danh sách trên.
        2. Giải thích ngắn gọn tại sao ứng viên hợp với công việc đó.
        3. Đề xuất 1 kỹ năng ứng viên cần cải thiện để ứng tuyển thành công.
        """

        payload = {
            "model": settings.H_LLM_MODEL, # Dùng model xịn nhất
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_content}
            ],
            "temperature": 0.1,
            "stream": True 
        }

        # Streaming response
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
            yield {"error": str(e)}


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