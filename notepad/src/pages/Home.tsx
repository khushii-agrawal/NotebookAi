import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const [notebookCount, setNotebookCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  // Fetch real notebook count
  useEffect(() => {
    setIsVisible(true);
    fetch("http://127.0.0.1:8000/notebooks/")
      .then((res) => res.json())
      .then((data) => {
        setNotebookCount((data.notebooks || []).length);
      })
      .catch(() => {});
  }, []);

  const features = [
    {
      icon: "📤",
      title: "Smart Upload",
      desc: "Upload PDF, DOCX, or TXT files. AI extracts, chunks, and embeds your content automatically.",
      gradient: "from-purple-500/20 to-indigo-500/20",
      border: "border-purple-500/20",
    },
    {
      icon: "🤖",
      title: "RAG-Powered Chat",
      desc: "Ask questions about your documents and get precise, context-aware answers — no generic responses.",
      gradient: "from-blue-500/20 to-cyan-500/20",
      border: "border-blue-500/20",
    },
    {
      icon: "📝",
      title: "AI Quiz & Flashcards",
      desc: "Auto-generate quizzes and flashcards from your content to test and reinforce your learning.",
      gradient: "from-emerald-500/20 to-teal-500/20",
      border: "border-emerald-500/20",
    },
    {
      icon: "🧩",
      title: "Mind Maps & Reports",
      desc: "Visualize document structure with mind maps and generate detailed analytical reports.",
      gradient: "from-amber-500/20 to-orange-500/20",
      border: "border-amber-500/20",
    },
  ];

  const steps = [
    { num: "01", title: "Upload", desc: "Drop your PDF or document", icon: "📄" },
    { num: "02", title: "Process", desc: "AI embeds & indexes content", icon: "⚡" },
    { num: "03", title: "Explore", desc: "Chat, quiz, map, report", icon: "🔍" },
    { num: "04", title: "Learn", desc: "Master your material faster", icon: "🎯" },
  ];

  const techStack = [
    { name: "React", icon: "⚛️" },
    { name: "FastAPI", icon: "🐍" },
    { name: "ChromaDB", icon: "🗄️" },
    { name: "Groq", icon: "🚀" },
    { name: "Ollama", icon: "🦙" },
    { name: "RAG", icon: "🔗" },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-hidden">
      {/* ===== HERO SECTION ===== */}
      <section className="relative min-h-screen flex items-center justify-center px-6">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-purple-600/8 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-indigo-600/8 rounded-full blur-[100px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[150px]" />
          {/* Grid pattern */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: "linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />
        </div>

        <div
          className={`relative z-10 max-w-4xl mx-auto text-center transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-medium mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
            Powered by RAG + Groq AI
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
            <span className="text-white">Your Documents,</span>
            <br />
            <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Made Intelligent
            </span>
          </h1>

          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Upload any document and unlock AI-powered summaries, quizzes,
            flashcards, mind maps, and a chatbot that answers{" "}
            <span className="text-purple-300 font-medium">only from your content</span>.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => navigate("/login")}
              className="group px-8 py-3.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-xl shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 hover:scale-105 transition-all duration-300 flex items-center gap-2"
            >
              Get Started
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
            <button
              onClick={() => navigate("/login")}
              className="px-8 py-3.5 bg-white/5 border border-white/10 text-gray-300 font-medium rounded-xl hover:bg-white/10 hover:border-white/20 transition-all duration-300"
            >
              View Notebooks
            </button>
          </div>

          {/* Live Stats */}
          <div className="flex items-center justify-center gap-8 mt-14">
            <div className="text-center">
              <p className="text-2xl font-bold text-white">{notebookCount}</p>
              <p className="text-xs text-gray-500 mt-1">Notebooks Created</p>
            </div>
            <div className="w-px h-10 bg-slate-800"></div>
            <div className="text-center">
              <p className="text-2xl font-bold text-white">6</p>
              <p className="text-xs text-gray-500 mt-1">AI Tools</p>
            </div>
            <div className="w-px h-10 bg-slate-800"></div>
            <div className="text-center">
              <p className="text-2xl font-bold text-white">&lt;5s</p>
              <p className="text-xs text-gray-500 mt-1">Response Time</p>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-600">
          <span className="text-xs">Scroll to explore</span>
          <div className="w-5 h-8 rounded-full border border-gray-700 flex justify-center pt-1.5">
            <div className="w-1 h-2 bg-gray-500 rounded-full animate-bounce"></div>
          </div>
        </div>
      </section>

      {/* ===== FEATURES SECTION ===== */}
      <section className="relative py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-purple-400 text-sm font-semibold uppercase tracking-widest mb-3">Features</p>
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Everything you need to <span className="text-purple-400">study smarter</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            {features.map((f, i) => (
              <div
                key={i}
                className={`group p-6 rounded-2xl bg-gradient-to-br ${f.gradient} border ${f.border} hover:scale-[1.02] transition-all duration-300 cursor-default`}
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-slate-800/80 flex items-center justify-center text-2xl shrink-0 group-hover:scale-110 transition-transform">
                    {f.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1.5">{f.title}</h3>
                    <p className="text-sm text-gray-400 leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="relative py-24 px-6">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-900/5 to-transparent pointer-events-none" />
        <div className="max-w-5xl mx-auto relative">
          <div className="text-center mb-16">
            <p className="text-blue-400 text-sm font-semibold uppercase tracking-widest mb-3">How it works</p>
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              From upload to mastery in <span className="text-blue-400">4 steps</span>
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {steps.map((s, i) => (
              <div key={i} className="text-center group">
                <div className="relative w-20 h-20 mx-auto mb-4">
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-800/50 border border-slate-700/50 group-hover:border-purple-500/30 transition-colors"></div>
                  <div className="absolute inset-0 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                    {s.icon}
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-purple-600 text-[10px] font-bold flex items-center justify-center">
                    {s.num}
                  </div>
                </div>
                <h4 className="text-sm font-semibold text-white mb-1">{s.title}</h4>
                <p className="text-xs text-gray-500">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== TECH STACK ===== */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <p className="text-center text-xs text-gray-600 uppercase tracking-widest mb-8">Built with</p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            {techStack.map((t, i) => (
              <div
                key={i}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-gray-400 text-sm hover:border-purple-500/30 hover:text-gray-300 transition-all"
              >
                <span>{t.icon}</span>
                <span>{t.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FINAL CTA ===== */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div
            className="p-10 rounded-3xl border border-slate-800 relative overflow-hidden"
            style={{
              background: "linear-gradient(135deg, rgba(147,51,234,0.08) 0%, rgba(59,130,246,0.06) 50%, rgba(147,51,234,0.04) 100%)",
            }}
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent"></div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
              Ready to study smarter?
            </h2>
            <p className="text-gray-400 mb-8 max-w-md mx-auto">
              Upload your first document and experience AI-powered learning.
            </p>
            <button
              onClick={() => navigate("/login")}
              className="px-8 py-3.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-xl shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 hover:scale-105 transition-all duration-300"
            >
              Open Notebook →
            </button>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="border-t border-slate-900 py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <span className="text-sm font-semibold text-gray-400">AI Smart Notebook</span>
          </div>
          <p className="text-xs text-gray-600">
            Built with ❤️ using RAG, Groq & ChromaDB
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;