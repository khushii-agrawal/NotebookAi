from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from app.ai.rag import retrieve_context
from app.ai.llm import generate_chat_response

router = APIRouter(prefix="/chat", tags=["Chat"])


class ChatMessageItem(BaseModel):
    role: str
    content: str


class ChatRequest(BaseModel):
    notebook_id: str
    question: str
    chat_history: Optional[list[ChatMessageItem]] = []


@router.post("/ask")
async def ask_question(req: ChatRequest):
    try:
        # 🔹 RAG: Retrieve relevant context from the document
        context = retrieve_context(req.question, req.notebook_id)

        print("CHAT — NOTEBOOK ID:", req.notebook_id)
        print("CHAT — Question:", req.question)
        print("CHAT — Context length:", len(context) if context else 0)

        if not context or len(context.strip()) < 20:
            return {
                "status": "success",
                "answer": "I couldn't find enough content in your document to answer that. Please make sure a PDF has been uploaded to this notebook."
            }

        # 🔹 Convert chat history to dict format for LLM
        history = [
            {"role": msg.role, "content": msg.content}
            for msg in (req.chat_history or [])
        ]

        # 🔹 Generate RAG-based answer
        answer = generate_chat_response(req.question, context, history)

        return {
            "status": "success",
            "answer": answer
        }

    except HTTPException:
        raise
    except Exception as e:
        print("CHAT ERROR:", str(e))
        raise HTTPException(status_code=500, detail=str(e))
