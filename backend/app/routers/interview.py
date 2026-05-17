from fastapi import APIRouter, UploadFile, File, HTTPException, Form
from pathlib import Path
from app.services.parser import extract_text_from_pdf, truncate_for_llm
from app.services.llm import call_llm_json
from app.schemas.interview import InterviewResponse

router = APIRouter(prefix="/interview", tags=["Interview"])

PROMPT_PATH = Path(__file__).parent.parent / "prompts" / "interview.txt"
INTERVIEW_PROMPT_TEMPLATE = PROMPT_PATH.read_text()


@router.post("/generate", response_model=InterviewResponse)
def generate_questions(
    file: UploadFile = File(...),
    job_role: str = Form(...),
):
    # Step 1: Parse resume
    resume_text = extract_text_from_pdf(file)

    if len(resume_text.strip()) < 100:
        raise HTTPException(
            status_code=422,
            detail="Resume text too short. Ensure the PDF is text-based."
        )

    if len(job_role.strip()) < 3:
        raise HTTPException(
            status_code=422,
            detail="Please provide a valid job role."
        )

    # Step 2: Truncate resume for context safety
    resume_truncated = truncate_for_llm(resume_text, max_chars=4000)

    # Step 3: Build prompt
    prompt = (
        INTERVIEW_PROMPT_TEMPLATE
        .replace("{job_role}", job_role.strip())
        .replace("{resume_text}", resume_truncated)
    )

    # Step 4: Call LLM
    try:
        result = call_llm_json(
            prompt=prompt,
            system_prompt="You are an expert technical interviewer. Always respond with valid JSON only.",
            max_tokens=1500,
        )
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"LLM call failed: {str(e)}")

    # Step 5: Validate and return
    try:
        return InterviewResponse(**result)
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"LLM returned unexpected format: {str(e)}"
        )