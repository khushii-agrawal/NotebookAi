from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.ai.rag import retrieve_context_by_doc
from app.ai.llm import generate_report

router = APIRouter(prefix="/report", tags=["Report"])

class ReportRequest(BaseModel):
    notebook_id: str

@router.post("/generate")
async def create_report(req: ReportRequest):
    try:
        context = retrieve_context_by_doc(req.notebook_id)

        print("REPORT — NOTEBOOK ID:", req.notebook_id)
        print("REPORT — Context length:", len(context))

        if not context or len(context.strip()) < 50:
            raise HTTPException(
                status_code=404,
                detail="No document content found. Please re-upload the PDF."
            )

        report = generate_report(context)

        return {
            "status": "success",
            "report": report
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
