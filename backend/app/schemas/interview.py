from pydantic import BaseModel
from typing import List
from enum import Enum


class Difficulty(str, Enum):
    easy = "Easy"
    medium = "Medium"
    hard = "Hard"


class TechnicalQuestion(BaseModel):
    question: str
    difficulty: Difficulty
    topic: str


class BehavioralQuestion(BaseModel):
    question: str
    framework: str


class ResumeBasedQuestion(BaseModel):
    question: str


class InterviewResponse(BaseModel):
    technical: List[TechnicalQuestion]
    behavioral: List[BehavioralQuestion]
    resume_based: List[ResumeBasedQuestion]