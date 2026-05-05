from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.ai.rag import retrieve_context_by_doc
from app.ai.llm import generate_flashcards

router = APIRouter(prefix="/flashcards", tags=["Flashcards"])

class FlashcardRequest(BaseModel):
    notebook_id: str

@router.post("/generate")
async def create_flashcards(req: FlashcardRequest):
    try:
        # Step 1: Retrieve context from vector DB
        context = retrieve_context_by_doc(req.notebook_id)

        # Debug
        print("NOTEBOOK ID RECEIVED:", req.notebook_id)
        print("Retrieved context length:", len(context))

        if not context or len(context.strip()) < 50:
            raise HTTPException(
                status_code=404,
                detail="No document content found for this notebook. Please re-upload the PDF."
            )

       
        flashcards = generate_flashcards(context)

        return {
            "status": "success",
            "flashcards": flashcards
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))