import requests
import json
from typing import List
from config import settings  # Import settings từ file config.py

class FPTAIClient:
    def __init__(self):
        self.headers = {
            "Authorization": f"Bearer {settings.API_KEY}",
            "Content-Type": "application/json"
        }
        self.endpoint = settings.ENDPOINT.rstrip('/')

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
                {"role": "system", "content": "Bạn là trợ lý HR."},
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
    def generate_report(self, job_id_list: List[int], text: str) -> str:  #cần generate tối thiểu 3 recommend dựa theo các tiêu chí khác nhau
        url = f"{self.endpoint}/chat/completions"
        prompt = f"""
        Dưới đây là hồ sơ ứng viên:

        {text}

        Dưới đây là mô tả công việc:

        {job_id_list.text}

        Hãy phân tích:

        Những điểm phù hợp chính.
        Những điểm còn thiếu và có thể đào tạo nhanh.
        Tóm tắt mức độ phù hợp dạng phần trăm.
        Gợi ý công ty nên trao đổi gì khi phỏng vấn.
        Gợi ý ứng viên nên học thêm gì nếu muốn tăng cơ hội trúng tuyển.
        """
        
        payload = {
            "model": settings.H_LLM_MODEL,
            "messages": [
                {"role": "system", "content": "Bạn là chuyên gia phân tích việc làm của Jobcubator. Nhiệm vụ: đánh giá mức độ phù hợp giữa ứng viên và công việc, dựa trên thông tin đã cho. Chỉ đưa ra câu trả lời dựa trên dữ liệu đầu vào. Không tự bịa thêm thông tin."},
                {"role": "user", "content": prompt}
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
    def chat_respond(self, text: str):
        url = f"{self.endpoint}/chat/completions"
        prompt = f"{text}\nHãy trả lời câu hỏi này với sự giúp đỡ nhiệt tình và ân cần" #prompt đầu vào của LLM respong
        
        payload = {
            "model": settings.H_LLM_MODEL,
            "messages": [
                {"role": "system", "content": "Bạn là trợ lý HR."},
                {"role": "user", "content": prompt}
            ],
            "temperature": 0.3,
            "stream" :True
        }

        try:
            response = requests.post(url, headers=self.headers, json=payload)
            response.raise_for_status()
            for line in response.iter_lines(): 
                if not line:
                    continue
                text = line.decode("utf-8")
                if text.startswith("data: "):
                    text = text[6:]
                if text == "[DONE]":
                    break

                yield json.loads(text)
        except Exception as e:
            print(f"Lỗi Chat: {e}")
            return "Lỗi xử lý văn bản"
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

    def chat_respond_custom(self, user_text, sys_prompt):
        # Hàm này copy logic stream từ hàm chat_respond cũ
        # Nhưng thay thế "role": "system" bằng biến sys_prompt truyền vào
        # ... (bạn tự ghép code stream vào đây nhé) ...
        pass