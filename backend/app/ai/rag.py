from app.ai.embeddings import embed_texts
from app.vectorstore.chroma import retrieve, retrieve_all_chunks


def retrieve_context(query: str, notebook_id: str) -> str:
    query_embedding = embed_texts([query])[0]
    docs = retrieve(query_embedding, notebook_id)
    return "\n".join(docs)


def retrieve_context_by_doc(notebook_id: str) -> str:
    return retrieve_all_chunks(notebook_id)