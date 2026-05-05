import requests
from pathlib import Path
from .config import GROQ_URL, GROQ_API_KEY, GROQ_MODEL, DOCS_DIR

def call_groq(question: str, context: str) -> str:
    """Helper to get LLM answers for RAG faithfulness testing."""
    if not GROQ_API_KEY: return "[API KEY MISSING]"
    prompt = f"Answer based ONLY on context:\n\n{context}\n\nQ: {question}\nA:"
    try:
        res = requests.post(GROQ_URL, headers={"Authorization": f"Bearer {GROQ_API_KEY}"},
                            json={"model": GROQ_MODEL, "messages": [{"role": "user", "content": prompt}]}, 
                            timeout=30)
        return res.json()["choices"][0]["message"]["content"].strip()
    except: return "[Error]"

def load_document_text(doc_name: str) -> str:
    """Loads document content for evaluation processing."""
    path = DOCS_DIR / doc_name
    if not path.exists(): return ""
    if doc_name.endswith('.pdf'):
        from PyPDF2 import PdfReader
        return " ".join(p.extract_text() or "" for p in PdfReader(str(path)).pages)
    return path.read_text(encoding='utf-8')

def get_param_count(model_id: str) -> str:
    """Metadata helper for research paper tables."""
    counts = {"MiniLM-L6": "22M", "DistilBERT": "66M", "BGE-small": "33M", "BGE-base": "109M", "RoBERTa": "355M", "BGE-large": "335M"}
    for key, val in counts.items():
        if key.lower() in model_id.lower(): return val
    return "?"
