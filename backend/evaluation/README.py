# =============================================================
#  RAG EVALUATION SUITE — MODULAR VERSION
# =============================================================
#
#  This folder contains a refactored, modular evaluation suite 
#  designed for research-grade benchmarking of RAG pipelines.
#
#  FILE STRUCTURE:
#  - main.py        : Entry point & CLI handler.
#  - config.py      : Global settings, model lists, and paths.
#  - metrics.py     : Math formulas (RRF, Hit Rate, Similarity).
#  - strategies.py  : Text chunking algorithms.
#  - helpers.py     : Document loading and API callers.
#  - visualizer.py  : Logic for generating charts and plots.
#  - experiments.py : Core logic for RAG/Embedding tests.
#
#  STEP 1: SETUP DOCUMENTS
#  Place your test PDFs in: backend/evaluation/documents/
#
#  STEP 2: PREPARE DATASET
#  Edit 'ground_truth.json' with your 30+ question-answer pairs.
#
#  STEP 3: RUN EVALUATION
#  Open your terminal in the 'backend' directory and run:
#
#  # To run everything:
#  python -m evaluation.main --mode all
#
#  # To run specific experiments:
#  python -m evaluation.main --mode embeddings
#  python -m evaluation.main --mode ensemble
#
#  STEP 4: ANALYZE RESULTS
#  Check 'backend/evaluation/results/' for:
#  - final_results.json    : Raw data for all tests.
#  - chart_metrics.png     : Bar chart for your paper.
#  - latency_vs_accuracy.png : Scatter plot for performance analysis.
#
# =============================================================
