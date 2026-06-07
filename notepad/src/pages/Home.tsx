import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

/* ───────────────────────── tiny SVG icons ───────────────────────── */
const Icons = {
  brain: (
    <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
    </svg>
  ),
  upload: (
    <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
    </svg>
  ),
  chat: (
    <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
    </svg>
  ),
  quiz: (
    <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15a2.25 2.25 0 012.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
    </svg>
  ),
  mindmap: (
    <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
    </svg>
  ),
  report: (
    <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
    </svg>
  ),
  flashcard: (
    <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.429 9.75L2.25 12l4.179 2.25m0-4.5l5.571 3 5.571-3m-11.142 0L2.25 7.5 12 2.25l9.75 5.25-4.179 2.25m0 0L12 12.75 6.429 9.75m11.142 0l4.179 2.25L12 17.25 2.25 12l4.179-2.25" />
    </svg>
  ),
  arrow: (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
    </svg>
  ),
  check: (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
    </svg>
  ),
  github: (
    <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    </svg>
  ),
};

/* ───────────────────────── intersection observer hook ───────────────────────── */
function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

/* ════════════════════════════════════════════════════════════════════
   HOME PAGE
   ════════════════════════════════════════════════════════════════════ */
const Home = () => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [heroVisible, setHeroVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setHeroVisible(true), 100);
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const feat = useInView();
  const how = useInView();
  const pricing = useInView();

  /* ── data ── */
  const features = [
    { icon: Icons.upload, title: "Smart Upload", desc: "Upload PDF, DOCX, or TXT files. AI extracts, chunks, and embeds your content automatically with BGE embeddings.", color: "purple" },
    { icon: Icons.chat, title: "RAG-Powered Chat", desc: "Ask questions about your documents and get precise, context-aware answers grounded strictly in your content.", color: "blue" },
    { icon: Icons.quiz, title: "AI Quiz Generator", desc: "Auto-generate multiple-choice quizzes from your notes to test comprehension and reinforce key concepts.", color: "emerald" },
    { icon: Icons.flashcard, title: "Smart Flashcards", desc: "Create flashcards powered by AI that focus on the most important information in your documents.", color: "cyan" },
    { icon: Icons.mindmap, title: "Mind Map Visualization", desc: "Visualize document structure and topic relationships with interactive, AI-generated mind maps.", color: "amber" },
    { icon: Icons.report, title: "Analytical Reports", desc: "Generate detailed, structured reports that analyze and summarize your documents comprehensively.", color: "rose" },
  ];

  const colorMap: Record<string, { bg: string; border: string; icon: string }> = {
    purple: { bg: "from-purple-500/10 to-purple-900/5", border: "border-purple-500/20 hover:border-purple-400/40", icon: "text-purple-400" },
    blue: { bg: "from-blue-500/10 to-blue-900/5", border: "border-blue-500/20 hover:border-blue-400/40", icon: "text-blue-400" },
    emerald: { bg: "from-emerald-500/10 to-emerald-900/5", border: "border-emerald-500/20 hover:border-emerald-400/40", icon: "text-emerald-400" },
    cyan: { bg: "from-cyan-500/10 to-cyan-900/5", border: "border-cyan-500/20 hover:border-cyan-400/40", icon: "text-cyan-400" },
    amber: { bg: "from-amber-500/10 to-amber-900/5", border: "border-amber-500/20 hover:border-amber-400/40", icon: "text-amber-400" },
    rose: { bg: "from-rose-500/10 to-rose-900/5", border: "border-rose-500/20 hover:border-rose-400/40", icon: "text-rose-400" },
  };

  const steps = [
    { num: "01", title: "Upload Your Document", desc: "Drag & drop PDF, DOCX, or TXT — we handle the rest." },
    { num: "02", title: "AI Processes Content", desc: "Text is extracted, chunked, and embedded into ChromaDB vectors." },
    { num: "03", title: "Explore & Interact", desc: "Chat, quiz, flashcard, mindmap, or generate reports instantly." },
    { num: "04", title: "Master Your Material", desc: "Retain information faster with AI-assisted active recall." },
  ];

  const plans = [
    {
      name: "Free",
      tagline: "For individual learners",
      features: ["5 Document Uploads", "RAG-Powered Chatbot", "AI Summarization", "Basic Flashcards", "Community Support"],
      cta: "Get Started Free",
      highlighted: false,
    },
    {
      name: "Pro",
      tagline: "For serious students & researchers",
      features: ["Unlimited Uploads", "Advanced RAG Chat", "Quiz & Flashcard Generator", "Mind Map Visualization", "Analytical Reports", "Priority Support"],
      cta: "Start Learning →",
      highlighted: true,
    },
    {
      name: "Team",
      tagline: "For study groups & organizations",
      features: ["Everything in Pro", "Team Collaboration", "Shared Notebooks", "Admin Dashboard", "API Access", "Dedicated Support"],
      cta: "Contact Us",
      highlighted: false,
    },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a1a] text-white selection:bg-purple-500/30 overflow-x-hidden">

      {/* ═══════ NAVBAR ═══════ */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? "bg-[#0a0a1a]/80 backdrop-blur-xl border-b border-white/5 shadow-2xl shadow-black/30" : ""}`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => navigate("/")}>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-500/25">
              {Icons.brain}
            </div>
            <span className="text-lg font-bold tracking-tight">NoteBar</span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-gray-400 hover:text-white transition-colors">Features</a>
            <a href="#how-it-works" className="text-sm text-gray-400 hover:text-white transition-colors">How It Works</a>
            <a href="#pricing" className="text-sm text-gray-400 hover:text-white transition-colors">Pricing</a>
          </div>

          <div className="flex items-center gap-3">
            <button onClick={() => navigate("/login")} className="hidden sm:inline-flex text-sm text-gray-300 hover:text-white transition-colors px-4 py-2">
              Log in
            </button>
            <button
              onClick={() => navigate("/signup")}
              className="text-sm font-semibold px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-lg shadow-purple-500/20 hover:shadow-purple-500/30 hover:scale-105 transition-all duration-300"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* ═══════ HERO ═══════ */}
      <section className="relative min-h-screen flex items-center justify-center px-6 pt-20">
        {/* bg glows */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[10%] left-[15%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[140px]" />
          <div className="absolute bottom-[15%] right-[10%] w-[450px] h-[450px] bg-indigo-600/8 rounded-full blur-[120px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-blue-600/5 rounded-full blur-[180px]" />
          {/* grid */}
          <div className="absolute inset-0 opacity-[0.025]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.15) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
        </div>

        <div className={`relative z-10 max-w-5xl mx-auto text-center transition-all duration-1000 delay-100 ${heroVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          {/* badge */}
          <div className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-medium mb-10 backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400" />
            </span>
            AI-Powered Smart Notebook Platform
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-extrabold leading-[1.08] mb-8 tracking-tight">
            <span className="text-white">We Transform</span>
            <br />
            <span className="bg-gradient-to-r from-purple-400 via-violet-400 to-indigo-400 bg-clip-text text-transparent">
              Document Chaos
            </span>
            <br />
            <span className="text-white">Into Knowledge</span>
          </h1>

          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-12 leading-relaxed">
            Upload any document and unlock AI-powered summaries, quizzes,
            flashcards, mind maps, and a chatbot that answers{" "}
            <span className="text-purple-300 font-medium">only from your content</span>.
          </p>

          {/* CTA row */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <button
              onClick={() => navigate("/signup")}
              className="group flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-2xl shadow-xl shadow-purple-500/25 hover:shadow-purple-500/40 hover:scale-105 transition-all duration-300 text-base"
            >
              Start Your Notebook
              <span className="group-hover:translate-x-1 transition-transform">{Icons.arrow}</span>
            </button>
            <button
              onClick={() => navigate("/login")}
              className="flex items-center gap-2 px-8 py-4 bg-white/5 border border-white/10 text-gray-300 font-medium rounded-2xl hover:bg-white/10 hover:border-white/20 transition-all duration-300 text-base"
            >
              View Your Notebooks
            </button>
          </div>

          {/* social proof row */}
          <div className="flex flex-wrap items-center justify-center gap-10">
            <div className="flex -space-x-2">
              {["bg-purple-500", "bg-blue-500", "bg-emerald-500", "bg-amber-500", "bg-rose-500"].map((c, i) => (
                <div key={i} className={`w-9 h-9 rounded-full ${c} border-2 border-[#0a0a1a] flex items-center justify-center text-[10px] font-bold text-white`}>
                  {String.fromCharCode(65 + i)}
                </div>
              ))}
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold text-white">Trusted by Students & Researchers</p>
              <p className="text-xs text-gray-500">Powered by RAG, Groq & ChromaDB</p>
            </div>
          </div>
        </div>

        {/* scroll hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-600">
          <span className="text-[10px] uppercase tracking-widest">Scroll</span>
          <div className="w-5 h-9 rounded-full border border-gray-700/60 flex justify-center pt-2">
            <div className="w-1 h-2.5 bg-gray-500 rounded-full animate-bounce" />
          </div>
        </div>
      </section>

      {/* ═══════ FEATURES ═══════ */}
      <section id="features" className="relative py-28 px-6" ref={feat.ref}>
        <div className="max-w-6xl mx-auto">
          <div className={`text-center mb-20 transition-all duration-700 ${feat.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <p className="inline-flex items-center gap-2 text-purple-400 text-xs font-semibold uppercase tracking-[0.2em] mb-4">
              <span className="w-8 h-px bg-purple-500/50" />What We Do<span className="w-8 h-px bg-purple-500/50" />
            </p>
            <h2 className="text-3xl md:text-5xl font-bold text-white">
              Features That <span className="bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">Scale</span>
            </h2>
            <p className="text-gray-400 mt-4 max-w-xl mx-auto">
              From document upload to active recall, we provide end-to-end AI tools that supercharge your learning.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => {
              const c = colorMap[f.color];
              return (
                <div
                  key={i}
                  className={`group relative p-7 rounded-2xl bg-gradient-to-br ${c.bg} border ${c.border} backdrop-blur-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/20 cursor-default ${feat.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
                  style={{ transitionDelay: feat.visible ? `${i * 80}ms` : "0ms" }}
                >
                  <div className={`w-12 h-12 rounded-xl bg-slate-800/60 flex items-center justify-center ${c.icon} mb-5 group-hover:scale-110 transition-transform duration-300`}>
                    {f.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{f.title}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════ HOW IT WORKS ═══════ */}
      <section id="how-it-works" className="relative py-28 px-6" ref={how.ref}>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-900/5 to-transparent pointer-events-none" />
        <div className="max-w-5xl mx-auto relative">
          <div className={`text-center mb-20 transition-all duration-700 ${how.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <p className="inline-flex items-center gap-2 text-blue-400 text-xs font-semibold uppercase tracking-[0.2em] mb-4">
              <span className="w-8 h-px bg-blue-500/50" />How It Works<span className="w-8 h-px bg-blue-500/50" />
            </p>
            <h2 className="text-3xl md:text-5xl font-bold text-white">
              From Upload to Mastery in{" "}
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">4 Steps</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((s, i) => (
              <div
                key={i}
                className={`relative text-center group transition-all duration-600 ${how.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                style={{ transitionDelay: how.visible ? `${i * 120}ms` : "0ms" }}
              >
                {/* connector line (not on last) */}
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-10 left-[60%] w-[80%] h-px bg-gradient-to-r from-slate-700 to-transparent" />
                )}
                <div className="relative w-20 h-20 mx-auto mb-5">
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-slate-800/80 to-slate-900/60 border border-slate-700/50 group-hover:border-purple-500/30 transition-colors duration-300" />
                  <div className="absolute inset-0 flex items-center justify-center text-3xl font-bold bg-gradient-to-br from-purple-400 to-indigo-400 bg-clip-text text-transparent group-hover:scale-110 transition-transform">
                    {s.num}
                  </div>
                </div>
                <h4 className="text-sm font-bold text-white mb-2">{s.title}</h4>
                <p className="text-xs text-gray-500 leading-relaxed max-w-[180px] mx-auto">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ PRICING / PLANS ═══════ */}
      <section id="pricing" className="relative py-28 px-6" ref={pricing.ref}>
        <div className="max-w-5xl mx-auto">
          <div className={`text-center mb-20 transition-all duration-700 ${pricing.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <p className="inline-flex items-center gap-2 text-purple-400 text-xs font-semibold uppercase tracking-[0.2em] mb-4">
              <span className="w-8 h-px bg-purple-500/50" />Pricing<span className="w-8 h-px bg-purple-500/50" />
            </p>
            <h2 className="text-3xl md:text-5xl font-bold text-white">
              Clear & Transparent{" "}
              <span className="bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">Pricing</span>
            </h2>
            <p className="text-gray-400 mt-4 max-w-xl mx-auto">
              Flexible plans designed for students, researchers, and study groups.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {plans.map((p, i) => (
              <div
                key={i}
                className={`relative rounded-2xl p-7 border transition-all duration-500 ${
                  p.highlighted
                    ? "bg-gradient-to-b from-purple-500/10 to-indigo-900/10 border-purple-500/40 shadow-xl shadow-purple-500/10 scale-[1.03]"
                    : "bg-slate-900/40 border-slate-700/40 hover:border-slate-600/60"
                } ${pricing.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                style={{ transitionDelay: pricing.visible ? `${i * 100}ms` : "0ms" }}
              >
                {p.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-[10px] font-bold uppercase tracking-wider">
                    Most Popular
                  </div>
                )}
                <p className="text-sm font-semibold text-white mb-1">{p.name}</p>
                <p className="text-xs text-gray-500 mb-6">{p.tagline}</p>

                <ul className="space-y-3 mb-8">
                  {p.features.map((feat, fi) => (
                    <li key={fi} className="flex items-center gap-2.5 text-sm text-gray-300">
                      <span className={`${p.highlighted ? "text-purple-400" : "text-gray-500"}`}>{Icons.check}</span>
                      {feat}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => navigate("/signup")}
                  className={`w-full py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                    p.highlighted
                      ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/20 hover:shadow-purple-500/30 hover:scale-[1.02]"
                      : "bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10"
                  }`}
                >
                  {p.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ FINAL CTA ═══════ */}
      <section className="py-28 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="relative p-12 rounded-3xl border border-slate-800/60 overflow-hidden" style={{ background: "linear-gradient(135deg, rgba(147,51,234,0.08) 0%, rgba(99,102,241,0.06) 50%, rgba(147,51,234,0.04) 100%)" }}>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent" />
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Study Smarter?
            </h2>
            <p className="text-gray-400 mb-8 max-w-md mx-auto">
              Upload your first document and experience AI-powered learning that adapts to your content.
            </p>
            <button
              onClick={() => navigate("/signup")}
              className="group inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-2xl shadow-xl shadow-purple-500/25 hover:shadow-purple-500/40 hover:scale-105 transition-all duration-300"
            >
              Open Your Notebook
              <span className="group-hover:translate-x-1 transition-transform">{Icons.arrow}</span>
            </button>
          </div>
        </div>
      </section>

      {/* ═══════ FOOTER ═══════ */}
      <footer className="border-t border-slate-800/50 py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-10 mb-10">
            {/* brand */}
            <div className="md:col-span-1">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
                  {Icons.brain}
                </div>
                <span className="font-bold text-white">NoteBar</span>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">
                AI-powered smart notebook that transforms your documents into interactive learning experiences.
              </p>
            </div>

            {/* links */}
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Product</p>
              <ul className="space-y-2">
                {["Features", "How It Works", "Pricing"].map((l) => (
                  <li key={l}><a href={`#${l.toLowerCase().replace(/ /g, "-")}`} className="text-sm text-gray-500 hover:text-white transition-colors">{l}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Technology</p>
              <ul className="space-y-2">
                {["FastAPI", "React + Vite", "ChromaDB", "Groq LLM", "RAG Pipeline"].map((l) => (
                  <li key={l} className="text-sm text-gray-500">{l}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Connect</p>
              <div className="flex items-center gap-3">
                <a href="https://github.com" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-lg bg-slate-800/60 border border-slate-700/50 flex items-center justify-center text-gray-400 hover:text-white hover:border-purple-500/30 transition-all">
                  {Icons.github}
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-800/50 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-gray-600">© {new Date().getFullYear()} NoteBar. All rights reserved.</p>
            <p className="text-xs text-gray-600">Built with ❤️ using RAG, Groq & ChromaDB</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;