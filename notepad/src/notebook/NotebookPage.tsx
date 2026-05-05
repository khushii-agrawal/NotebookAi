import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ChatWindow from "../components/chat/ChatWindow";
import NotesEditor from "./NotesEditor";

type Notebook = {
  id: string;
  title: string;
  updatedAt: string;
  notes: string;
  summary: string;
};

type NotebookPageProps = {
  notebook: Notebook | null;
  onUpdateNotes: (notes: string) => void;
};

const NotebookPage = ({ notebook, onUpdateNotes }: NotebookPageProps) => {
  const navigate = useNavigate();
  const [notes, setNotes] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"chat" | "tools">("chat");

  /* -------------------------------
     SYNC NOTES WHEN NOTEBOOK CHANGES
  -------------------------------- */
  useEffect(() => {
    if (notebook) {
      setNotes(notebook.notes || "<p>Write or edit notes here…</p>");
    }
  }, [notebook]);

  /* -------------------------------
     NO NOTEBOOK SELECTED
  -------------------------------- */
  if (!notebook) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-gray-50 dark:bg-slate-950">
        <div
          className="
            w-[480px] max-w-[90%]
            bg-white dark:bg-slate-900
            border border-gray-200 dark:border-slate-800
            rounded-2xl
            flex flex-col items-center justify-center
            text-center
            px-10 py-16
            gap-5
            shadow-sm
          "
        >
          <div className="w-16 h-16 bg-purple-50 dark:bg-purple-900/30 rounded-2xl flex items-center justify-center">
            <span className="text-3xl">📂</span>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
              Select a Notebook
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs leading-relaxed">
              Choose a notebook from the sidebar or create a new one to begin exploring your documents.
            </p>
          </div>
        </div>
      </div>
    );
  }

  /* -------------------------------
     TOOL BUTTONS CONFIG
  -------------------------------- */
  const tools = [
    { icon: "🧩", label: "Mind Map", path: `/mindmap/${notebook.id}`, color: "from-violet-500/10 to-purple-500/10 border-violet-300/30 dark:border-violet-600/30" },
    { icon: "📝", label: "Quiz", path: `/quiz/${notebook.id}`, color: "from-blue-500/10 to-cyan-500/10 border-blue-300/30 dark:border-blue-600/30" },
    { icon: "📊", label: "Flashcards", path: `/flashcards/${notebook.id}`, color: "from-emerald-500/10 to-teal-500/10 border-emerald-300/30 dark:border-emerald-600/30" },
    { icon: "📚", label: "Report", path: `/report/${notebook.id}`, color: "from-amber-500/10 to-orange-500/10 border-amber-300/30 dark:border-amber-600/30" },
  ];

  /* -------------------------------
     NOTEBOOK VIEW
  -------------------------------- */
  return (
    <div className="h-full flex bg-gray-50 dark:bg-slate-950">
      {/* ===== LEFT COLUMN — Summary + Notes ===== */}
      <div className="flex-1 overflow-y-auto p-6 space-y-5">
        {/* AI Summary Card */}
        <div
          className="rounded-2xl p-5 border border-purple-200/50 dark:border-purple-700/30"
          style={{
            background: "linear-gradient(135deg, rgba(147,51,234,0.04) 0%, rgba(99,102,241,0.03) 100%)",
          }}
        >
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 bg-purple-500/15 rounded-lg flex items-center justify-center">
              <span className="text-sm">✨</span>
            </div>
            <h2 className="text-sm font-semibold text-purple-600 dark:text-purple-400 uppercase tracking-wide">
              AI Summary
            </h2>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
            {notebook.summary || "No summary available. Upload a document to generate one."}
          </p>
        </div>

        {/* Notes Card */}
        <div className="bg-white dark:bg-slate-900 border border-gray-200/70 dark:border-slate-700/50 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-gray-100 dark:bg-slate-800 rounded-lg flex items-center justify-center">
                <span className="text-sm">📝</span>
              </div>
              <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                Notes
              </h2>
            </div>
            <button
              onClick={() => onUpdateNotes(notes)}
              className="px-3 py-1.5 text-xs font-medium bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors shadow-sm"
            >
              Save Notes
            </button>
          </div>

          <NotesEditor
            value={notes}
            onChange={(updated) => {
              setNotes(updated);
              onUpdateNotes(updated);
            }}
          />
        </div>
      </div>

      {/* ===== RIGHT COLUMN — Chat + Tools ===== */}
      <div className="w-[380px] shrink-0 border-l border-gray-200/50 dark:border-slate-700/50 bg-white dark:bg-slate-900/80 flex flex-col">
        {/* Tab Switcher */}
        <div className="flex border-b border-gray-200/50 dark:border-slate-700/50 shrink-0">
          <button
            onClick={() => setActiveTab("chat")}
            className={`flex-1 px-4 py-3 text-xs font-semibold uppercase tracking-wider transition-all ${
              activeTab === "chat"
                ? "text-purple-600 dark:text-purple-400 border-b-2 border-purple-500 bg-purple-50/50 dark:bg-purple-900/20"
                : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            }`}
          >
            🤖 Ask AI
          </button>
          <button
            onClick={() => setActiveTab("tools")}
            className={`flex-1 px-4 py-3 text-xs font-semibold uppercase tracking-wider transition-all ${
              activeTab === "tools"
                ? "text-purple-600 dark:text-purple-400 border-b-2 border-purple-500 bg-purple-50/50 dark:bg-purple-900/20"
                : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            }`}
          >
            🛠 Tools
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-hidden flex flex-col">
          {activeTab === "chat" ? (
            /* ===== CHAT TAB ===== */
            <div className="flex-1 flex flex-col p-4 min-h-0">
              <ChatWindow notebookId={notebook.id} />
            </div>
          ) : (
            /* ===== TOOLS TAB ===== */
            <div className="p-4 space-y-3 overflow-y-auto">
              <p className="text-xs text-gray-400 dark:text-gray-500 mb-2">
                AI-powered tools for your document
              </p>

              {tools.map((tool) => (
                <button
                  key={tool.label}
                  onClick={() => navigate(tool.path)}
                  className={`w-full flex items-center gap-3 p-3.5 rounded-xl border bg-gradient-to-r ${tool.color} hover:scale-[1.02] active:scale-[0.98] transition-all duration-200`}
                >
                  <div className="w-10 h-10 rounded-xl bg-white/60 dark:bg-slate-800/60 flex items-center justify-center shadow-sm">
                    <span className="text-lg">{tool.icon}</span>
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                      {tool.label}
                    </p>
                    <p className="text-[10px] text-gray-400 dark:text-gray-500">
                      {tool.label === "Mind Map" && "Visualize document structure"}
                      {tool.label === "Quiz" && "Test your knowledge"}
                      {tool.label === "Flashcards" && "Study with AI flashcards"}
                      {tool.label === "Report" && "Generate detailed analysis"}
                    </p>
                  </div>
                  <svg className="w-4 h-4 text-gray-300 dark:text-gray-600 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotebookPage;