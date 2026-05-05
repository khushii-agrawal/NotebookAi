from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.db.mongodb import users_collection
import hashlib
import uuid

router = APIRouter()


# =========================
# 🔹 MODELS
# =========================
class SignUpRequest(BaseModel):
    name: str
    email: str
    password: str


class LoginRequest(BaseModel):
    email: str
    password: str


# =========================
# 🔹 PASSWORD HASHING (simple SHA256 — no extra deps)
# =========================
def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()


# =========================
# 🔹 SIGNUP
# =========================
@router.post("/auth/signup")
def signup(req: SignUpRequest):
    # Check if email already exists
    existing = users_collection.find_one({"email": req.email.lower()})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    user_id = str(uuid.uuid4())

    user = {
        "user_id": user_id,
        "name": req.name.strip(),
        "email": req.email.lower().strip(),
        "password": hash_password(req.password),
    }

    users_collection.insert_one(user)

    return {
        "user_id": user_id,
        "name": user["name"],
        "email": user["email"],
    }


# =========================
# 🔹 LOGIN
# =========================
@router.post("/auth/login")
def login(req: LoginRequest):
    user = users_collection.find_one({"email": req.email.lower().strip()})

    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password")

    if user["password"] != hash_password(req.password):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    return {
        "user_id": user["user_id"],
        "name": user["name"],
        "email": user["email"],
    }
