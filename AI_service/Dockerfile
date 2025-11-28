# ==============================================================================
# GIAI ĐOẠN 1: BUILDER - Cài đặt dependencies
# ==============================================================================
FROM python:3.11-slim as builder

ENV PIP_DEFAULT_TIMEOUT=100 \
    PIP_DISABLE_PIP_VERSION_CHECK=1 \
    PYTHONUNBUFFERED=1

WORKDIR /install

# Sao chép file requirements.txt (nằm cùng thư mục với Dockerfile)
COPY requirements.txt /install/

# Cài đặt thư viện Python
RUN pip install --no-cache-dir --upgrade pip
RUN pip install --no-cache-dir -r requirements.txt


# ==============================================================================
# GIAI ĐOẠN 2: RUNNER - Image cuối cùng
# ==============================================================================
FROM python:3.11-slim

WORKDIR /app

# 1. Sao chép các thư viện đã cài đặt từ giai đoạn Builder
COPY --from=builder /usr/local/lib/python3.11/site-packages /usr/local/lib/python3.11/site-packages
COPY --from=builder /usr/local/bin /usr/local/bin

# 2. Sao chép Mã nguồn Ứng dụng
# Vì Dockerfile nằm trong AI_service, lệnh này sẽ copy main.py -> /app/main.py
COPY . /app/

# 3. Đảm bảo VectorDB Persistence
VOLUME /app/chroma_db_data

# 4. Khai báo Cổng
EXPOSE 8000

# 5. Lệnh Khởi động Container (ĐÃ ĐIỀU CHỈNH ENTRYPOINT)
# LƯU Ý QUAN TRỌNG:
# Module đã đổi từ 'AI_service.main' (package) sang 'main' (file)
ENTRYPOINT export FPT_AI_API_KEY=$(cat /run/secrets/fpt_ai_api_key) && \
           exec uvicorn main:app --host 0.0.0.0 --port 8000