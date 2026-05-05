import requests
import json
import re
import os
from dotenv import load_dotenv

load_dotenv()

# =========================
# 🔹 CONFIG
# =========================
OLLAMA_URL = "http://localhost:11434/api/generate"
OLLAMA_MODEL = "mistral"

GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")
GROQ_URL = "https://api.groq.com/openai/v1/chat/completions"
GROQ_MODEL = "llama-3.1-8b-instant"


# =========================
# 🔹 GROQ HELPER (PRIMARY — FAST)
# =========================
def _call_groq(prompt: str, max_tokens: int = 400, temperature: float = 0.3) -> str:
    """Call Groq API. Returns response text or raises Exception on failure."""
    response = requests.post(
        GROQ_URL,
        headers={
            "Authorization": f"Bearer {GROQ_API_KEY}",
            "Content-Type": "application/json"
        },
        json={
            "model": GROQ_MODEL,
            "messages": [{"role": "user", "content": prompt}],
            "temperature": temperature,
            "max_tokens": max_tokens,
            "top_p": 0.9,
        },
        timeout=30
    )
    response.raise_for_status()
    data = response.json()
    return data["choices"][0]["message"]["content"].strip()


# =========================
# 🔹 OLLAMA HELPER (FALLBACK — LOCAL)
# =========================
def _call_ollama(prompt: str, max_tokens: int = 400, temperature: float = 0.3) -> str:
    """Call local Ollama/Mistral. Returns response text."""
    response = requests.post(
        OLLAMA_URL,
        json={
            "model": OLLAMA_MODEL,
            "prompt": prompt,
            "stream": False,
            "options": {
                "temperature": temperature,
                "num_predict": max_tokens,
                "num_ctx": 2048,
                "top_p": 0.9,
            }
        },
        timeout=600
    )
    response.raise_for_status()
    data = response.json()
    return data.get("response", "").strip()


# =========================
# 🔹 SMART CALLER (GROQ → OLLAMA FALLBACK)
# =========================
def _call_llm(prompt: str, max_tokens: int = 400, temperature: float = 0.3) -> str:
    """Try Groq first. If it fails, fall back to Ollama."""
    if GROQ_API_KEY:
        try:
            print("🚀 Using Groq API...")
            return _call_groq(prompt, max_tokens, temperature)
        except Exception as e:
            print(f"⚠️ Groq failed: {e} — Falling back to Ollama...")

    print("🐢 Using Ollama/Mistral (local)...")
    return _call_ollama(prompt, max_tokens, temperature)


# =========================
# 🔹 SUMMARY FUNCTION
# =========================
def generate_summary(context: str) -> str:
    context = context[:2000]

    prompt = f"""Summarize this document in 3-5 bullet points. Be concise.

DOCUMENT:
{context}

SUMMARY:"""

    return _call_llm(prompt, max_tokens=200, temperature=0.3)


# =========================
# 🔹 FLASHCARD FUNCTION
# =========================
def generate_flashcards(context: str):
    context = context.split("\n\n")[:5]
    context = "\n\n".join(context)
    context = context[:2000]

    prompt = f"""Generate 4 flashcards from this text. Return ONLY a JSON array, no extra text.

Text:
{context}

JSON:
[
  {{"question": "...", "answer": "..."}}
]"""

    raw_output = _call_llm(prompt, max_tokens=400, temperature=0.3)

    # =========================
    # 🔹 JSON CLEANING (IMPORTANT)
    # =========================
    try:
        return json.loads(raw_output)
    except json.JSONDecodeError:
        # Try to extract JSON if model adds extra text
        try:
            start = raw_output.find("[")
            end = raw_output.rfind("]") + 1
            cleaned = raw_output[start:end]
            return json.loads(cleaned)
        except:
            return {
                "error": "Invalid JSON from model",
                "raw_output": raw_output
            }


# =========================
# 🔹 QUIZ FUNCTION (TEXT-BASED — RELIABLE)
# =========================
def generate_quiz(context: str):
    context = context[:2000]

    prompt = f"""Read the text below and create 5 quiz questions. Use EXACTLY this format for each question:

Q1: What is the main topic?
A) First option
B) Second option
C) Third option
D) Fourth option
ANSWER: A

Q2: Another question?
A) Option
B) Option
C) Option
D) Option
ANSWER: B

Text:
{context}

Generate 5 questions now:"""

    raw_output = _call_llm(prompt, max_tokens=800, temperature=0.3)

    print("QUIZ RAW OUTPUT:", raw_output[:500])

    # === PARSE TEXT → JSON ===
    questions = []
    # Split by question pattern Q1:, Q2:, etc.
    blocks = re.split(r'Q\d+[:\.]?\s*', raw_output)
    blocks = [b.strip() for b in blocks if b.strip()]

    for i, block in enumerate(blocks[:5]):
        lines = block.strip().split('\n')
        lines = [l.strip() for l in lines if l.strip()]

        if len(lines) < 5:
            continue

        question_text = lines[0]
        options = []
        correct = "a"

        for line in lines[1:]:
            # Match A) text or A. text or a) text
            opt_match = re.match(r'^([A-Da-d])[).\]]\s*(.*)', line)
            if opt_match:
                opt_id = opt_match.group(1).lower()
                opt_text = opt_match.group(2).strip()
                options.append({"id": opt_id, "text": opt_text})

            # Match ANSWER: A or Answer: B
            ans_match = re.match(r'^(?:ANSWER|Answer|Correct)[:\s]+([A-Da-d])', line)
            if ans_match:
                correct = ans_match.group(1).lower()

        if len(options) >= 4:
            questions.append({
                "id": f"q{i+1}",
                "question": question_text,
                "options": options[:4],
                "correctOptionId": correct
            })

    if questions:
        return questions

    # Fallback: try JSON parse (in case model still outputs JSON)
    try:
        start = raw_output.find("[")
        end = raw_output.rfind("]") + 1
        if start != -1 and end > 0:
            return json.loads(raw_output[start:end])
    except:
        pass

    return {"error": "Could not parse quiz from model output", "raw_output": raw_output[:300]}


