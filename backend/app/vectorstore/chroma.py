import chromadb
import os

# Initialize persistent client (survives restarts)
CHROMA_DIR = os.path.join(os.path.dirname(__file__), "..", "..", "chroma_db")
client = chromadb.PersistentClient(path=CHROMA_DIR)

# Collection
collection = client.get_or_create_collection("notebooks")


# =========================
# 🔹 STORE EMBEDDINGS
# =========================
def store(chunks, embeddings, notebook_id: str):
    collection.add(
        documents=chunks,
        embeddings=[e.tolist() for e in embeddings],
        ids=[f"{notebook_id}_{i}" for i in range(len(chunks))],
        metadatas=[{"notebook_id": notebook_id} for _ in chunks]
    )


# =========================
# 🔹 QUERY-BASED RETRIEVAL (USED IN SUMMARY / CHAT)
# =========================
def retrieve(query_embedding, notebook_id: str, k=6):
    results = collection.query(
        query_embeddings=[query_embedding.tolist()],
        n_results=k,
        where={"notebook_id": notebook_id}
    )

    documents = results.get("documents", [])

    if not documents:
        return []

    return documents[0]  # list of chunks


# =========================
# 🔹 DOCUMENT-BASED RETRIEVAL (FOR FLASHCARDS)
# =========================
def retrieve_all_chunks(notebook_id: str, k=15):
    """
    Fetch top chunks from a document for flashcard generation.
    Uses a dummy query but filters by notebook_id.
    """

    results = collection.query(
        query_texts=["flashcards"],  # dummy query
        n_results=k,
        where={"notebook_id": notebook_id}
    )

    documents = results.get("documents", [])

    if not documents:
        return ""

    chunks = documents[0]  # list of text chunks

    # Combine into single context
    context = "\n\n".join(chunks)

    return context