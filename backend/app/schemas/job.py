from pydantic import BaseModel
from typing import List


class JDMatchRequest(BaseModel):
    jd_text: str


class JDMatchResponse(BaseModel):
    match_score: int
    matched_skills: List[str]
    missing_skills: List[str]
    extra_skills: List[str]
    experience_gap: str
    recommendations: List[str]