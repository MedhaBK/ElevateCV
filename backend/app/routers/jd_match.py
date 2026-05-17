from fastapi import APIRouter, UploadFile, File, HTTPException, Form
from pathlib import Path
from app.services.parser import extract_text_from_pdf, truncate_for_llm
from app.services.embedder import compute_match_score
from app.services.llm import call_llm_json
from app.schemas.job import JDMatchResponse

router = APIRouter(prefix="/jd", tags=["JD Matching"])

PROMPT_PATH = Path(__file__).parent.parent / "prompts" / "jd_match.txt"
JD_PROMPT_TEMPLATE = PROMPT_PATH.read_text()


@router.post("/match", response_model=JDMatchResponse)
def match_jd(
    file: UploadFile = File(...),
    jd_text: str = Form(...),
):
    # Step 1: Parse resume PDF
    resume_text = extract_text_from_pdf(file)

    if len(resume_text.strip()) < 100:
        raise HTTPException(
            status_code=422,
            detail="Resume text too short. Ensure the PDF is text-based."
        )

    if len(jd_text.strip()) < 50:
        raise HTTPException(
            status_code=422,
            detail="Job description too short to analyze."
        )

    # Step 2: Compute semantic match score (local, no API cost)
    match_score = compute_match_score(resume_text, jd_text)

    # Step 3: Truncate both for LLM context safety
    resume_truncated = truncate_for_llm(resume_text, max_chars=3000)
    jd_truncated = truncate_for_llm(jd_text, max_chars=2000)

    # Step 4: Build prompt and call LLM for gap analysis
    prompt = (
        JD_PROMPT_TEMPLATE
        .replace("{resume_text}", resume_truncated)
        .replace("{jd_text}", jd_truncated)
    )

    try:
        result = call_llm_json(
            prompt=prompt,
            system_prompt="You are an expert technical recruiter. Always respond with valid JSON only.",
            max_tokens=1024,
        )
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"LLM call failed: {str(e)}")

    # Step 5: Inject computed score + validate full response
    result["match_score"] = match_score

    try:
        return JDMatchResponse(**result)
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"LLM returned unexpected format: {str(e)}"
        )