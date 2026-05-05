from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.ai.rag import retrieve_context_by_doc
from app.ai.llm import generate_quiz

router = APIRouter(prefix="/quiz", tags=["Quiz"])

class QuizRequest(BaseModel):
    notebook_id: str

@router.post("/generate")
async def create_quiz(req: QuizRequest):
    try:
        context = retrieve_context_by_doc(req.notebook_id)

        print("QUIZ — NOTEBOOK ID:", req.notebook_id)
        print("QUIZ — Context length:", len(context))

        if not context or len(context.strip()) < 50:
            raise HTTPException(
                status_code=404,
                detail="No document content found. Please re-upload the PDF."
            )

        quiz = generate_quiz(context)

        return {
            "status": "success",
            "questions": quiz
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
