from fastapi import APIRouter, UploadFile, File, HTTPException
from pathlib import Path
from app.services.parser import extract_text_from_pdf, truncate_for_llm
from app.services.llm import call_llm_json
from app.schemas.resume import ATSResponse

router = APIRouter(prefix="/resume", tags=["Resume"])

# Load prompt once at module load — not on every request
PROMPT_PATH = Path(__file__).parent.parent / "prompts" / "ats.txt"
ATS_PROMPT_TEMPLATE = PROMPT_PATH.read_text()


@router.post("/analyze", response_model=ATSResponse)
def analyze_resume(file: UploadFile = File(...)):
    # Step 1: Parse PDF → clean text
    resume_text = extract_text_from_pdf(file)

    if len(resume_text.strip()) < 100:
        raise HTTPException(
            status_code=422,
            detail="Resume text too short. Ensure the PDF is text-based, not scanned."
        )

    # Step 2: Truncate to fit LLM context window
    resume_text = truncate_for_llm(resume_text)

    # Step 3: Inject resume into prompt template
    prompt = ATS_PROMPT_TEMPLATE.replace("{resume_text}", resume_text)

    # Step 4: Call LLM, get structured JSON back
    try:
        result = call_llm_json(
            prompt=prompt,
            system_prompt="You are an expert ATS resume analyzer. Always respond with valid JSON only.",
            max_tokens=1024,
        )
    except Exception as e:
        raise HTTPException(
            status_code=502,
            detail=f"LLM call failed: {str(e)}"
        )

    # Step 5: Validate response shape with Pydantic
    try:
        return ATSResponse(**result)
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"LLM returned unexpected format: {str(e)}"
        )