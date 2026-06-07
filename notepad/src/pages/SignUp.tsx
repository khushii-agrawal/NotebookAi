import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const inputClass =
  "w-full pl-10 pr-4 py-3 bg-white/5 border border-white/8 rounded-xl text-white text-sm placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:border-purple-500/40 transition-all";

const SignUp = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password !== confirmPassword) { setError("Passwords do not match"); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters"); return; }
    setLoading(true);
    try {
      const res = await fetch("http://127.0.0.1:8000/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || "Signup failed");
      }
      const user = await res.json();
      login(user);
      navigate("/notebooks");
    } catch (err: any) {
      setError(err.message || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a1a] flex relative overflow-hidden">

      {/* ── LEFT PANEL ── */}
      <div className="hidden lg:flex flex-col justify-between w-[42%] relative p-12 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-[15%] left-[5%] w-[420px] h-[420px] bg-indigo-600/10 rounded-full blur-[140px]" />
          <div className="absolute bottom-[10%] right-[0%] w-[320px] h-[320px] bg-purple-600/10 rounded-full blur-[120px]" />
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.15) 1px, transparent 1px)", backgroundSize: "55px 55px" }} />
        </div>

        {/* Brand */}
        <button onClick={() => navigate("/")} className="relative z-10 flex items-center gap-2.5 w-fit hover:opacity-80 transition-opacity">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/25">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <span className="text-lg font-bold text-white">NoteBar</span>
        </button>

        {/* Hero content */}
        <div className="relative z-10">
          <p className="text-purple-400 text-xs font-semibold uppercase tracking-widest mb-4">Get Started Today</p>
          <h2 className="text-4xl font-extrabold text-white leading-tight mb-5">
            Start Learning
            <br />
            <span className="bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
              10x Faster
            </span>
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed max-w-sm mb-10">
            Join thousands of students and researchers who turn their documents into interactive AI-powered knowledge systems.
          </p>

          {/* Steps */}
          <div className="space-y-4">
            {[
              { step: "01", title: "Upload your document", desc: "PDF, DOCX or TXT" },
              { step: "02", title: "AI processes everything", desc: "Chunking, embedding & indexing" },
              { step: "03", title: "Explore & learn", desc: "Chat, quiz, mindmap & reports" },
            ].map((s) => (
              <div key={s.step} className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-lg bg-purple-500/15 border border-purple-500/20 flex items-center justify-center shrink-0">
                  <span className="text-xs font-bold text-purple-400">{s.step}</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{s.title}</p>
                  <p className="text-xs text-gray-500">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="relative z-10 text-xs text-gray-600">Free to get started · No credit card required</p>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div className="flex-1 flex items-center justify-center px-6 py-10 relative">
        <div className="lg:hidden absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 right-1/3 w-[350px] h-[350px] bg-purple-600/8 rounded-full blur-[120px]" />
        </div>

        <div className="relative z-10 w-full max-w-md">

          {/* Mobile brand */}
          <button onClick={() => navigate("/")} className="lg:hidden flex items-center gap-2.5 mb-8 hover:opacity-80 transition-opacity">
            <div className="w-9 h-9 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <span className="text-base font-bold text-white">NoteBar</span>
          </button>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-white mb-1">Create your account</h1>
            <p className="text-sm text-gray-500">Start your AI-powered learning journey</p>
          </div>

          {/* Card */}
          <div className="rounded-2xl p-8 border border-white/6 glass">

            {error && (
              <div className="mb-5 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2.5 animate-fade-slide">
                <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Full Name</label>
                <div className="relative">
                  <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Your full name" className={inputClass} />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Email</label>
                <div className="relative">
                  <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className={inputClass} />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Password</label>
                <div className="relative">
                  <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <input type={showPassword ? "text" : "password"} required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 6 characters" className={`${inputClass} pr-12`} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors">
                    {showPassword
                      ? <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" /></svg>
                      : <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                    }
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Confirm Password</label>
                <div className="relative">
                  <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <input type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm your password" className={inputClass} />
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3.5 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 mt-2 ${
                  loading
                    ? "bg-purple-600/40 text-purple-300 cursor-not-allowed"
                    : "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/20 hover:shadow-purple-500/35 hover:scale-[1.02]"
                }`}
              >
                {loading ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Creating account...
                  </>
                ) : (
                  "Create Account →"
                )}
              </button>
            </form>

            <div className="flex items-center gap-3 my-6">
              <div className="flex-1 h-px bg-white/6" />
              <span className="text-xs text-gray-600">or</span>
              <div className="flex-1 h-px bg-white/6" />
            </div>

            <p className="text-center text-sm text-gray-500">
              Already have an account?{" "}
              <Link to="/login" className="text-purple-400 font-medium hover:text-purple-300 transition-colors">
                Sign in
              </Link>
            </p>
          </div>

          <p className="text-center mt-6">
            <button onClick={() => navigate("/")} className="text-xs text-gray-600 hover:text-gray-400 transition-colors">
              ← Back to Home
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
