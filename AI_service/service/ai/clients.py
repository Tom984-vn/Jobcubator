import requests
import json
from typing import List, Dict, Optional

from AI_service.core.config import settings
from chromadb.api.types import Documents, Embeddings, EmbeddingFunction
from AI_service.schemas.schemas import UserContext

# KHÔNG import VectorDBClient ở đây nữa để tránh circular import

class FPTAIClient:
    def __init__(self):
        self.headers = {
            "Authorization": f"Bearer {settings.API_KEY}",
            "Content-Type": "application/json"
        }
        self.endpoint = settings.ENDPOINT

    def get_embedding(self, text: str) -> List[float]:
        # ... (giữ nguyên)
        url = f"{self.endpoint}/embeddings"
        payload = {"input": [text], "model": settings.EMBED_MODEL}
        try:
            response = requests.post(url, headers=self.headers, json=payload)
            response.raise_for_status()
            data = response.json()
            if "data" in data and len(data["data"]) > 0:
                return data["data"][0]["embedding"]
            return []
        except Exception as e:
            print(f"DEBUG API: Lỗi khi gọi API: {e}")
            return []

    def chat_refine(self, text: str) -> str:
        # ... (giữ nguyên)
        url = f"{self.endpoint}/chat/completions"
        prompt = f"{text}\n\nHãy tóm tắt lại thông tin ứng viên ngắn gọn."
        payload = {
            "model": settings.L_LLM_MODEL,
            "messages": [{"role": "system", "content": "Bạn là trợ lý HR nhiệt tình..."}, {"role": "user", "content": prompt}],
            "temperature": 0.1
        }
        try:
            response = requests.post(url, headers=self.headers, json=payload)
            response.raise_for_status()
            return response.json()["choices"][0]["message"]["content"]
        except Exception as e:
            print(f"Lỗi Chat: {e}")
            return "Lỗi xử lý văn bản"

    def generate_report(self, original_cv: str, refined_cv: str, matched_jobs: List[Dict]) -> Dict:
        # ... (giữ nguyên)
        pass

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
                {"role": "user", "content": final_user_text} # Sử dụng prompt đã được bổ sung
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
        # ... (giữ nguyên)
        url = f"{self.endpoint}/chat/completions"
        payload = {
            "model": settings.L_LLM_MODEL,
            "messages": [{"role": "system", "content": "Nhiệm vụ: Viết lại câu hỏi..."}, {"role": "user", "content": text}],
            "temperature": 0.1
        }
        try:
            res = requests.post(url, headers=self.headers, json=payload)
            return res.json()["choices"][0]["message"]["content"]
        except:
            return text

    def smart_chat(self, user_text: str, router_instance, db_client: 'VectorDBClient', context: Optional[UserContext] = None):
        instruction, is_match = router_instance.find_best_instruction(user_text)

        if is_match:
            print("🎯 HIT: Trúng câu hỏi mẫu -> Lấy thêm ngữ cảnh từ VectorDB.")
            context_jobs = db_client.search_similar_jobs(query_text=user_text, n_results=3)
            jobs_context_str = ""
            if context_jobs:
                jobs_context_str += "Dưới đây là một vài công việc liên quan được tìm thấy trên thị trường:\n"
                for job in context_jobs:
                    title = job.get('metadata', {}).get('title', 'Không có tiêu đề')
                    description_snippet = job.get('description', '')[:150] + "..."
                    jobs_context_str += f"- {title}: {description_snippet}\n"

            system_prompt = "Bạn là một trợ lý AI chuyên nghiệp..."
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
            print("⚠️ MISS: Câu hỏi lạ -> Dùng Light LLM chuẩn hóa.")
            system_prompt = "Bạn là trợ lý HR hữu ích, luôn trả lời bằng tiếng Việt."
            refined_text = self.normalize_question(user_text)
            print(f"   Câu hỏi đã chuẩn hóa: {refined_text}")
            final_prompt = refined_text

        # Truyền context xuống cho hàm chat_respond_custom
        return self.chat_respond_custom(final_prompt, system_prompt, context)

    def rag_job_advisory(self, cv_text: str, matched_jobs: list):
        # ... (giữ nguyên)
        pass

class FPTChromaAdapter(EmbeddingFunction):
    def __init__(self, ai_client: 'FPTAIClient'):
        self.ai_client = ai_client
    def __call__(self, texts: Documents) -> Embeddings:
        embeddings = []
        for text in texts:
            embedding = self.ai_client.get_embedding(text) 
            if embedding:
                embeddings.append(embedding)
        return embeddings