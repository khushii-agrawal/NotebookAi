import time
import json
import numpy as np
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
from .config import EMBEDDING_MODELS, ENSEMBLE_PAIRS, GROUND_TRUTH_PATH, TOP_K
from .metrics import reciprocal_rank_fusion, compute_hit_rate, compute_keyword_recall, get_semantic_similarity
from .helpers import load_document_text, call_groq, get_param_count
from .strategies import chunk_fixed, CHUNKING_STRATEGIES

def run_embedding_eval(single_model=None):
    with open(GROUND_TRUTH_PATH, 'r') as f: gt = json.load(f)
    results = {}
    
    models_to_test = EMBEDDING_MODELS
    if single_model:
        if single_model not in EMBEDDING_MODELS:
            print(f"Model '{single_model}' not found. Available: {list(EMBEDDING_MODELS.keys())}")
            return results
        models_to_test = {single_model: EMBEDDING_MODELS[single_model]}
    
    for name, m_id in models_to_test.items():
        print(f"Testing {name}...")
        model = SentenceTransformer(m_id)
        hits, faiths, latencies, recalls = [], [], [], []
        
        for q in gt:
            text = load_document_text(q["document"])
            chunks = chunk_fixed(text)
            
            t0 = time.time()
            q_emb = model.encode([q["question"]], normalize_embeddings=True)
            latencies.append((time.time() - t0)*1000)
            
            c_embs = model.encode(chunks, normalize_embeddings=True)
            sims = cosine_similarity(q_emb, c_embs)[0]
            top_idx = np.argsort(sims)[-TOP_K:][::-1]
            retrieved = [chunks[i] for i in top_idx]
            
            hits.append(compute_hit_rate(retrieved, q["relevant_keywords"]))
            recalls.append(compute_keyword_recall(retrieved, q["relevant_keywords"]))
            ans = call_groq(q["question"], "\n".join(retrieved))
            faiths.append(get_semantic_similarity(ans, "\n".join(retrieved), model))
            
        results[name] = {"hit_rate": np.mean(hits), "keyword_recall": np.mean(recalls), "faithfulness": np.mean(faiths), "embed_latency_ms": np.mean(latencies), "num_params": get_param_count(m_id)}
    return results

def run_ensemble_eval(single_ensemble=None):
    with open(GROUND_TRUTH_PATH, 'r') as f: gt = json.load(f)
    results = {}
    
    pairs_to_test = ENSEMBLE_PAIRS
    if single_ensemble:
        pairs_to_test = [p for p in ENSEMBLE_PAIRS if p["name"] == single_ensemble]
        if not pairs_to_test:
            print(f"Ensemble '{single_ensemble}' not found. Available: {[p['name'] for p in ENSEMBLE_PAIRS]}")
            return results
            
    for pair in pairs_to_test:
        print(f"Testing Ensemble: {pair['name']}...")
        model_a, model_b = SentenceTransformer(pair["model_a"]), SentenceTransformer(pair["model_b"])
        hits, recalls = [], []
        for q in gt:
            text = load_document_text(q["document"])
            chunks = chunk_fixed(text)
            
            rank_a = np.argsort(cosine_similarity(model_a.encode([q["question"]]), model_a.encode(chunks))[0])[::-1]
            rank_b = np.argsort(cosine_similarity(model_b.encode([q["question"]]), model_b.encode(chunks))[0])[::-1]
            
            fused = reciprocal_rank_fusion([rank_a, rank_b])[:TOP_K]
            retrieved = [chunks[i] for i in fused]
            hits.append(compute_hit_rate(retrieved, q["relevant_keywords"]))
            recalls.append(compute_keyword_recall(retrieved, q["relevant_keywords"]))
        results[pair['name']] = {"hit_rate": np.mean(hits), "keyword_recall": np.mean(recalls), "params": pair["params"]}
    return results

def run_chunking_eval(single_strategy=None):
    with open(GROUND_TRUTH_PATH, 'r') as f: gt = json.load(f)
    results = {}
    
    strategies_to_test = CHUNKING_STRATEGIES
    if single_strategy:
        if single_strategy not in CHUNKING_STRATEGIES:
            print(f"Strategy '{single_strategy}' not found. Available: {list(CHUNKING_STRATEGIES.keys())}")
            return results
        strategies_to_test = {single_strategy: CHUNKING_STRATEGIES[single_strategy]}
        
    print("Using 'BGE-small (current)' as baseline for chunking evaluation...")
    model = SentenceTransformer(EMBEDDING_MODELS["BGE-small (current)"])
    
    for name, chunk_func in strategies_to_test.items():
        print(f"Testing Chunking Strategy: {name}...")
        hits, faiths, latencies, recalls = [], [], [], []
        
        for q in gt:
            text = load_document_text(q["document"])
            
            t0 = time.time()
            chunks = chunk_func(text)
            latencies.append((time.time() - t0)*1000)
            
            # Use fixed top-k
            q_emb = model.encode([q["question"]], normalize_embeddings=True)
            c_embs = model.encode(chunks, normalize_embeddings=True)
            sims = cosine_similarity(q_emb, c_embs)[0]
            top_idx = np.argsort(sims)[-TOP_K:][::-1]
            retrieved = [chunks[i] for i in top_idx]
            
            hits.append(compute_hit_rate(retrieved, q["relevant_keywords"]))
            recalls.append(compute_keyword_recall(retrieved, q["relevant_keywords"]))
            ans = call_groq(q["question"], "\n".join(retrieved))
            faiths.append(get_semantic_similarity(ans, "\n".join(retrieved), model))
            
        results[name] = {"hit_rate": np.mean(hits), "keyword_recall": np.mean(recalls), "faithfulness": np.mean(faiths), "chunking_latency_ms": np.mean(latencies)}
    return results
