from fastapi import FastAPI
from AI_service.core.config import settings # <-- Absolute Import
from AI_service.api.v1.api import api_router # <-- Absolute Import

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# Gắn Router tổng vào ứng dụng với prefix /api/v1
app.include_router(api_router, prefix=settings.API_V1_STR)

@app.get("/")
def health_check():
    """Endpoint kiểm tra sức khỏe của dịch vụ."""
    return {"status": f"{settings.PROJECT_NAME} is Ready"}