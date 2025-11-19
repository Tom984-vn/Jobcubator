import torch
import torch.nn.functional as F
from typing import List

class JobMatcher:
    @staticmethod
    def compute_similarity(vec1: List[float], vec2: List[float]) -> float:
        """Tính cosine similarity giữa 2 vector"""
        if not vec1 or not vec2:
            return 0.0
        
        t1 = torch.tensor(vec1)
        t2 = torch.tensor(vec2)
        
        # dim=0 nghĩa là tính dọc theo vector
        return F.cosine_similarity(t1, t2, dim=0).item()