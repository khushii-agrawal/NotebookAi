import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, ChevronLeft, ChevronRight, RotateCcw, Sparkles, Loader2 } from "lucide-react";

type Flashcard = {
  question: string;
  answer: string;
};

const FlashcardPage = () => {
  const { notebookId } = useParams();
  const navigate = useNavigate();

  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mastered, setMastered] = useState<Set<number>>(new Set());

  // ========================
  // 🔹 FETCH FLASHCARDS
  // ========================
  useEffect(() => {
    if (!notebookId) return;

    const fetchFlashcards = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch("http://127.0.0.1:8000/flashcards/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ notebook_id: notebookId }),
        });

        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.detail || "Failed to generate flashcards");
        }

        const data = await res.json();

        if (data.flashcards?.error) {
          throw new Error(data.flashcards.error);
        }

        if (Array.isArray(data.flashcards) && data.flashcards.length > 0) {
          setFlashcards(data.flashcards);
        } else {
          throw new Error("No flashcards were generated. Try uploading a more detailed document.");
        }
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchFlashcards();
  }, [notebookId]);

  // ========================
  // 🔹 KEYBOARD NAVIGATION
  // ========================
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        setIsFlipped((f) => !f);
      }
    },
    [flashcards.length, currentIndex]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  // ========================
  // 🔹 NAVIGATION
  // ========================
  const goNext = () => {
    if (currentIndex < flashcards.length - 1) {
      setIsFlipped(false);
      setTimeout(() => setCurrentIndex((i) => i + 1), 150);
    }
  };

  const goPrev = () => {
    if (currentIndex > 0) {
      setIsFlipped(false);
      setTimeout(() => setCurrentIndex((i) => i - 1), 150);
    }
  };

  const toggleMastered = () => {
    setMastered((prev) => {
      const next = new Set(prev);
      if (next.has(currentIndex)) {
        next.delete(currentIndex);
      } else {
        next.add(currentIndex);
      }
      return next;
    });
  };

  const resetProgress = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setMastered(new Set());
  };

  const progress = flashcards.length > 0
    ? ((currentIndex + 1) / flashcards.length) * 100
    : 0;

  // ========================
  // 🔹 LOADING STATE
  // ========================
  if (loading) {
    return (
      <div className="min-h-[calc(100vh-56px)] bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 flex items-center justify-center">
        <div className="text-center space-y-6">
          {/* Animated AI Orb */}
          <div className="relative w-24 h-24 mx-auto">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 animate-spin opacity-30 blur-md"></div>
            <div className="absolute inset-2 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 animate-pulse flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-white animate-bounce" />
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-white">
              Generating Flashcards
            </h2>
            <p className="text-purple-300/80 text-sm max-w-sm mx-auto">
              AI is analyzing your document and creating smart flashcards...
            </p>
          </div>

          {/* Skeleton Cards */}
          <div className="flex gap-3 justify-center mt-8">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-20 h-28 rounded-xl bg-white/5 border border-white/10 animate-pulse"
                style={{ animationDelay: `${i * 200}ms` }}
              />
            ))}
          </div>

          <div className="flex items-center justify-center gap-2 text-purple-400 text-sm">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>This may take 30-60 seconds...</span>
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
      <div className="min-h-[calc(100vh-56px)] bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 flex items-center justify-center">
        <div className="text-center space-y-6 max-w-md">
          <div className="w-20 h-20 mx-auto bg-red-500/20 rounded-full flex items-center justify-center">
            <span className="text-4xl">⚠️</span>
          </div>
          <h2 className="text-2xl font-bold text-white">Generation Failed</h2>
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
              className="px-5 py-2.5 rounded-xl bg-purple-600 text-white hover:bg-purple-700 transition-all text-sm font-medium"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  const card = flashcards[currentIndex];

  // ========================
  // 🔹 MAIN UI
  // ========================
  return (
    <div className="min-h-[calc(100vh-56px)] bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 relative overflow-hidden">
      {/* Background Glow Effects */}
      <div className="absolute top-20 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-8">
        {/* ===== HEADER ===== */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate(`/notebooks/${notebookId}`)}
            className="flex items-center gap-2 text-purple-300 hover:text-white transition-colors text-sm font-medium group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Notebook
          </button>

          <div className="flex items-center gap-3">
            <span className="text-xs text-purple-400 bg-purple-500/10 px-3 py-1.5 rounded-full border border-purple-500/20">
              {mastered.size} / {flashcards.length} mastered
            </span>
            <button
              onClick={resetProgress}
              className="p-2 rounded-lg hover:bg-white/10 text-purple-300 hover:text-white transition-all"
              title="Reset progress"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ===== PROGRESS BAR ===== */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-purple-400 font-medium">
              Card {currentIndex + 1} of {flashcards.length}
            </span>
            <span className="text-xs text-purple-400">
              {Math.round(progress)}% complete
            </span>
          </div>
          <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* ===== FLASHCARD ===== */}
        <div className="flex justify-center mb-10">
          <div
            className="w-full max-w-2xl cursor-pointer"
            style={{ perspective: "1200px" }}
            onClick={() => setIsFlipped(!isFlipped)}
          >
            <div
              className="relative w-full transition-transform duration-700 ease-in-out"
              style={{
                transformStyle: "preserve-3d",
                transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
                minHeight: "320px",
              }}
            >
              {/* FRONT — Question */}
              <div
                className="absolute inset-0 rounded-3xl p-8 flex flex-col items-center justify-center text-center"
                style={{
                  backfaceVisibility: "hidden",
                  WebkitBackfaceVisibility: "hidden",
                  background: "linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(99, 102, 241, 0.1) 100%)",
                  border: "1px solid rgba(139, 92, 246, 0.25)",
                  backdropFilter: "blur(20px)",
                  boxShadow: "0 25px 60px -12px rgba(139, 92, 246, 0.15), inset 0 1px 0 rgba(255,255,255,0.1)",
                }}
              >
                <div className="absolute top-5 left-6">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-purple-400/60">
                    Question
                  </span>
                </div>

                {mastered.has(currentIndex) && (
                  <div className="absolute top-4 right-5">
                    <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full border border-green-500/30">
                      ✓ Mastered
                    </span>
                  </div>
                )}

                <Sparkles className="w-6 h-6 text-purple-400/50 mb-4" />
                <p className="text-xl md:text-2xl font-semibold text-white leading-relaxed max-w-lg">
                  {card?.question}
                </p>
                <p className="text-xs text-purple-400/50 mt-6">
                  Click or press Space to reveal answer
                </p>
              </div>

              {/* BACK — Answer */}
              <div
                className="absolute inset-0 rounded-3xl p-8 flex flex-col items-center justify-center text-center"
                style={{
                  backfaceVisibility: "hidden",
                  WebkitBackfaceVisibility: "hidden",
                  transform: "rotateY(180deg)",
                  background: "linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(59, 130, 246, 0.08) 100%)",
                  border: "1px solid rgba(16, 185, 129, 0.25)",
                  backdropFilter: "blur(20px)",
                  boxShadow: "0 25px 60px -12px rgba(16, 185, 129, 0.12), inset 0 1px 0 rgba(255,255,255,0.1)",
                }}
              >
                <div className="absolute top-5 left-6">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400/60">
                    Answer
                  </span>
                </div>

                <p className="text-lg md:text-xl text-emerald-50 leading-relaxed max-w-lg">
                  {card?.answer}
                </p>
                <p className="text-xs text-emerald-400/50 mt-6">
                  Click to see question again
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ===== CONTROLS ===== */}
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={goPrev}
            disabled={currentIndex === 0}
            className={`p-3 rounded-2xl border transition-all duration-200 ${currentIndex === 0
                ? "border-white/5 text-white/20 cursor-not-allowed"
                : "border-white/10 text-white hover:bg-white/10 hover:border-purple-500/30 hover:shadow-lg hover:shadow-purple-500/10"
              }`}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            onClick={toggleMastered}
            className={`px-6 py-3 rounded-2xl text-sm font-medium transition-all duration-200 ${mastered.has(currentIndex)
                ? "bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/30"
                : "bg-white/5 text-purple-300 border border-white/10 hover:bg-white/10 hover:text-white"
              }`}
          >
            {mastered.has(currentIndex) ? "✓ Mastered" : "Mark as Mastered"}
          </button>

          <button
            onClick={goNext}
            disabled={currentIndex === flashcards.length - 1}
            className={`p-3 rounded-2xl border transition-all duration-200 ${currentIndex === flashcards.length - 1
                ? "border-white/5 text-white/20 cursor-not-allowed"
                : "border-white/10 text-white hover:bg-white/10 hover:border-purple-500/30 hover:shadow-lg hover:shadow-purple-500/10"
              }`}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* ===== CARD DOTS ===== */}
        <div className="flex justify-center gap-2 mt-8">
          {flashcards.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setIsFlipped(false);
                setTimeout(() => setCurrentIndex(i), 150);
              }}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${i === currentIndex
                  ? "bg-purple-400 scale-125 shadow-lg shadow-purple-500/30"
                  : mastered.has(i)
                    ? "bg-green-500/60 hover:bg-green-400"
                    : "bg-white/15 hover:bg-white/30"
                }`}
            />
          ))}
        </div>

        {/* ===== KEYBOARD HINTS ===== */}
        <div className="flex justify-center gap-6 mt-8 text-[11px] text-purple-500/40">
          <span>← → Navigate</span>
          <span>Space — Flip</span>
          <span>Enter — Flip</span>
        </div>
      </div>
    </div>
  );
};

export default FlashcardPage;
