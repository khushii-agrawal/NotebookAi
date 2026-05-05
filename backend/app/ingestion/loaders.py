from PyPDF2 import PdfReader
from docx import Document
from PIL import Image
import pytesseract

def load_document(file_path: str, file_type: str) -> str:
    if file_type == "pdf":
        return _load_pdf(file_path)
    if file_type == "docx":
        return _load_docx(file_path)
    if file_type == "txt":
        return _load_txt(file_path)
    if file_type in ["png", "jpg", "jpeg"]:
        return _load_image(file_path)

    raise ValueError("Unsupported file type")

def _load_pdf(path):
    reader = PdfReader(path)
    return " ".join(page.extract_text() or "" for page in reader.pages)

def _load_docx(path):
    doc = Document(path)
    return " ".join(p.text for p in doc.paragraphs)

def _load_txt(path):
    with open(path, "r", encoding="utf-8") as f:
        return f.read()

def _load_image(path):
    img = Image.open(path)
    return pytesseract.image_to_string(img)
