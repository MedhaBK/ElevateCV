import fitz  # pymupdf
import re
from fastapi import UploadFile, HTTPException


def extract_text_from_pdf(file: UploadFile) -> str:
    """
    Reads an uploaded PDF and returns cleaned plain text.
    Raises HTTP 400 if the file is not a valid PDF or is empty.
    """
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are accepted.")

    raw_bytes = file.file.read()

    try:
        doc = fitz.open(stream=raw_bytes, filetype="pdf")
    except Exception:
        raise HTTPException(status_code=400, detail="Could not parse PDF. File may be corrupted.")

    pages = []
    for page in doc:
        pages.append(page.get_text())

    doc.close()
    raw_text = "\n".join(pages)

    return _clean_text(raw_text)


def _clean_text(text: str) -> str:
    """
    Normalises extracted PDF text for LLM consumption.
    PDFs often have excessive whitespace, ligature artifacts,
    and broken line endings that confuse token boundaries.
    """
    # Collapse 3+ newlines into 2 (preserve paragraph breaks)
    text = re.sub(r"\n{3,}", "\n\n", text)

    # Remove non-printable/control characters except newlines and tabs
    text = re.sub(r"[^\x09\x0A\x0D\x20-\x7E]", " ", text)

    # Collapse multiple spaces
    text = re.sub(r" {2,}", " ", text)

    # Strip leading/trailing whitespace per line
    lines = [line.strip() for line in text.splitlines()]
    text = "\n".join(line for line in lines if line)

    return text.strip()


def truncate_for_llm(text: str, max_chars: int = 6000) -> str:
    """
    Groq's llama-3.1-8b context is 8192 tokens (~32k chars).
    We truncate conservatively to leave room for the prompt + response.
    6000 chars ≈ ~1500 tokens of resume content — more than enough.
    """
    if len(text) <= max_chars:
        return text
    return text[:max_chars] + "\n\n[... truncated for length]"