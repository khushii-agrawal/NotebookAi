import argparse
import json
from .experiments import run_embedding_eval, run_ensemble_eval
from .visualizer import generate_metrics_chart, generate_latency_plot
from .config import RESULTS_DIR, EMBEDDING_MODELS

def main():
    parser = argparse.ArgumentParser(description="RAG Evaluation Suite")
    parser.add_argument("--mode", choices=["embeddings", "ensemble", "chunking", "all"], default="all")
    parser.add_argument("--model", type=str, default=None,
                        help="Test a single model/ensemble/strategy by name, e.g. 'BGE-small (current)'")
    parser.add_argument("--list-models", action="store_true", help="List available model names")
    parser.add_argument("--list-ensembles", action="store_true", help="List available ensemble names")
    parser.add_argument("--list-strategies", action="store_true", help="List available chunking strategies")
    args = parser.parse_args()

    if args.list_models:
        print("Available models:")
        for name in EMBEDDING_MODELS:
            print(f"  - {name}")
        return

    if args.list_ensembles:
        from .config import ENSEMBLE_PAIRS
        print("Available ensembles:")
        for pair in ENSEMBLE_PAIRS:
            print(f"  - '{pair['name']}'")
        return

    if args.list_strategies:
        from .strategies import CHUNKING_STRATEGIES
        print("Available chunking strategies:")
        for name in CHUNKING_STRATEGIES:
            print(f"  - {name}")
        return

    results = {}
    if args.mode in ["embeddings", "all"]:
        emb_results = run_embedding_eval(single_model=args.model)
        results["embeddings"] = emb_results
        generate_metrics_chart(emb_results)
        generate_latency_plot(emb_results)
        print("\nEmbedding results complete. Charts saved.")

    if args.mode in ["ensemble", "all"]:
        ens_results = run_ensemble_eval(single_ensemble=args.model)
        results["ensemble"] = ens_results
        print("\nEnsemble results complete.")

    if args.mode in ["chunking", "all"]:
        from .experiments import run_chunking_eval
        chunk_results = run_chunking_eval(single_strategy=args.model)
        results["chunking"] = chunk_results
        print("\nChunking results complete.")

    # Merge with existing results (so single-model runs accumulate)
    results_file = RESULTS_DIR / "final_results.json"
    if results_file.exists():
        with open(results_file, "r") as f:
            try:
                existing = json.load(f)
            except json.JSONDecodeError:
                existing = {}
        for key in results:
            if key in existing and isinstance(existing[key], dict):
                existing[key].update(results[key])
            else:
                existing[key] = results[key]
        results = existing

    with open(results_file, "w") as f:
        json.dump(results, f, indent=4)
    
    print(f"\nAll evaluations finished. Data saved in {RESULTS_DIR}")

if __name__ == "__main__":
    main()
