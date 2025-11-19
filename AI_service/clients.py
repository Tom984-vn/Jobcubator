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
    def generate_report(self, job_id_list: List[int], text: str) -> str:
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