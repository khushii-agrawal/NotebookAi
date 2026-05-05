# NoteBar: AI-Assisted Note-Taking System 🧠📝

Welcome to the **NoteBar** repository! This project is an advanced, full-stack AI-assisted digital note-taking platform designed to address the inefficiencies of traditional note-taking. It leverages Retrieval-Augmented Generation (RAG), multi-label classification, and vector embeddings to intelligently organize, retrieve, and enhance user notes.

---

## 🌟 Key Features

*   **Smart Note Organization:** Uses multi-label classification to automatically categorize notes.
*   **Contextual Chatbot:** A RAG-powered AI assistant that answers questions based *strictly* on your uploaded documents and notes.
*   **Automated Quizzes & Flashcards:** Instantly generates study materials (flashcards and quizzes) from your notes to aid active recall.
*   **Mind Map Generation:** Visualizes the relationships between concepts in your notes.
*   **User-in-the-loop Feedback:** Allows users to refine AI suggestions to continuously improve the system.

---

## 🛠️ Technology Stack

### Frontend (`/notepad`)
*   **Framework:** React (Vite) with TypeScript
*   **Styling:** TailwindCSS
*   **UI Components:** Custom components for Flashcards, Mindmaps, Quiz, and Chat interfaces.

### Backend (`/backend`)
*   **Framework:** FastAPI (Python)
*   **Database:** MongoDB (User authentication, note storage)
*   **Vector Database:** ChromaDB (Semantic storage of document embeddings)
*   **LLM Provider:** Groq (`llama-3.1-8b-instant`) for ultra-fast generation
*   **Embeddings:** HuggingFace `sentence-transformers`

---

## 📊 RAG Architecture & Evaluation Analysis

A significant part of this project involves evaluating the most efficient embedding models and chunking strategies to power the Retrieval-Augmented Generation (RAG) pipeline. Below is our comprehensive analysis based on our custom Evaluation Suite.

### 1. Embedding Model Comparison

We benchmarked multiple models on a custom persona-conditioned dataset using a fixed chunk size of 500 characters.

| Model | Parameters | Hit Rate | Faithfulness (Groq) | Avg Latency (ms/query) |
| :--- | :---: | :---: | :---: | :---: |
| **BGE-small-en-v1.5** *(Current Baseline)* | 33M | **0.47** | **0.73** | **25.0 ms** |
| **BGE-base-en-v1.5** | 109M | 0.47 | 0.67 | 70.5 ms |
| **MiniLM-L6 (BERT)** | 22M | **0.50** | 0.49 | 39.7 ms |
| **DistilBERT-MSMARCO** | 66M | 0.47 | 0.41 | 29.8 ms |

**Analysis:**
*   **Best Overall:** `BGE-small` is the clear winner for our specific use case. Despite having only 33M parameters, it achieved the highest faithfulness score (**73%**) while maintaining the lowest latency (**25ms**). 
*   **Diminishing Returns:** Scaling up to `BGE-base` (109M params) did not improve the hit rate and actually resulted in slightly lower faithfulness (67%), while nearly tripling the latency. 
*   **Hit Rate vs. Context Quality:** While `MiniLM-L6` retrieved the keywords slightly more often (Hit Rate: 0.50), the actual semantic context retrieved resulted in poor generative answers from the LLM (Faithfulness: 49%).

### 2. Chunking Strategy Evaluation

Using our baseline embedding model (`BGE-small`), we evaluated how different document parsing strategies affect retrieval accuracy.

| Strategy | Logic | Hit Rate | Faithfulness | Processing Speed |
| :--- | :--- | :---: | :---: | :--- |
| **Fixed-Character** *(Baseline)* | 500 chars, 50 overlap | 0.47 | **0.73** | Fast |
| **Paragraph** | Split by `\n\n` | **0.52** | 0.28 | Very Fast (~0.6ms) |
| **Sentence-Aware** | NLTK sentence boundary | 0.41 | 0.58 | Slow (~725ms) |

**Analysis:**
*   **The Paragraph Trap:** Splitting by raw paragraphs yielded the highest raw keyword hit rate (**0.52**), but completely destroyed the contextual faithfulness (**0.28**). This happens because paragraphs are often too short or lack surrounding context, confusing the LLM during generation.
*   **Fixed-Character is Optimal:** The standard 500-character window with a 50-character overlap strikes the perfect balance. It provides enough context for the LLM to generate highly faithful answers (0.73) without introducing excessive computational overhead.
*   **Sentence-Aware:** Using NLTK to strictly respect sentence boundaries introduced massive processing latency (over 700ms per chunking operation) while actually reducing the hit rate and faithfulness compared to fixed characters.

---

## 🚀 Getting Started

### Prerequisites
*   Node.js & npm
*   Python 3.10+
*   MongoDB installed and running locally on `port 27017`

### Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/notebar.git
    cd notebar
    ```

2.  **Start the Backend:**
    ```bash
    cd backend
    python -m venv venv
    venv\Scripts\activate  # Windows
    pip install -r requirements.txt
    # Ensure your .env file is configured with GROQ_API_KEY
    uvicorn app.main:app --reload
    ```

3.  **Start the Frontend:**
    ```bash
    cd notepad
    npm install
    npm run dev
    ```

4.  **Run the RAG Evaluation Suite:**
    ```bash
    cd backend
    python -m evaluation.main --mode all
    ```

---
*NoteBar: Bridging the gap between raw information and true knowledge.*
