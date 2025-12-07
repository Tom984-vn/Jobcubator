FROM python:3.11-slim

# Cài đặt thư viện
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

WORKDIR /app

# Copy code
COPY . .

# Expose port (Internal)
EXPOSE 3000 

# WORKDIR /app/AI_service

# CMD export FPT_API_KEY=$(cat /run/secrets/fpt_ai_key) && export OPEN_API_KEY=$(cat /run/secrets/open_ai_key)

# Chạy app (Host 0.0.0.0 là bắt buộc trong Docker)
# CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "3000"]

CMD ["/bin/sh", "-c", "export FPT_API_KEY=$(cat /run/secrets/fpt_ai_key) && export OPEN_API_KEY=$(cat /run/secrets/open_ai_key) && uvicorn AI_service.main:app --host 0.0.0.0 --port 3000"]
