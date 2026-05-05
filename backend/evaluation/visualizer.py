import matplotlib.pyplot as plt
import numpy as np
from .config import RESULTS_DIR

def generate_metrics_chart(results, filename="chart_metrics.png"):
    plt.switch_backend('Agg')
    models = list(results.keys())
    names = [m.split(" (")[0] for m in models]
    
    x = np.arange(len(models))
    plt.figure(figsize=(12, 6))
    plt.bar(x - 0.2, [results[m]["hit_rate"] for m in models], 0.2, label='Hit Rate')
    plt.bar(x, [results[m]["faithfulness"] for m in models], 0.2, label='Faithfulness')
    plt.xticks(x, names, rotation=15)
    plt.legend()
    plt.savefig(RESULTS_DIR / filename)
    plt.close()

def generate_latency_plot(results):
    plt.switch_backend('Agg')
    models = list(results.keys())
    latencies = [results[m]["embed_latency_ms"] for m in models]
    scores = [results[m]["faithfulness"] for m in models]
    
    plt.figure(figsize=(10, 6))
    plt.scatter(latencies, scores)
    for i, txt in enumerate(models):
        plt.annotate(txt.split(" ")[0], (latencies[i], scores[i]))
    plt.savefig(RESULTS_DIR / "latency_vs_accuracy.png")
    plt.close()
