import { useAuth } from "../context/AuthContext";
import { User, Mail, Shield, BookOpen, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="min-h-[calc(100vh-56px)] bg-[#0a0a1a] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-2xl bg-[#0d0d22]/50 border border-white/5 rounded-3xl shadow-2xl p-8 backdrop-blur-xl">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row items-center gap-6 pb-8 border-b border-white/5">
          <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-3xl flex items-center justify-center shadow-xl shadow-purple-500/20 text-white text-3xl font-bold border border-white/10 shrink-0">
            {user?.name ? getInitials(user.name) : "?"}
          </div>
          <div className="text-center sm:text-left min-w-0 flex-1">
            <h1 className="text-2xl font-bold text-white truncate">
              {user?.name || "Guest User"}
            </h1>
            <p className="text-sm text-purple-400 font-medium mt-1">
              NoteBar Member
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-red-500/20 bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all text-sm font-medium"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>

        {/* User Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-8">
          <div className="space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">
              Personal Information
            </h2>
            <div className="flex items-center gap-3.5 p-3 rounded-xl bg-white/3 border border-white/5 text-gray-300">
              <User className="w-4 h-4 text-purple-400 shrink-0" />
              <div className="min-w-0">
                <p className="text-[10px] text-gray-500 uppercase tracking-wider">Full Name</p>
                <p className="text-sm font-semibold truncate">{user?.name || "N/A"}</p>
              </div>
            </div>
            <div className="flex items-center gap-3.5 p-3 rounded-xl bg-white/3 border border-white/5 text-gray-300">
              <Mail className="w-4 h-4 text-purple-400 shrink-0" />
              <div className="min-w-0">
                <p className="text-[10px] text-gray-500 uppercase tracking-wider">Email Address</p>
                <p className="text-sm font-semibold truncate">{user?.email || "N/A"}</p>
              </div>
            </div>
            <div className="flex items-center gap-3.5 p-3 rounded-xl bg-white/3 border border-white/5 text-gray-300">
              <Shield className="w-4 h-4 text-purple-400 shrink-0" />
              <div className="min-w-0">
                <p className="text-[10px] text-gray-500 uppercase tracking-wider">Account ID</p>
                <p className="text-xs font-mono truncate">{user?.user_id || "N/A"}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">
              Workspace Overview
            </h2>
            <div className="flex items-center gap-3.5 p-4 rounded-xl bg-gradient-to-r from-purple-500/5 to-indigo-500/5 border border-purple-500/10 text-gray-300">
              <BookOpen className="w-6 h-6 text-purple-400 shrink-0" />
              <div>
                <p className="text-[10px] text-gray-500 uppercase tracking-wider">NoteBar AI Status</p>
                <p className="text-sm font-semibold text-white">Active subscription</p>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-[#0a0a1a]/60 border border-white/5">
              <p className="text-xs text-gray-400 leading-relaxed">
                Welcome to NoteBar, your intelligent note-taking assistant. Leverage AI summaries, interactive quizzes, flashcards, mind maps, and detailed reports to accelerate your learning.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;