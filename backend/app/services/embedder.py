from sentence_transformers import SentenceTransformer
import numpy as np
from app.config import settings

# Load once at module level — this takes ~2s on first run
# Subsequent calls are instant
_model = SentenceTransformer(settings.embedding_model)


def get_embedding(text: str) -> np.ndarray:
    """Returns a normalized embedding vector for a given text."""
    embedding = _model.encode(text, convert_to_numpy=True)
    # Normalize to unit vector — required for cosine similarity via dot product
    return embedding / np.linalg.norm(embedding)


def cosine_similarity(vec_a: np.ndarray, vec_b: np.ndarray) -> float:
    """
    Dot product of two unit vectors = cosine similarity.
    Returns float between -1 and 1. Resumes vs JDs are always positive.
    """
    return float(np.dot(vec_a, vec_b))


def compute_match_score(resume_text: str, jd_text: str) -> int:
    """
    Returns an integer 0-100 representing semantic similarity
    between resume and job description.
    """
    resume_vec = get_embedding(resume_text)
    jd_vec = get_embedding(jd_text)
    similarity = cosine_similarity(resume_vec, jd_vec)

    # Cosine similarity for related docs typically ranges 0.3-0.9
    # We rescale to 0-100 for UX clarity
    score = round(similarity * 100)
    return max(0, min(100, score))





'''I used sentence-transformers to generate dense vector embeddings locally — no API cost. Cosine similarity between normalized vectors is just a dot product, so it's a single numpy operation. The raw similarity score is between 0 and 1, which I scale to 0–100 for frontend display.'''