import { X, Loader2, CheckCircle2, FileText, Brain, Database, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FileUpload from "../components/upload/FileUpload";
import { useAuth } from "../context/AuthContext";

type Notebook = {
  id: string;
  title: string;
  updatedAt: string;
  summary: string;
  notes: string;
};

type UploadModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onNotebookCreated: (notebook: Notebook) => void;
};

// ========================
// 🔹 PROGRESS STEPS
// ========================
const PROGRESS_STEPS = [
  { label: "Uploading document", icon: FileText, duration: 2000 },
  { label: "Extracting & chunking text", icon: Database, duration: 3000 },
  { label: "Generating embeddings", icon: Brain, duration: 5000 },
  { label: "AI is writing summary", icon: Sparkles, duration: 0 }, // stays until API responds
];

const UploadModal = ({
  isOpen,
  onClose,
  onNotebookCreated,
}: UploadModalProps) => {
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const navigate = useNavigate();
  const { user } = useAuth();

  // ========================
  // 🔹 STEP TIMER — auto-advance steps
  // ========================
  useEffect(() => {
    if (!loading) {
      setCurrentStep(0);
      setElapsedTime(0);
      return;
    }

    // Elapsed time counter
    const timer = setInterval(() => {
      setElapsedTime((prev) => prev + 1);
    }, 1000);

    // Auto-advance through steps (simulate progress)
    const stepTimers: ReturnType<typeof setTimeout>[] = [];
    let accumulated = 0;
    PROGRESS_STEPS.forEach((step, index) => {
      if (step.duration > 0 && index < PROGRESS_STEPS.length - 1) {
        accumulated += step.duration;
        stepTimers.push(
          setTimeout(() => setCurrentStep(index + 1), accumulated)
        );
      }
    });

    return () => {
      clearInterval(timer);
      stepTimers.forEach(clearTimeout);
    };
  }, [loading]);

  if (!isOpen) return null;

  const handleFilesSelected = (newFiles: File[]) => {
    setFiles(newFiles);
  };

  const handleSave = async () => {
    if (files.length === 0) return;

    setLoading(true);
    setCurrentStep(0);

    try {
      const file = files[0];

      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch(`http://127.0.0.1:8000/notebooks/upload?user_id=${user?.user_id || ""}`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text);
      }

      const data = await res.json();

      const notebook: Notebook = {
        id: data.notebook_id,
        title: file.name,
        updatedAt: new Date().toISOString(),
        summary: data.summary,
        notes: "",
      };

      onNotebookCreated(notebook);

      navigate(`/notebooks/${notebook.id}`, {
        state: { notebook },
      });

      setFiles([]);
      onClose();
    } catch (err) {
      console.error(err);
      alert("Upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ========================
  // 🔹 LOADING VIEW
  // ========================
  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/60 backdrop-blur-md" />

        <div className="relative bg-[#0d0d22]/90 border border-white/5 w-full max-w-lg rounded-2xl shadow-2xl p-8 z-10 backdrop-blur-xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-purple-500/10 rounded-2xl flex items-center justify-center border border-purple-500/20">
              <div className="relative">
                <Sparkles className="w-8 h-8 text-purple-400 animate-pulse" />
              </div>
            </div>
            <h2 className="text-xl font-bold text-white">
              Processing Your Document
            </h2>
            <p className="text-sm text-gray-400 mt-1 truncate max-w-xs mx-auto">
              {files[0]?.name}
            </p>
          </div>

          {/* Progress Steps */}
          <div className="space-y-4 mb-8">
            {PROGRESS_STEPS.map((step, index) => {
              const StepIcon = step.icon;
              const isActive = index === currentStep;
              const isDone = index < currentStep;

              return (
                <div
                  key={index}
                  className={`flex items-center gap-4 p-3 rounded-xl transition-all duration-500 border ${
                    isActive
                      ? "bg-purple-500/10 border-purple-500/30"
                      : isDone
                      ? "border-transparent opacity-60"
                      : "border-transparent opacity-30"
                  }`}
                >
                  {/* Icon */}
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 border transition-all ${
                      isDone
                        ? "bg-green-500/10 border-green-500/20"
                        : isActive
                        ? "bg-purple-500/10 border-purple-500/20"
                        : "bg-white/5 border-white/8"
                    }`}
                  >
                    {isDone ? (
                      <CheckCircle2 className="w-5 h-5 text-green-400" />
                    ) : isActive ? (
                      <Loader2 className="w-5 h-5 text-purple-400 animate-spin" />
                    ) : (
                      <StepIcon className="w-5 h-5 text-gray-500" />
                    )}
                  </div>

                  {/* Label */}
                  <span
                    className={`text-sm font-medium ${
                      isDone
                        ? "text-green-400 line-through"
                        : isActive
                        ? "text-purple-300"
                        : "text-gray-500"
                    }`}
                  >
                    {step.label}
                    {isActive && index === PROGRESS_STEPS.length - 1 && (
                      <span className="text-xs ml-2 text-purple-400/80">
                        (this may take 20-40s)
                      </span>
                    )}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Timer */}
          <div className="text-center">
            <p className="text-xs text-gray-500">
              Elapsed time: {elapsedTime}s
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ========================
  // 🔹 NORMAL UPLOAD VIEW
  // ========================
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-[#0d0d22]/90 border border-white/5 w-full max-w-3xl rounded-2xl shadow-2xl p-6 z-10 backdrop-blur-xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">
            Add sources
          </h2>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-sm text-gray-400 mb-6">
          Upload documents so AI can generate a notebook summary and notes.
        </p>

        {/* Upload Area */}
        <FileUpload onFilesSelected={handleFilesSelected} />

        {/* Footer */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm rounded-lg border border-white/8 hover:bg-white/5 text-gray-300 transition-colors"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            disabled={files.length === 0}
            className={`px-4 py-2 text-sm rounded-lg text-white font-medium transition-all ${
              files.length === 0
                ? "bg-purple-950/20 text-purple-300/40 border border-purple-900/20 cursor-not-allowed"
                : "bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-90 shadow-md shadow-purple-500/10"
            }`}
          >
            Add sources
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadModal;
