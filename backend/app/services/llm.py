from groq import Groq
from ..config import settings
from typing import Optional
import json

# ── client is instantiated once at module load ──────────────────────────────
# This avoids re-creating the HTTP connection on every request.
_groq_client = Groq(api_key=settings.groq_api_key)


def _get_client():
    """
    Provider switch point.
    To add OpenAI: check settings.llm_provider and return the right client.
    """
    if settings.llm_provider == "groq":
        return _groq_client
    raise ValueError(f"Unsupported LLM provider: {settings.llm_provider}")

def call_llm(
        prompt: str,
        system_prompt: str = 'You are a helpful AI assistant.',
        temperature: float = 0.3,
        max_tokens: int = 1024,
) -> str:
    """
    Single entry point for all LLM calls in the app.

    Return raw string response. Callers are responsible for 
    parsing json if they expect structured output.
    """
    client = _get_client()

    response = client.chat.completions.create(
        model = settings.llm_model,
        messages = [
            {'role': 'system', 'content': system_prompt},
            {'role': 'user', 'content': prompt},
        ],
        temperature = temperature,
        max_tokens=max_tokens,
    )

    return response.choices[0].message.content

def call_llm_json(
    prompt: str,
    system_prompt: str = "You are a helpful AI assistant. Always respond with valid JSON.",
    temperature: float = 0.2,
    max_tokens: int = 1024,
) -> dict:
    """
    Wrapper for when you need structured JSON back.
    Lower temperature = more deterministic output.
    Strips markdown code fences Groq sometimes wraps around JSON.
    """
    raw = call_llm(
        prompt=prompt,
        system_prompt=system_prompt,
        temperature=temperature,
        max_tokens=max_tokens,
    )

    # Groq (and most LLMs) sometimes wrap JSON in ```json ... ```
    # Strip it defensively before parsing
    cleaned = raw.strip()
    if cleaned.startswith("```"):
        cleaned = cleaned.split("```")[1]
        if cleaned.startswith("json"):
            cleaned = cleaned[4:]

    return json.loads(cleaned.strip())