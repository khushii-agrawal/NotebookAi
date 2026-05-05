from fastapi import APIRouter, UploadFile, File, HTTPException
import os
import shutil
from uuid import uuid4

from app.ingestion.loaders import load_document
from app.ingestion.chunker import chunk_text
from app.utils.text_cleaner import clean_text
from app.ai.embeddings import embed_texts
from app.vectorstore.chroma import store
from app.ai.rag import retrieve_context
from app.ai.llm import generate_summary
from app.db.mongodb import notebooks_collection

router = APIRouter(prefix="/notebooks", tags=["Notebooks"])

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


# =========================
# 📌 UPLOAD + SUMMARY API
# =========================
@router.post("/upload")
async def upload_notebook(file: UploadFile = File(...), user_id: str = ""):
    try:
        notebook_id = str(uuid4())
        ext = file.filename.split(".")[-1].lower()

        file_path = f"{UPLOAD_DIR}/{notebook_id}.{ext}"

        # 1️⃣ Save file locally
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # 2️⃣ Load + clean text
        raw_text = load_document(file_path, ext)
        if not raw_text:
            raise HTTPException(status_code=400, detail="Could not extract text")

        clean = clean_text(raw_text)

        # 3️⃣ Chunk + embed
        chunks = chunk_text(clean)
        embeddings = embed_texts(chunks)

        # 4️⃣ Store in vector DB (RAG)
        store(chunks, embeddings, notebook_id=notebook_id)

        # 5️⃣ Retrieve context
        context = retrieve_context(
            query="Generate a concise summary of this document",
            notebook_id=notebook_id
        )

        # 6️⃣ Generate summary
        summary = generate_summary(context)

        # 7️⃣ Save in MongoDB (IMPORTANT)
        notebooks_collection.insert_one({
            "notebook_id": notebook_id,
            "title": file.filename,
            "summary": summary,
            "notes": "",
            "user_id": user_id,
        })

        # 8️⃣ Optional: delete temp file (cleanup)
        if os.path.exists(file_path):
            os.remove(file_path)

        return {
            "notebook_id": notebook_id,
            "title": file.filename,
            "summary": summary
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# =========================
# 📌 GET NOTEBOOK
# =========================
@router.get("/{notebook_id}")
def get_notebook(notebook_id: str):
    notebook = notebooks_collection.find_one({"notebook_id": notebook_id})

    if not notebook:
        raise HTTPException(status_code=404, detail="Notebook not found")

    return {
        "notebook_id": notebook["notebook_id"],
        "title": notebook["title"],
        "summary": notebook["summary"],
        "notes": notebook["notes"]
    }


# =========================
# 📌 GET ALL NOTEBOOKS
# =========================
@router.get("/")
def get_all_notebooks(user_id: str = ""):
    query = {"user_id": user_id} if user_id else {}
    notebooks = list(notebooks_collection.find(query, {"_id": 0}))

    return {"notebooks": notebooks}