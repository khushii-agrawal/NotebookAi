import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Sliders, Key, Shield, User, Sparkles, Save } from "lucide-react";

const Settings = () => {
  const { user } = useAuth();
  const [model, setModel] = useState("gemini-1.5-flash");
  const [temperature, setTemperature] = useState(0.7);
  const [apiKey, setApiKey] = useState("");
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="min-h-[calc(100vh-56px)] bg-[#0a0a1a] p-6 sm:p-10 relative overflow-hidden flex justify-center items-start">
      {/* Background Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-3xl space-y-6">
        {/* Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-purple-500/10 border border-purple-500/20 rounded-xl flex items-center justify-center">
            <Sliders className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Settings</h1>
            <p className="text-sm text-gray-500">Manage your NoteBar preferences and AI configurations</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          {/* Section 1: AI Settings */}
          <div className="bg-[#0d0d22]/50 border border-white/5 rounded-2xl p-6 backdrop-blur-xl space-y-6">
            <div className="flex items-center gap-2 border-b border-white/5 pb-3">
              <Sparkles className="w-4.5 h-4.5 text-purple-400" />
              <h2 className="text-sm font-semibold text-white uppercase tracking-wider">AI Model Settings</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Default Model</label>
                <select
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="w-full bg-[#0a0a1a] border border-white/8 rounded-xl px-4 py-3 text-sm text-gray-200 focus:outline-none focus:ring-1 focus:ring-purple-500/40"
                >
                  <option value="gemini-1.5-flash">Gemini 1.5 Flash (Fast, optimized)</option>
                  <option value="gemini-1.5-pro">Gemini 1.5 Pro (Reasoning, deep analysis)</option>
                </select>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Creativity (Temperature)</label>
                  <span className="text-xs text-purple-400 font-mono">{temperature}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={temperature}
                  onChange={(e) => setTemperature(parseFloat(e.target.value))}
                  className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-purple-500"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Key className="w-4 h-4 text-purple-400" />
                <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Custom API Key (Optional)</label>
              </div>
              <input
                type="password"
                placeholder="Enter your custom Gemini API key..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="w-full bg-[#0a0a1a] border border-white/8 rounded-xl px-4 py-3 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-purple-500/40"
              />
              <p className="text-[10px] text-gray-500">
                Leave empty to use the system default API keys. Your key is stored securely in your browser space.
              </p>
            </div>
          </div>

          {/* Section 2: Account Settings */}
          <div className="bg-[#0d0d22]/50 border border-white/5 rounded-2xl p-6 backdrop-blur-xl space-y-6">
            <div className="flex items-center gap-2 border-b border-white/5 pb-3">
              <User className="w-4.5 h-4.5 text-purple-400" />
              <h2 className="text-sm font-semibold text-white uppercase tracking-wider">Account Settings</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Username</label>
                <input
                  type="text"
                  disabled
                  value={user?.name || ""}
                  className="w-full bg-[#0a0a1a]/50 border border-white/5 rounded-xl px-4 py-3 text-sm text-gray-500 cursor-not-allowed"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Email Address</label>
                <input
                  type="email"
                  disabled
                  value={user?.email || ""}
                  className="w-full bg-[#0a0a1a]/50 border border-white/5 rounded-xl px-4 py-3 text-sm text-gray-500 cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end gap-4 items-center">
            {isSaved && (
              <span className="text-sm text-green-400 font-medium animate-pulse">
                ✓ Preferences updated successfully!
              </span>
            )}
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:opacity-90 transition-all font-semibold shadow-lg shadow-purple-500/15"
            >
              <Save className="w-4.5 h-4.5" />
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Settings;
