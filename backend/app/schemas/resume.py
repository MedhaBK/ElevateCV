from pydantic import BaseModel, Field
from typing import List


class ATSRequest(BaseModel):
    # Not used directly (file upload via form),
    # but documents the expected input shape
    pass


class ATSResponse(BaseModel):
    ats_score: int = Field(..., ge=0, le=100)
    summary: str
    strengths: List[str]
    weaknesses: List[str]
    missing_keywords: List[str]
    formatting_issues: List[str]
    improvement_tips: List[str]