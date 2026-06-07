import { BarChart3, BookOpen, BrainCircuit, Award, Calendar, CheckCircle2 } from "lucide-react";

const Statistics = () => {
  // Mock statistics data matching our workspace
  const statsOverview = [
    { label: "Total Notebooks", value: "8", icon: BookOpen, color: "text-purple-400 border-purple-500/20" },
    { label: "Average Quiz Score", value: "82%", icon: Award, color: "text-blue-400 border-blue-500/20" },
    { label: "Mastered Flashcards", value: "14 / 20", icon: BrainCircuit, color: "text-emerald-400 border-emerald-500/20" },
  ];

  const recentActivity = [
    { activity: "Created notebook 'Machine Learning Notes.pdf'", time: "2 hours ago", status: "completed" },
    { activity: "Completed 'Deep Learning Quiz' with 90%", time: "1 day ago", status: "completed" },
    { activity: "Mastered 5 new flashcards", time: "2 days ago", status: "completed" },
    { activity: "Generated Mind Map for 'AI History'", time: "3 days ago", status: "completed" },
  ];

  const toolsPerformance = [
    { name: "Mind Maps Generated", count: 4, limit: 10, color: "bg-violet-500 shadow-violet-500/25" },
    { name: "Quizzes Completed", count: 7, limit: 10, color: "bg-blue-500 shadow-blue-500/25" },
    { name: "Flashcards Studied", count: 18, limit: 30, color: "bg-emerald-500 shadow-emerald-500/25" },
    { name: "Reports Generated", count: 3, limit: 5, color: "bg-amber-500 shadow-amber-500/25" },
  ];

  return (
    <div className="min-h-[calc(100vh-56px)] bg-[#0a0a1a] p-6 sm:p-10 relative overflow-hidden flex justify-center items-start animate-fade-in">
      {/* Background Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-4xl space-y-8">
        {/* Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-purple-500/10 border border-purple-500/20 rounded-xl flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Statistics</h1>
            <p className="text-sm text-gray-500">Overview of your learning progress and workspace metrics</p>
          </div>
        </div>

        {/* Overview Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {statsOverview.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-[#0d0d22]/50 border border-white/5 rounded-2xl p-5 backdrop-blur-xl flex items-center gap-4 hover:scale-[1.01] transition-transform duration-300"
              >
                <div className={`w-12 h-12 rounded-xl bg-white/3 border flex items-center justify-center ${item.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">{item.label}</p>
                  <p className="text-2xl font-bold text-white mt-1">{item.value}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Detailed Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Tool Activities Progress */}
          <div className="bg-[#0d0d22]/50 border border-white/5 rounded-2xl p-6 backdrop-blur-xl space-y-6">
            <h2 className="text-sm font-semibold text-white uppercase tracking-wider border-b border-white/5 pb-3">
              AI Tools Utilization
            </h2>

            <div className="space-y-5">
              {toolsPerformance.map((tool, index) => {
                const percentage = Math.round((tool.count / tool.limit) * 100);
                return (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-gray-300">{tool.name}</span>
                      <span className="text-purple-400 font-mono">
                        {tool.count} / {tool.limit} ({percentage}%)
                      </span>
                    </div>
                    <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden border border-white/5">
                      <div
                        className={`h-full rounded-full transition-all duration-1000 ${tool.color}`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Activity Log */}
          <div className="bg-[#0d0d22]/50 border border-white/5 rounded-2xl p-6 backdrop-blur-xl space-y-6">
            <h2 className="text-sm font-semibold text-white uppercase tracking-wider border-b border-white/5 pb-3">
              Recent Activity
            </h2>

            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex gap-3.5 items-start">
                  <div className="w-5 h-5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-3 h-3" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-300 truncate">{activity.activity}</p>
                    <span className="flex items-center gap-1 text-[10px] text-gray-500 mt-1 font-semibold">
                      <Calendar className="w-3 h-3" />
                      {activity.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistics;
