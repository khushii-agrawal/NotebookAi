import numpy as np
from sklearn.metrics.pairwise import cosine_similarity

def reciprocal_rank_fusion(rankings: list[list[int]], k: int = 60) -> list[int]:
    """Mathematical RRF formula for hybrid retrieval."""
    scores = {}
    for ranking in rankings:
        for rank, doc_idx in enumerate(ranking):
            if doc_idx not in scores:
                scores[doc_idx] = 0.0
            scores[doc_idx] += 1.0 / (k + rank + 1)
    return sorted(scores.keys(), key=lambda x: scores[x], reverse=True)

def compute_hit_rate(retrieved_chunks: list[str], relevant_keywords: list[str]) -> float:
    """Measures if relevant content is within the top-k results."""
    for chunk in retrieved_chunks:
        chunk_lower = chunk.lower()
        matches = sum(1 for kw in relevant_keywords if kw.lower() in chunk_lower)
        if matches >= max(1, len(relevant_keywords) // 3):
            return 1.0
    return 0.0

def compute_keyword_recall(retrieved_chunks: list[str], relevant_keywords: list[str]) -> float:
    """Calculates the fraction of ground-truth keywords retrieved."""
    if not relevant_keywords: return 0.0
    combined = " ".join(retrieved_chunks).lower()
    found = sum(1 for kw in relevant_keywords if kw.lower() in combined)
    return found / len(relevant_keywords)

def get_semantic_similarity(text_a, text_b, encoder_model):
    """Calculates Cosine Similarity between two text strings."""
    if not text_a or not text_b or text_a.startswith("["): return 0.0
    embeddings = encoder_model.encode([text_a, text_b], normalize_embeddings=True)
    return float(cosine_similarity([embeddings[0]], [embeddings[1]])[0][0])
