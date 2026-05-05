from fastapi import FastAPI
from app.api.notebooks import router as notebook_router
from fastapi.middleware.cors import CORSMiddleware
from app.api.flashcards import router as flashcard_router
from app.api.quiz import router as quiz_router
from app.api.mindmap import router as mindmap_router
from app.api.report import router as report_router
from app.api.chat import router as chat_router
from app.api.auth import router as auth_router

app = FastAPI(title="AI Smart Notebook Backend")
app.include_router(notebook_router)
app.include_router(flashcard_router)
app.include_router(quiz_router)
app.include_router(mindmap_router)
app.include_router(report_router)
app.include_router(chat_router)
app.include_router(auth_router)

@app.get("/")
def health_check():
    return {
        "status": "ok",
    }

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)