from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np


def compute_match_score(resume_text: str, jd_text: str) -> int:
    """
    Computes TF-IDF cosine similarity between resume and JD.
    Lightweight alternative to sentence-transformers for free-tier deployment.
    No model loading — pure sklearn, ~5MB RAM.
    """
    vectorizer = TfidfVectorizer(
        stop_words="english",
        ngram_range=(1, 2),   # unigrams + bigrams for better matching
        max_features=5000,
    )

    corpus = [resume_text, jd_text]
    tfidf_matrix = vectorizer.fit_transform(corpus)

    score = cosine_similarity(tfidf_matrix[0], tfidf_matrix[1])[0][0]

    # TF-IDF cosine similarity typically ranges 0.05–0.6 for resume/JD pairs
    # Rescale to 0–100 for UX clarity
    normalized = min(score / 0.6, 1.0)
    return round(normalized * 100)