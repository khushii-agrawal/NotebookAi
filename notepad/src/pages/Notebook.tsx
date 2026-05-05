import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import UploadModal from "./UploadModal";
import NotebookPage from "../notebook/NotebookPage";
import { useAuth } from "../context/AuthContext";

type Notebook = {
  id: string;
  title: string;
  updatedAt: string;
  summary: string;
  notes: string;
};

const Notebook = () => {
  const [notebooks, setNotebooks] = useState<Notebook[]>([]);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const navigate = useNavigate();
  const { notebookId } = useParams();
  const { user } = useAuth();

  // =========================
  // 🔹 FETCH NOTEBOOKS FROM BACKEND (filtered by user)
  // =========================
  useEffect(() => {
    if (!user) return;

    fetch(`http://127.0.0.1:8000/notebooks/?user_id=${user.user_id}`)
      .then((res) => res.json())
      .then((data) => {
        const formatted = (data.notebooks || []).map((n: any) => ({
          id: n.notebook_id,
          title: n.title,
          summary: n.summary || "",
          notes: n.notes || "<p>Write notes here…</p>",
          updatedAt: new Date().toISOString(),
        }));

        setNotebooks(formatted);
      })
      .catch((err) => {
        console.error("Failed to fetch notebooks:", err);
      });
  }, [user]);

  // =========================
  // 🔹 ACTIVE NOTEBOOK
  // =========================
  const activeNotebook =
    notebooks.find((n) => n.id === notebookId) ?? null;

  // =========================
  // 🔹 FILTERED NOTEBOOKS
  // =========================
  const filteredNotebooks = notebooks.filter((n) =>
    n.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // =========================
  // 🔹 ADD NOTEBOOK (UPLOAD)
  // =========================
  const handleNotebookCreated = (notebook: Notebook) => {
    const formatted = {
      ...notebook,
      notes: notebook.notes || "<p>Write notes here…</p>",
      summary: notebook.summary || "",
      updatedAt: new Date().toISOString(),
    };

    setNotebooks((prev) => [formatted, ...prev]);

    navigate(`/notebooks/${formatted.id}`);
  };

  // =========================
  // 🔹 DELETE NOTEBOOK
  // =========================
  const deleteNotebook = (id: string) => {
    setNotebooks((prev) => prev.filter((n) => n.id !== id));
    navigate("/notebooks");
  };

  // =========================
  // 🔹 RENAME NOTEBOOK
  // =========================
  const renameNotebook = (id: string) => {
    const newTitle = prompt("Enter new notebook name");
    if (!newTitle) return;

    setNotebooks((prev) =>
      prev.map((n) =>
        n.id === id ? { ...n, title: newTitle } : n
      )
    );
  };

  return (
    <>
      <div className="flex h-[calc(100vh-56px)] bg-gray-50 dark:bg-slate-950">

        {/* ===== SIDEBAR ===== */}
        <aside
          className={`${
            sidebarCollapsed ? "w-16" : "w-72"
          } flex flex-col border-r border-gray-200/50 dark:border-slate-700/50 bg-white dark:bg-slate-900/95 transition-all duration-300 shrink-0`}
        >
          {/* Sidebar Header — Fixed */}
          <div className="p-3 border-b border-gray-200/50 dark:border-slate-700/50 shrink-0">
            <div className="flex items-center justify-between mb-2">
              {!sidebarCollapsed && (
                <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Notebooks
                </h2>
              )}
              <div className="flex items-center gap-1">
                {!sidebarCollapsed && (
                  <button
                    onClick={() => setIsUploadOpen(true)}
                    className="p-1.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                    title="New Notebook"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                )}
                <button
                  onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                  className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
                  title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {sidebarCollapsed ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                    )}
                  </svg>
                </button>
              </div>
            </div>

            {/* Search */}
            {!sidebarCollapsed && (
              <div className="relative">
                <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search notebooks…"
                  className="w-full pl-8 pr-3 py-1.5 text-xs bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg text-gray-700 dark:text-gray-300 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-purple-500/50 transition-all"
                />
              </div>
            )}
          </div>

          {/* Notebook List — Scrollable */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1 scrollbar-thin">
            {sidebarCollapsed ? (
              /* Collapsed: show icons only */
              <>
                <button
                  onClick={() => setIsUploadOpen(true)}
                  className="w-full p-2 rounded-lg text-center hover:bg-purple-50 dark:hover:bg-purple-900/30 transition-colors"
                  title="New Notebook"
                >
                  <span className="text-lg">➕</span>
                </button>
                {notebooks.map((n) => (
                  <button
                    key={n.id}
                    onClick={() => navigate(`/notebooks/${n.id}`)}
                    className={`w-full p-2 rounded-lg text-center transition-colors ${
                      notebookId === n.id
                        ? "bg-purple-100 dark:bg-purple-900/40"
                        : "hover:bg-gray-100 dark:hover:bg-slate-800"
                    }`}
                    title={n.title}
                  >
                    <span className="text-lg">📄</span>
                  </button>
                ))}
              </>
            ) : filteredNotebooks.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-3xl mb-2 opacity-40">📂</div>
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  {searchQuery ? "No results found" : "No notebooks yet"}
                </p>
              </div>
            ) : (
              filteredNotebooks.map((n) => (
                <div
                  key={n.id}
                  className={`group relative p-2.5 rounded-xl cursor-pointer transition-all duration-200 ${
                    notebookId === n.id
                      ? "bg-purple-50 dark:bg-purple-900/30 border border-purple-300/50 dark:border-purple-600/40 shadow-sm"
                      : "hover:bg-gray-50 dark:hover:bg-slate-800/60 border border-transparent"
                  }`}
                  onClick={() => navigate(`/notebooks/${n.id}`)}
                >
                  <div className="flex items-start gap-2.5">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs shrink-0 mt-0.5 ${
                      notebookId === n.id
                        ? "bg-purple-500/20 text-purple-500"
                        : "bg-gray-100 dark:bg-slate-700/60 text-gray-400"
                    }`}>
                      📄
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className={`text-sm font-medium truncate ${
                        notebookId === n.id
                          ? "text-purple-700 dark:text-purple-300"
                          : "text-gray-700 dark:text-gray-300"
                      }`}>
                        {n.title}
                      </p>
                      <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5">
                        {new Date(n.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {/* Actions — show on active */}
                  {notebookId === n.id && (
                    <div className="flex gap-1.5 mt-2 ml-10">
                      <button
                        onClick={(e) => { e.stopPropagation(); renameNotebook(n.id); }}
                        className="text-[10px] px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
                      >
                        Rename
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); deleteNotebook(n.id); }}
                        className="text-[10px] px-2 py-0.5 rounded-md bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Sidebar Footer — Notebook Count */}
          {!sidebarCollapsed && (
            <div className="p-3 border-t border-gray-200/50 dark:border-slate-700/50 shrink-0">
              <p className="text-[10px] text-gray-400 dark:text-gray-600 text-center">
                {notebooks.length} notebook{notebooks.length !== 1 ? "s" : ""}
              </p>
            </div>
          )}
        </aside>

        {/* ===== MAIN CONTENT ===== */}
        <main className="flex-1 overflow-y-auto">
          <NotebookPage
            notebook={activeNotebook}
            onUpdateNotes={(newNotes) => {
              if (!notebookId) return;

              setNotebooks((prev) =>
                prev.map((n) =>
                  n.id === notebookId
                    ? { ...n, notes: newNotes }
                    : n
                )
              );
            }}
          />
        </main>
      </div>

      {/* ===== UPLOAD MODAL ===== */}
      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onNotebookCreated={handleNotebookCreated}
      />
    </>
  );
};

export default Notebook;