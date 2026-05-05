import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2, Sparkles, CheckCircle2, XCircle, Trophy, RotateCcw, ChevronRight } from "lucide-react";

type QuizOption = {
  id: string;
  text: string;
};

type QuizQuestion = {
  id: string;
  question: string;
  options: QuizOption[];
  correctOptionId: string;
};

const QuizPage = () => {
  const { notebookId } = useParams();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [answeredQuestions, setAnsweredQuestions] = useState<Set<number>>(new Set());

  // ========================
  // 🔹 FETCH QUIZ
  // ========================
  useEffect(() => {
    if (!notebookId) return;

    const fetchQuiz = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch("http://127.0.0.1:8000/quiz/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ notebook_id: notebookId }),
        });

        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.detail || "Failed to generate quiz");
        }

        const data = await res.json();

        if (data.questions?.error) {
          throw new Error(data.questions.error);
        }

        if (Array.isArray(data.questions) && data.questions.length > 0) {
          setQuestions(data.questions);
        } else {
          throw new Error("No quiz questions generated. Try a more detailed document.");
        }
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [notebookId]);

  // ========================
  // 🔹 HANDLERS
  // ========================
  const handleSelectAnswer = (optionId: string) => {
    if (isAnswered) return;

    setSelectedAnswer(optionId);
    setIsAnswered(true);
    setAnsweredQuestions((prev) => new Set(prev).add(currentIndex));

    if (optionId === questions[currentIndex].correctOptionId) {
      setScore((s) => s + 1);
    }
  };

  const goNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((i) => i + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } else {
      setShowResults(true);
    }
  };

  const resetQuiz = () => {
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setScore(0);
    setShowResults(false);
    setAnsweredQuestions(new Set());
  };

  const progress = questions.length > 0
    ? ((currentIndex + 1) / questions.length) * 100
    : 0;

  // ========================
  // 🔹 LOADING STATE
  // ========================
  if (loading) {
    return (
      <div className="min-h-[calc(100vh-56px)] bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="relative w-24 h-24 mx-auto">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-500 to-cyan-500 animate-spin opacity-30 blur-md"></div>
            <div className="absolute inset-2 rounded-full bg-gradient-to-r from-indigo-600 to-blue-600 animate-pulse flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-white animate-bounce" />
            </div>
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-white">Generating Quiz</h2>
            <p className="text-indigo-300/80 text-sm max-w-sm mx-auto">
              AI is analyzing your document and creating quiz questions...
            </p>
          </div>
          <div className="flex gap-3 justify-center mt-8">
            {[0, 1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="w-16 h-20 rounded-xl bg-white/5 border border-white/10 animate-pulse"
                style={{ animationDelay: `${i * 150}ms` }}
              />
            ))}
          </div>
          <div className="flex items-center justify-center gap-2 text-indigo-400 text-sm">
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
      <div className="min-h-[calc(100vh-56px)] bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 flex items-center justify-center">
        <div className="text-center space-y-6 max-w-md">
          <div className="w-20 h-20 mx-auto bg-red-500/20 rounded-full flex items-center justify-center">
            <span className="text-4xl">⚠️</span>
          </div>
          <h2 className="text-2xl font-bold text-white">Quiz Generation Failed</h2>
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
              className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition-all text-sm font-medium"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ========================
  // 🔹 RESULTS SCREEN
  // ========================
  if (showResults) {
    const percentage = Math.round((score / questions.length) * 100);
    const emoji = percentage >= 80 ? "🏆" : percentage >= 50 ? "👍" : "📚";

    return (
      <div className="min-h-[calc(100vh-56px)] bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 flex items-center justify-center">
        <div className="text-center space-y-8 max-w-md">
          <div className="text-7xl">{emoji}</div>
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">Quiz Complete!</h2>
            <p className="text-indigo-300/80">Here's how you did</p>
          </div>

          {/* Score Circle */}
          <div className="relative w-40 h-40 mx-auto">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="10" />
              <circle
                cx="60" cy="60" r="50" fill="none"
                stroke={percentage >= 80 ? "#10b981" : percentage >= 50 ? "#f59e0b" : "#ef4444"}
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={`${percentage * 3.14} 314`}
                className="transition-all duration-1000"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-bold text-white">{percentage}%</span>
              <span className="text-xs text-indigo-400">{score}/{questions.length}</span>
            </div>
          </div>

          <div className="flex gap-3 justify-center">
            <button
              onClick={resetQuiz}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-all text-sm font-medium"
            >
              <RotateCcw className="w-4 h-4" />
              Retry Quiz
            </button>
            <button
              onClick={() => navigate(`/notebooks/${notebookId}`)}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition-all text-sm font-medium"
            >
              Back to Notebook
            </button>
          </div>
        </div>
      </div>
    );
  }

  const question = questions[currentIndex];

  // ========================
  // 🔹 QUIZ UI
  // ========================
  return (
    <div className="min-h-[calc(100vh-56px)] bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-20 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-3xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate(`/notebooks/${notebookId}`)}
            className="flex items-center gap-2 text-indigo-300 hover:text-white transition-colors text-sm font-medium group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Notebook
          </button>
          <div className="flex items-center gap-3">
            <Trophy className="w-4 h-4 text-yellow-400" />
            <span className="text-sm text-indigo-300">
              Score: <span className="text-white font-bold">{score}</span>/{questions.length}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-indigo-400 font-medium">
              Question {currentIndex + 1} of {questions.length}
            </span>
            <span className="text-xs text-indigo-400">{Math.round(progress)}%</span>
          </div>
          <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        <div
          className="rounded-3xl p-8 mb-8"
          style={{
            background: "linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(59, 130, 246, 0.08) 100%)",
            border: "1px solid rgba(99, 102, 241, 0.2)",
            backdropFilter: "blur(20px)",
            boxShadow: "0 25px 60px -12px rgba(99, 102, 241, 0.12)",
          }}
        >
          <div className="text-[10px] font-bold uppercase tracking-widest text-indigo-400/60 mb-4">
            Question {currentIndex + 1}
          </div>
          <h3 className="text-xl md:text-2xl font-semibold text-white leading-relaxed">
            {question?.question}
          </h3>
        </div>

        {/* Options */}
        <div className="space-y-3 mb-8">
          {question?.options.map((opt, index) => {
            const letter = String.fromCharCode(65 + index);
            const isSelected = selectedAnswer === opt.id;
            const isCorrect = opt.id === question.correctOptionId;
            const showCorrect = isAnswered && isCorrect;
            const showWrong = isAnswered && isSelected && !isCorrect;

            return (
              <button
                key={opt.id}
                onClick={() => handleSelectAnswer(opt.id)}
                disabled={isAnswered}
                className={`w-full text-left p-4 rounded-2xl border transition-all duration-300 flex items-center gap-4 group ${
                  showCorrect
                    ? "bg-green-500/15 border-green-500/40 shadow-lg shadow-green-500/10"
                    : showWrong
                    ? "bg-red-500/15 border-red-500/40 shadow-lg shadow-red-500/10"
                    : isSelected
                    ? "bg-indigo-500/20 border-indigo-500/40"
                    : isAnswered
                    ? "bg-white/3 border-white/5 opacity-50 cursor-not-allowed"
                    : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-indigo-500/30 cursor-pointer"
                }`}
              >
                {/* Letter Badge */}
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0 transition-all ${
                    showCorrect
                      ? "bg-green-500/20 text-green-400"
                      : showWrong
                      ? "bg-red-500/20 text-red-400"
                      : isSelected
                      ? "bg-indigo-500/20 text-indigo-300"
                      : "bg-white/5 text-white/60 group-hover:bg-indigo-500/10 group-hover:text-indigo-300"
                  }`}
                >
                  {showCorrect ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : showWrong ? (
                    <XCircle className="w-5 h-5" />
                  ) : (
                    letter
                  )}
                </div>

                {/* Text */}
                <span
                  className={`text-sm font-medium ${
                    showCorrect
                      ? "text-green-300"
                      : showWrong
                      ? "text-red-300"
                      : "text-white/80"
                  }`}
                >
                  {opt.text}
                </span>
              </button>
            );
          })}
        </div>

        {/* Feedback & Next */}
        {isAnswered && (
          <div className="flex items-center justify-between">
            <p
              className={`text-sm font-medium ${
                selectedAnswer === question.correctOptionId
                  ? "text-green-400"
                  : "text-red-400"
              }`}
            >
              {selectedAnswer === question.correctOptionId
                ? "✅ Correct! Great job!"
                : `❌ Wrong — correct answer was highlighted in green`}
            </p>

            <button
              onClick={goNext}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-indigo-600 text-white hover:bg-indigo-700 transition-all text-sm font-medium shadow-lg shadow-indigo-600/20"
            >
              {currentIndex === questions.length - 1 ? "See Results" : "Next Question"}
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Question Dots */}
        <div className="flex justify-center gap-2 mt-8">
          {questions.map((_, i) => (
            <div
              key={i}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                i === currentIndex
                  ? "bg-indigo-400 scale-125 shadow-lg shadow-indigo-500/30"
                  : answeredQuestions.has(i)
                  ? "bg-indigo-500/60"
                  : "bg-white/15"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuizPage;
