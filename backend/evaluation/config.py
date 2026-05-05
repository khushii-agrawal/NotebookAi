import os
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

# Models
EMBEDDING_MODELS = {
    "MiniLM-L6 (BERT)": "sentence-transformers/all-MiniLM-L6-v2",
    "DistilBERT-MSMARCO": "sentence-transformers/msmarco-distilbert-base-v4",
    "BGE-small (current)": "BAAI/bge-small-en-v1.5",
    "BGE-base": "BAAI/bge-base-en-v1.5",
    "RoBERTa-large": "sentence-transformers/all-roberta-large-v1",
    "BGE-large": "BAAI/bge-large-en-v1.5",
}

ENSEMBLE_PAIRS = [
    {
        "name": "BGE-small + MiniLM (Lightweight Ensemble)",
        "model_a": "BAAI/bge-small-en-v1.5",
        "model_b": "sentence-transformers/all-MiniLM-L6-v2",
        "params": "55M",
    },
    {
        "name": "BGE-small + DistilBERT (Cross-Training)",
        "model_a": "BAAI/bge-small-en-v1.5",
        "model_b": "sentence-transformers/msmarco-distilbert-base-v4",
        "params": "99M",
    },
    {
        "name": "BGE-base + RoBERTa-large (Best-of-Both)",
        "model_a": "BAAI/bge-base-en-v1.5",
        "model_b": "sentence-transformers/all-roberta-large-v1",
        "params": "464M",
    },
]

# Settings
TOP_K = 6
GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")
GROQ_URL = "https://api.groq.com/openai/v1/chat/completions"
GROQ_MODEL = "llama-3.1-8b-instant"

# Paths
EVAL_DIR = Path(__file__).parent
GROUND_TRUTH_PATH = EVAL_DIR / "ground_truth.json"
RESULTS_DIR = EVAL_DIR / "results"
DOCS_DIR = EVAL_DIR / "documents"

# Ensure directories exist
RESULTS_DIR.mkdir(exist_ok=True)
DOCS_DIR.mkdir(exist_ok=True)
