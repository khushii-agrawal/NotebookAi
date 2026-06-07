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
      <div className="flex flex-col items-center justify-center h-full bg-[#0a0a1a] px-4">
        <div
          className="
            w-[480px] max-w-full
            bg-[#0d0d22]/50 backdrop-blur-md
            border border-white/5
            rounded-2xl
            flex flex-col items-center justify-center
            text-center
            px-8 py-16
            gap-6
            shadow-2xl shadow-purple-500/5
          "
        >
          <div className="w-16 h-16 bg-purple-500/10 rounded-2xl flex items-center justify-center border border-purple-500/20">
            <span className="text-3xl">📂</span>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Select a Notebook
            </h3>
            <p className="text-sm text-gray-400 max-w-xs leading-relaxed">
              Choose a notebook from the sidebar or create a new one to begin exploring your documents with NoteBar AI.
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
    { 
      icon: "🧩", 
      label: "Mind Map", 
      path: `/mindmap/${notebook.id}`, 
      color: "from-violet-500/10 to-purple-500/10 border-violet-500/20 hover:border-violet-500/40 text-violet-300", 
      desc: "Visualize document concepts and structures" 
    },
    { 
      icon: "📝", 
      label: "Quiz", 
      path: `/quiz/${notebook.id}`, 
      color: "from-blue-500/10 to-cyan-500/10 border-blue-500/20 hover:border-blue-500/40 text-blue-300", 
      desc: "Test your comprehension with AI questions" 
    },
    { 
      icon: "📊", 
      label: "Flashcards", 
      path: `/flashcards/${notebook.id}`, 
      color: "from-emerald-500/10 to-teal-500/10 border-emerald-500/20 hover:border-emerald-500/40 text-emerald-300", 
      desc: "Study terminology using interactive cards" 
    },
    { 
      icon: "📚", 
      label: "Report", 
      path: `/report/${notebook.id}`, 
      color: "from-amber-500/10 to-orange-500/10 border-amber-500/20 hover:border-amber-500/40 text-amber-300", 
      desc: "Generate full summaries and deep analysis" 
    },
  ];

  /* -------------------------------
     NOTEBOOK VIEW
  -------------------------------- */
  return (
    <div className="h-full flex bg-[#0a0a1a]">
      {/* ===== LEFT COLUMN — Summary + Notes ===== */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* AI Summary Card */}
        <div
          className="rounded-2xl p-5 border border-purple-500/15"
          style={{
            background: "linear-gradient(135deg, rgba(147, 51, 234, 0.08) 0%, rgba(99, 102, 241, 0.04) 100%)",
          }}
        >
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 bg-purple-500/15 rounded-lg flex items-center justify-center border border-purple-500/20">
              <span className="text-xs">✨</span>
            </div>
            <h2 className="text-xs font-semibold text-purple-400 uppercase tracking-widest">
              AI Summary
            </h2>
          </div>
          <p className="text-sm text-gray-300 leading-relaxed">
            {notebook.summary || "No summary available. Upload a document to generate one."}
          </p>
        </div>

        {/* Notes Card */}
        <div className="bg-[#0d0d22]/50 backdrop-blur-md border border-white/5 rounded-2xl p-5 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-white/5 rounded-lg flex items-center justify-center border border-white/8">
                <span className="text-sm">📝</span>
              </div>
              <h2 className="text-xs font-semibold text-gray-300 uppercase tracking-widest">
                Notes Editor
              </h2>
            </div>
            <button
              onClick={() => onUpdateNotes(notes)}
              className="px-4 py-1.5 text-xs font-medium bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-90 transition-opacity text-white rounded-lg shadow-md shadow-purple-500/20"
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
      <div className="w-[380px] shrink-0 border-l border-white/5 bg-[#0d0d22]/40 backdrop-blur-md flex flex-col">
        {/* Tab Switcher */}
        <div className="flex border-b border-white/5 shrink-0 bg-[#0d0d22]/20">
          <button
            onClick={() => setActiveTab("chat")}
            className={`flex-1 px-4 py-3 text-xs font-semibold uppercase tracking-widest transition-all ${
              activeTab === "chat"
                ? "text-purple-400 border-b-2 border-purple-500 bg-purple-500/10"
                : "text-gray-500 hover:text-gray-300"
            }`}
          >
            🤖 Ask AI
          </button>
          <button
            onClick={() => setActiveTab("tools")}
            className={`flex-1 px-4 py-3 text-xs font-semibold uppercase tracking-widest transition-all ${
              activeTab === "tools"
                ? "text-purple-400 border-b-2 border-purple-500 bg-purple-500/10"
                : "text-gray-500 hover:text-gray-300"
            }`}
          >
            🛠 Tools
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-hidden flex flex-col">
          {activeTab === "chat" ? (
            /* ===== CHAT TAB ===== */
            <div className="flex-1 flex flex-col p-4 min-h-0 bg-[#070716]/30">
              <ChatWindow notebookId={notebook.id} />
            </div>
          ) : (
            /* ===== TOOLS TAB ===== */
            <div className="p-4 space-y-3 overflow-y-auto bg-[#070716]/30 h-full">
              <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-3 px-1">
                AI-powered tools for your document
              </p>

              {tools.map((tool) => (
                <button
                  key={tool.label}
                  onClick={() => navigate(tool.path)}
                  className={`w-full flex items-center gap-3 p-3.5 rounded-xl border bg-gradient-to-r ${tool.color} hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 shadow-sm`}
                >
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/8 shadow-inner shrink-0">
                    <span className="text-lg">{tool.icon}</span>
                  </div>
                  <div className="text-left min-w-0">
                    <p className="text-sm font-semibold text-gray-200">
                      {tool.label}
                    </p>
                    <p className="text-[10px] text-gray-500 truncate">
                      {tool.desc}
                    </p>
                  </div>
                  <svg className="w-4 h-4 text-gray-600 ml-auto shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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