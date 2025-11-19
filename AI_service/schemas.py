from pydantic import BaseModel
from typing import List, Optional

class TextRequest(BaseModel):
    text: str
    user_id: Optional[str] = None

class MatchRequest(BaseModel):
    user_embedding: List[float]
    job_embedding: List[float]