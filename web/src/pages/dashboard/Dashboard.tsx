import { useSelector } from "react-redux";
import { Link } from "react-router";
import { formatDistanceToNow } from "date-fns";
import { Brain, ArrowRight, Lightbulb, TrendingUp, Sparkles } from "lucide-react";
import type { RootState } from "@/app/store";
import { IdeaStatusBadge } from "@/components/ideas/IdeaStatusBadge";

export default function Dashboard() {
  const ideas = useSelector((state: RootState) => state.ideas.ideas);

  // Derive stats
  const totalCount = ideas.length;
  const buildingCount = ideas.filter((i) => i.status === "BUILDING").length;
  const completedCount = ideas.filter((i) => i.status === "COMPLETED").length;
  const dormantCount = ideas.filter((i) => i.status === "DORMANT").length;

  // Recent ideas: take top 3
  const recentIdeas = [...ideas]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 3);

  // Compute ratio of Completed + Building to total for the circular dial
  const progressiveCount = completedCount + buildingCount;
  const progressionPercentage = totalCount > 0 ? Math.round((progressiveCount / totalCount) * 100) : 0;
  
  // SVG Stroke variables
  const radius = 46;
  const circumference = 2 * Math.PI * radius; // ~289
  const strokeOffset = circumference - (progressionPercentage / 100) * circumference;

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-[#F5F5F5]">Dashboard Overview</h1>
          <p className="text-xs text-[#737373] mt-1">
            Analyze the status, connection, and progression of your cognitive second-brain.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs bg-[#111111] border border-[#262626] rounded-none px-3 py-1.5 text-[#F5F5F5] font-medium">
          <Sparkles className="size-3.5 animate-pulse" />
          <span>Cognitive Engine Active</span>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Ideas", val: totalCount, change: "+3 this week", color: "text-[#F5F5F5]" },
          { label: "Active Building", val: buildingCount, change: "Amber Lifecycle", color: "text-amber-400" },
          { label: "Completed", val: completedCount, change: "Emerald Lifecycle", color: "text-emerald-400" },
          { label: "Dormant", val: dormantCount, change: "Gray Lifecycle", color: "text-gray-400" },
        ].map((stat, idx) => (
          <div
            key={idx}
            className="bg-[#0A0A0A] border border-[#262626] rounded-none p-5 flex flex-col justify-between h-28 relative overflow-hidden group hover:bg-[#111111] hover:border-[#525252] transition-all duration-300"
          >
            <div className="absolute top-0 right-0 size-16 bg-gradient-to-bl from-neutral-500/2 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <span className="text-[10px] uppercase font-mono tracking-wider text-[#737373]">{stat.label}</span>
            <div className="flex items-baseline justify-between mt-auto">
              <span className={`text-2xl sm:text-3xl font-bold tracking-tight ${stat.color}`}>{stat.val}</span>
              <span className="text-[10px] text-[#737373]/80 font-mono">{stat.change}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Analytics Visualization Section (Inspired by reference widgets) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Step-progression Dial Widget (Bottom-left/top-right reference) */}
        <div className="bg-[#0A0A0A] border border-[#262626] rounded-none p-6 flex flex-col justify-between h-64 relative overflow-hidden group hover:bg-[#111111] hover:border-[#525252] transition-all">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-1.5">
              <TrendingUp className="size-4 text-neutral-400" />
              <span className="text-xs font-semibold text-[#F5F5F5]">Progression Index</span>
            </div>
            <span className="text-[9px] font-mono bg-[#111111] text-[#737373] border border-[#262626] px-1.5 py-0.5 rounded-none uppercase">Step 01</span>
          </div>

          <div className="relative size-32 mx-auto my-3 flex items-center justify-center">
            {/* SVG Ring Dial */}
            <svg className="size-full transform -rotate-90">
              <circle cx="64" cy="64" r={radius} fill="transparent" stroke="#161616" strokeWidth="6" />
              <circle
                cx="64"
                cy="64"
                r={radius}
                fill="transparent"
                stroke="url(#dial-gradient)"
                strokeWidth="6"
                strokeDasharray={circumference}
                strokeDashoffset={strokeOffset}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
              <defs>
                <linearGradient id="dial-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#C9A961" />
                  <stop offset="100%" stopColor="#8A7340" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="text-2xl font-bold tracking-tight text-[#F5F5F5]">{progressionPercentage}%</span>
              <span className="text-[9px] text-[#737373] font-semibold uppercase tracking-wider">Refined</span>
            </div>
          </div>

          <div className="flex justify-between items-center text-[10px] text-[#737373] border-t border-[#262626]/60 pt-3">
            <span>{progressiveCount} of {totalCount} active/done</span>
            <span className="font-mono text-neutral-400 font-medium">Target 2026</span>
          </div>
        </div>

        {/* Ideas Labyrinth Chart Widget (Top-right DeFi Space reference) */}
        <div className="bg-[#0A0A0A] border border-[#262626] rounded-none p-6 flex flex-col justify-between h-64 relative overflow-hidden group hover:bg-[#111111] hover:border-[#525252] transition-all">
          <div>
            <span className="text-xs font-semibold text-[#F5F5F5]">Labyrinth Opportunities</span>
            <p className="text-[10px] text-[#737373] mt-0.5">Idea velocity distribution by lifecycle category</p>
          </div>

          {/* SVG Bar Chart */}
          <div className="h-28 flex items-end justify-between px-2 gap-4 mt-2">
            {[
              { label: "Seed", count: ideas.filter(i => i.status === "SEED").length, color: "var(--status-seed)" },
              { label: "Think", count: ideas.filter(i => i.status === "THINKING").length, color: "var(--status-thinking)" },
              { label: "Build", count: ideas.filter(i => i.status === "BUILDING").length, color: "var(--status-building)" },
              { label: "Done", count: completedCount, color: "var(--status-completed)" },
            ].map((bar, idx) => {
              // Calculate relative height: max is 5, scale to percent. If 0, show a small stub.
              const maxCount = Math.max(...[1, ideas.filter(i => i.status === "SEED").length, ideas.filter(i => i.status === "THINKING").length, buildingCount, completedCount]);
              const heightPct = Math.max(8, Math.round((bar.count / maxCount) * 80));

              return (
                <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group/bar">
                  <span className="text-[9px] font-mono text-[#F5F5F5] opacity-0 group-hover/bar:opacity-100 transition-opacity mb-1">{bar.count}</span>
                  <div
                    style={{ height: `${heightPct}%`, backgroundColor: bar.color }}
                    className="w-full rounded-none transition-all duration-700 ease-out"
                  />
                  <span className="text-[9px] text-[#737373] mt-2 font-mono">{bar.label}</span>
                </div>
              );
            })}
          </div>

          <div className="flex justify-between items-center text-[10px] text-[#737373] border-t border-[#262626]/60 pt-3">
            <span>Palette Growth Opportunities</span>
            <span className="font-mono text-emerald-400">+4.2% MoM</span>
          </div>
        </div>

        {/* Brain Connections / Network Mock Widget */}
        <div className="bg-[#0A0A0A] border border-[#262626] rounded-none p-6 flex flex-col justify-between h-64 relative overflow-hidden group hover:bg-[#111111] hover:border-[#525252] transition-all">
          <div className="flex items-center gap-1.5">
            <Brain className="size-4 text-neutral-400" />
            <span className="text-xs font-semibold text-[#F5F5F5]">Knowledge Synapses</span>
          </div>

          {/* Minimal network graphic representation */}
          <div className="h-28 w-full relative flex items-center justify-center">
            <div className="absolute size-20 rounded-none border border-dashed border-[#262626] animate-[spin_20s_linear_infinite]" />
            <div className="absolute size-28 rounded-none border border-dashed border-[#262626]/60 animate-[spin_40s_linear_infinite_reverse]" />
            
            {/* Center Node */}
            <div className="size-5 rounded-none bg-[#111111] border border-neutral-500 flex items-center justify-center shadow-lg shadow-white/2 z-10">
              <span className="size-1.5 rounded-none bg-neutral-400 animate-pulse" />
            </div>

            {/* Satellite Nodes - Using neutral and gold accents instead of decorative saturated colors */}
            <div className="absolute top-4 left-12 size-3 rounded-none bg-[#111111] border border-neutral-700 flex items-center justify-center"><span className="size-1 rounded-none bg-neutral-600" /></div>
            <div className="absolute bottom-6 right-16 size-3.5 rounded-none bg-[#111111] border border-accent-gold-dim flex items-center justify-center"><span className="size-1 rounded-none bg-accent-gold" /></div>
            <div className="absolute top-12 right-12 size-2.5 rounded-none bg-[#111111] border border-neutral-700 flex items-center justify-center"><span className="size-1 rounded-none bg-neutral-600" /></div>
          </div>

          <div className="flex justify-between items-center text-[10px] text-[#737373] border-t border-[#262626]/60 pt-3">
            <span>Synaptic Density: High</span>
            <span className="text-neutral-500 font-semibold font-mono">1.2k Nodes</span>
          </div>
        </div>
      </div>

      {/* Recent Ideas Section */}
      <div className="bg-[#0A0A0A] border border-[#262626] rounded-none p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Lightbulb className="size-4 text-neutral-400" />
            <h2 className="text-sm font-semibold text-[#F5F5F5]">Recent Refinements</h2>
          </div>
          <Link
            to="/app/ideas"
            className="text-xs text-[#737373] hover:text-[#F5F5F5] transition-colors flex items-center gap-1.5 group font-medium"
          >
            <span>View all ideas</span>
            <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        {recentIdeas.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 border border-dashed border-[#262626] rounded-none bg-[#111111]/10">
            <p className="text-xs text-[#737373]">No ideas captured yet.</p>
          </div>
        ) : (
          <div className="divide-y divide-[#262626]/60">
            {recentIdeas.map((idea) => (
              <div key={idea.id} className="py-4 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <Link to={`/app/ideas/${idea.id}`} className="block">
                    <h3 className="text-xs font-semibold text-[#F5F5F5] hover:text-white transition-colors truncate">
                      {idea.title}
                    </h3>
                  </Link>
                  <p className="text-xs text-[#737373] mt-1 truncate max-w-xl font-light">
                    {idea.description}
                  </p>
                </div>
                <div className="flex items-center gap-4 shrink-0">
                  <IdeaStatusBadge status={idea.status} />
                  <span className="text-[10px] text-[#737373] font-mono hidden sm:inline">
                    {formatDistanceToNow(new Date(idea.updatedAt), { addSuffix: true })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
