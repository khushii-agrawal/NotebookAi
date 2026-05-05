import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2, Sparkles, RotateCcw } from "lucide-react";
import mermaid from "mermaid";

type MindMapNode = {
  label: string;
  children?: MindMapNode[];
};

// ========================
// 🔹 CONVERT JSON TREE → MERMAID FLOWCHART LR
// ========================
function jsonToMermaid(node: MindMapNode): string {
  let idCounter = 0;
  const lines: string[] = ["flowchart LR"];
  const nodeIds = new Map<string, string>();

  function sanitize(text: string): string {
    return text
      .replace(/["\[\](){}#&;]/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 30);
  }

  function traverse(n: MindMapNode, parentId: string | null, depth: number) {
    const id = `N${idCounter++}`;
    const label = sanitize(n.label);
    nodeIds.set(id, label);

    // Root node style
    if (depth === 0) {
      lines.push(`    ${id}(("${label}"))`);
    } else if (depth === 1) {
      lines.push(`    ${id}["${label}"]`);
    } else {
      lines.push(`    ${id}("${label}")`);
    }

    if (parentId) {
      lines.push(`    ${parentId} --> ${id}`);
    }

    if (n.children) {
      n.children.forEach((child) => traverse(child, id, depth + 1));
    }
  }

  traverse(node, null, 0);
  return lines.join("\n");
}

// ========================
// 🔹 MERMAID THEME CONFIG
// ========================
mermaid.initialize({
  startOnLoad: false,
  theme: "dark",
  flowchart: {
    curve: "basis",
    padding: 20,
    nodeSpacing: 40,
    rankSpacing: 80,
    htmlLabels: true,
    useMaxWidth: false,
  },
  themeVariables: {
    primaryColor: "#7c3aed",
    primaryTextColor: "#ffffff",
    primaryBorderColor: "#8b5cf6",
    lineColor: "#6366f1",
    secondaryColor: "#1e1b4b",
    tertiaryColor: "#0f172a",
    fontFamily: "system-ui, -apple-system, sans-serif",
    fontSize: "14px",
    nodeBorder: "#8b5cf6",
    clusterBkg: "#1e1b4b",
    edgeLabelBackground: "transparent",
  },
});

const MindMapPage = () => {
  const { notebookId } = useParams();
  const navigate = useNavigate();
  const mermaidRef = useRef<HTMLDivElement>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mermaidCode, setMermaidCode] = useState<string>("");
  const [rendered, setRendered] = useState(false);

  // ========================
  // 🔹 FETCH MIND MAP
  // ========================
  useEffect(() => {
    if (!notebookId) return;

    const fetchMindMap = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch("http://127.0.0.1:8000/mindmap/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ notebook_id: notebookId }),
        });

        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.detail || "Failed to generate mind map");
        }

        const data = await res.json();

        if (data.mindmap?.error) {
          throw new Error(data.mindmap.error);
        }

        if (data.mindmap?.label) {
          const code = jsonToMermaid(data.mindmap);
          setMermaidCode(code);
        } else {
          throw new Error("Invalid mind map data received.");
        }
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchMindMap();
  }, [notebookId]);

  // ========================
  // 🔹 RENDER MERMAID
  // ========================
  useEffect(() => {
    if (!mermaidCode || !mermaidRef.current) return;

    const renderChart = async () => {
      try {
        mermaidRef.current!.innerHTML = "";
        const { svg } = await mermaid.render("mindmap-svg", mermaidCode);
        mermaidRef.current!.innerHTML = svg;
        setRendered(true);

        // Style the rendered SVG
        const svgEl = mermaidRef.current!.querySelector("svg");
        if (svgEl) {
          svgEl.style.maxWidth = "100%";
          svgEl.style.height = "auto";
          svgEl.style.minHeight = "400px";
        }
      } catch (err: any) {
        console.error("Mermaid render error:", err);
        setError("Failed to render mind map visualization.");
      }
    };

    renderChart();
  }, [mermaidCode]);

  // ========================
  // 🔹 LOADING STATE
  // ========================
  if (loading) {
    return (
      <div className="min-h-[calc(100vh-56px)] bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 flex flex-col">
        {/* Back Button */}
        <div className="px-6 py-4">
          <button
            onClick={() => navigate(`/notebooks/${notebookId}`)}
            className="flex items-center gap-2 text-emerald-300 hover:text-white transition-colors text-sm font-medium group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Notebook
          </button>
        </div>

        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-6">
            <div className="relative w-24 h-24 mx-auto">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 animate-spin opacity-30 blur-md"></div>
              <div className="absolute inset-2 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 animate-pulse flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-white animate-bounce" />
              </div>
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-white">Generating Mind Map</h2>
              <p className="text-emerald-300/80 text-sm max-w-sm mx-auto">
                AI is analyzing your document and building a topic tree...
              </p>
            </div>
            <div className="flex items-center justify-center gap-2 text-emerald-400 text-sm">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>This may take 30-60 seconds...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ========================
  // 🔹 ERROR STATE
  // ========================
  if (error) {
    return (
      <div className="min-h-[calc(100vh-56px)] bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 flex items-center justify-center">
        <div className="text-center space-y-6 max-w-md">
          <div className="w-20 h-20 mx-auto bg-red-500/20 rounded-full flex items-center justify-center">
            <span className="text-4xl">⚠️</span>
          </div>
          <h2 className="text-2xl font-bold text-white">Mind Map Failed</h2>
          <p className="text-red-300/80 text-sm">{error}</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => navigate(-1)}
              className="px-5 py-2.5 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-all text-sm font-medium"
            >
              ← Go Back
            </button>
            <button
              onClick={() => window.location.reload()}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 transition-all text-sm font-medium"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ========================
  // 🔹 MAIN UI
  // ========================
  return (
    <div className="min-h-[calc(100vh-56px)] bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 relative overflow-hidden flex flex-col">
      {/* Background Glow */}
      <div className="absolute top-20 left-1/4 w-96 h-96 bg-emerald-600/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-teal-600/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 z-10 relative">
        <button
          onClick={() => navigate(`/notebooks/${notebookId}`)}
          className="flex items-center gap-2 text-emerald-300 hover:text-white transition-colors text-sm font-medium group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Notebook
        </button>

        <div className="flex items-center gap-3">
          <h1 className="text-lg font-semibold text-white">🧩 Mind Map</h1>
        </div>

        <button
          onClick={() => window.location.reload()}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-emerald-300 hover:bg-white/10 hover:text-white transition-all text-sm font-medium"
        >
          <RotateCcw className="w-4 h-4" />
          Regenerate
        </button>
      </div>

      {/* Mermaid Chart */}
      <div className="flex-1 overflow-auto flex items-center justify-center p-6 relative z-10">
        <div
          className="w-full max-w-6xl rounded-3xl p-8 transition-opacity duration-500"
          style={{
            background: "linear-gradient(135deg, rgba(16, 185, 129, 0.05) 0%, rgba(99, 102, 241, 0.05) 100%)",
            border: "1px solid rgba(16, 185, 129, 0.15)",
            backdropFilter: "blur(10px)",
            opacity: rendered ? 1 : 0.5,
          }}
        >
          <div
            ref={mermaidRef}
            className="mermaid-container w-full overflow-x-auto flex justify-center"
          />
        </div>
      </div>

      {/* Footer */}
      <div className="text-center py-3 text-[11px] text-emerald-500/40 relative z-10">
        Horizontal layout • Scroll to explore • Click Regenerate for a new map
      </div>
    </div>
  );
};

export default MindMapPage;