# =========================
# 🔹 MIND MAP FUNCTION
# =========================
def generate_mindmap(context: str):
    context = context[:2000]

    prompt = f"""Analyze this text and create a mind map structure. Return ONLY a JSON object, no extra text.

Text:
{context}

JSON format:
{{"label": "Main Topic", "children": [{{"label": "Subtopic 1", "children": [{{"label": "Detail 1"}}, {{"label": "Detail 2"}}]}}, {{"label": "Subtopic 2", "children": [{{"label": "Detail 3"}}]}}]}}"""

    raw_output = _call_llm(prompt, max_tokens=400, temperature=0.3)

    try:
        return json.loads(raw_output)
    except json.JSONDecodeError:
        try:
            start = raw_output.find("{")
            end = raw_output.rfind("}") + 1
            cleaned = raw_output[start:end]
            return json.loads(cleaned)
        except:
            return {
                "error": "Invalid JSON from model",
                "raw_output": raw_output
            }


# =========================
# 🔹 REPORT FUNCTION
# =========================
def generate_report(context: str) -> str:
    context = context[:2000]

    prompt = f"""You are a document analyst. Write a detailed report based on the text below.

Structure your report with these sections:
# Overview
Brief overview of the document.

# Key Findings
List the main points and findings.

# Detailed Analysis
Analyze the important aspects in detail.

# Conclusion
Summarize the key takeaways.

Text:
{context}

Report:"""

    return _call_llm(prompt, max_tokens=600, temperature=0.4)


# =========================
# 🔹 RAG CHAT FUNCTION (GROQ → OLLAMA FALLBACK)
# =========================
def generate_chat_response(question: str, context: str, chat_history: list = None) -> str:
    context = context[:2000]

    # Build system prompt with strict RAG rules
    system_prompt = f"""You are a helpful assistant for a notebook application. You MUST answer questions ONLY based on the document context provided below.

STRICT RULES:
1. ONLY use information from the DOCUMENT CONTEXT below to answer.
2. If the answer is NOT found in the document context, respond EXACTLY with: "I couldn't find information about that in your document. Try asking something related to your uploaded content."
3. Do NOT use any outside knowledge or make up information.
4. Keep answers concise and helpful (2-4 sentences).
5. If the user greets you, respond briefly and remind them to ask about their document.

DOCUMENT CONTEXT:
{context}"""

    # Build messages array (OpenAI-compatible format for Groq)
    messages = [{"role": "system", "content": system_prompt}]

    # Add chat history for conversational context
    if chat_history:
        for msg in chat_history[-4:]:
            messages.append({
                "role": msg.get("role", "user"),
                "content": msg.get("content", "")
            })

    # Add current question
    messages.append({"role": "user", "content": question})

    # Try Groq first (supports chat messages format)
    if GROQ_API_KEY:
        try:
            print("🚀 Chat: Using Groq API...")
            response = requests.post(
                GROQ_URL,
                headers={
                    "Authorization": f"Bearer {GROQ_API_KEY}",
                    "Content-Type": "application/json"
                },
                json={
                    "model": GROQ_MODEL,
                    "messages": messages,
                    "temperature": 0.3,
                    "max_tokens": 300,
                    "top_p": 0.9,
                },
                timeout=30
            )
            response.raise_for_status()
            data = response.json()
            return data["choices"][0]["message"]["content"].strip()

        except Exception as e:
            print(f"⚠️ Groq failed for chat: {e} — Falling back to Ollama...")

    # Fallback: Ollama (flatten messages into single prompt)
    print("🐢 Chat: Using Ollama/Mistral (local)...")
    history_text = ""
    if chat_history:
        for msg in chat_history[-4:]:
            role = "User" if msg.get("role") == "user" else "Assistant"
            history_text += f"{role}: {msg.get('content', '')}\n"

    prompt = f"""{system_prompt}

{f"RECENT CONVERSATION:{chr(10)}{history_text}" if history_text else ""}

USER QUESTION: {question}

ANSWER:"""

    return _call_ollama(prompt, max_tokens=300, temperature=0.3)