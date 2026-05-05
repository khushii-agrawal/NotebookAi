import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2, Sparkles, Download, RotateCcw } from "lucide-react";

const ReportPage = () => {
  const { notebookId } = useParams();
  const navigate = useNavigate();

  const [report, setReport] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!notebookId) return;

    const fetchReport = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch("http://127.0.0.1:8000/report/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ notebook_id: notebookId }),
        });

        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.detail || "Failed to generate report");
        }

        const data = await res.json();
        setReport(data.report || "No report content generated.");
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [notebookId]);

  // Simple markdown-like renderer
  const renderMarkdown = (text: string) => {
    const lines = text.split("\n");
    return lines.map((line, i) => {
      const trimmed = line.trim();
      if (trimmed.startsWith("# ")) {
        return (
          <h2 key={i} className="text-xl font-bold text-white mt-6 mb-3 flex items-center gap-2">
            <span className="w-1 h-6 bg-gradient-to-b from-amber-400 to-orange-500 rounded-full"></span>
            {trimmed.slice(2)}
          </h2>
        );
      }
      if (trimmed.startsWith("## ")) {
        return (
          <h3 key={i} className="text-lg font-semibold text-white/90 mt-4 mb-2">
            {trimmed.slice(3)}
          </h3>
        );
      }
      if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
        return (
          <li key={i} className="text-white/70 text-sm ml-4 mb-1 list-disc">
            {trimmed.slice(2)}
          </li>
        );
      }
      if (trimmed.length === 0) {
        return <div key={i} className="h-2" />;
      }
      return (
        <p key={i} className="text-white/70 text-sm leading-relaxed mb-2">
          {trimmed}
        </p>
      );
    });
  };

  const downloadReport = () => {
    const blob = new Blob([report], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "report.md";
    a.click();
    URL.revokeObjectURL(url);
  };

  // ========================
  // 🔹 LOADING STATE
  // ========================
  if (loading) {
    return (
      <div className="min-h-[calc(100vh-56px)] bg-gradient-to-br from-slate-900 via-amber-950/30 to-slate-900 flex flex-col">
        <div className="px-6 py-4">
          <button
            onClick={() => navigate(`/notebooks/${notebookId}`)}
            className="flex items-center gap-2 text-amber-300 hover:text-white transition-colors text-sm font-medium group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Notebook
          </button>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-6">
            <div className="relative w-24 h-24 mx-auto">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 animate-spin opacity-30 blur-md"></div>
              <div className="absolute inset-2 rounded-full bg-gradient-to-r from-amber-600 to-orange-600 animate-pulse flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-white animate-bounce" />
              </div>
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-white">Generating Report</h2>
              <p className="text-amber-300/80 text-sm max-w-sm mx-auto">
                AI is analyzing your document and writing a detailed report...
              </p>
            </div>
            <div className="flex items-center justify-center gap-2 text-amber-400 text-sm">
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
      <div className="min-h-[calc(100vh-56px)] bg-gradient-to-br from-slate-900 via-amber-950/30 to-slate-900 flex items-center justify-center">
        <div className="text-center space-y-6 max-w-md">
          <div className="w-20 h-20 mx-auto bg-red-500/20 rounded-full flex items-center justify-center">
            <span className="text-4xl">⚠️</span>
          </div>
          <h2 className="text-2xl font-bold text-white">Report Generation Failed</h2>
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
              className="px-5 py-2.5 rounded-xl bg-amber-600 text-white hover:bg-amber-700 transition-all text-sm font-medium"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ========================
  // 🔹 REPORT UI
  // ========================
  return (
    <div className="min-h-[calc(100vh-56px)] bg-gradient-to-br from-slate-900 via-amber-950/30 to-slate-900 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-20 left-1/4 w-96 h-96 bg-amber-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate(`/notebooks/${notebookId}`)}
            className="flex items-center gap-2 text-amber-300 hover:text-white transition-colors text-sm font-medium group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Notebook
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={downloadReport}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-amber-300 hover:bg-white/10 hover:text-white transition-all text-sm font-medium"
            >
              <Download className="w-4 h-4" />
              Download
            </button>
            <button
              onClick={() => window.location.reload()}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-600 text-white hover:bg-amber-700 transition-all text-sm font-medium"
            >
              <RotateCcw className="w-4 h-4" />
              Regenerate
            </button>
          </div>
        </div>

        {/* Report Title */}
        <div className="flex items-center gap-3 mb-6">
          <span className="text-3xl">📚</span>
          <h1 className="text-2xl font-bold text-white">Document Report</h1>
        </div>

        {/* Report Content */}
        <div
          className="rounded-3xl p-8"
          style={{
            background: "linear-gradient(135deg, rgba(245, 158, 11, 0.06) 0%, rgba(99, 102, 241, 0.04) 100%)",
            border: "1px solid rgba(245, 158, 11, 0.15)",
            backdropFilter: "blur(10px)",
          }}
        >
          {renderMarkdown(report)}
        </div>
      </div>
    </div>
  );
};

export default ReportPage;
