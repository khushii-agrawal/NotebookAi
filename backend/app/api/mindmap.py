from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.ai.rag import retrieve_context_by_doc
from app.ai.llm import generate_mindmap

router = APIRouter(prefix="/mindmap", tags=["MindMap"])

class MindMapRequest(BaseModel):
    notebook_id: str

@router.post("/generate")
async def create_mindmap(req: MindMapRequest):
    try:
        context = retrieve_context_by_doc(req.notebook_id)

        print("MINDMAP — NOTEBOOK ID:", req.notebook_id)
        print("MINDMAP — Context length:", len(context))

        if not context or len(context.strip()) < 50:
            raise HTTPException(
                status_code=404,
                detail="No document content found. Please re-upload the PDF."
            )

        mindmap = generate_mindmap(context)

        return {
            "status": "success",
            "mindmap": mindmap
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
