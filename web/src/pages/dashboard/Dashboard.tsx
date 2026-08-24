import { useMemo } from "react";
import { Link } from "react-router";
import { formatDistanceToNow } from "date-fns";
import { Network, ArrowRight, Lightbulb, TrendingUp, Sparkles, Plus } from "lucide-react";
import { useGetIdeasQuery } from "@/features/ideas/ideaApi";
import { useGetNotesQuery } from "@/features/notes/noteApi";
import { buildGlobalVaultGraph } from "@/features/graph/graphUtils";
import { KnowledgeGraph } from "@/components/graph/KnowledgeGraph";
import { IdeaStatusBadge } from "@/components/ideas/IdeaStatusBadge";
import { CreateIdeaDialog } from "@/components/ideas/CreateIdeaDialog";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  const { data: ideasData, isLoading: isLoadingIdeas } = useGetIdeasQuery({ limit: 100 });
  const { data: notesData } = useGetNotesQuery({ limit: 100 });

  const ideas = useMemo(() => ideasData?.data || [], [ideasData]);
  const notes = useMemo(() => notesData?.data || [], [notesData]);

  // Derive stats
  const totalCount = ideas.length;
  const totalNotesCount = notes.length;
  const buildingCount = ideas.filter((i) => i.status === "BUILDING").length;
  const completedCount = ideas.filter((i) => i.status === "COMPLETED").length;
  const dormantCount = ideas.filter((i) => i.status === "DORMANT").length;
  const seedCount = ideas.filter((i) => i.status === "SEED").length;
  const thinkingCount = ideas.filter((i) => i.status === "THINKING").length;

  // Build live global vault graph
  const vaultGraphData = useMemo(() => {
    return buildGlobalVaultGraph(ideas, notes);
  }, [ideas, notes]);

  // Recent ideas: take top 4
  const recentIdeas = [...ideas]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 4);

  // Compute ratio of Completed + Building to total for the circular dial
  const progressiveCount = completedCount + buildingCount;
  const progressionPercentage =
    totalCount > 0 ? Math.round((progressiveCount / totalCount) * 100) : 0;

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
        <div className="flex items-center gap-3">
          <CreateIdeaDialog
            trigger={
              <Button className="bg-[#F5F5F5] hover:bg-[#EAEAEA] text-[#030303] font-semibold text-xs h-8 px-3 rounded-none shadow-sm cursor-pointer flex items-center gap-1.5">
                <Plus className="size-3.5" />
                <span>Capture Idea</span>
              </Button>
            }
          />
          <div className="flex items-center gap-2 text-xs bg-[#111111] border border-[#262626] rounded-none px-3 py-1.5 text-[#F5F5F5] font-medium">
            <Sparkles className="size-3.5 animate-pulse text-accent-gold" />
            <span>Database Synced</span>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Total Ideas",
            val: totalCount,
            change: `${totalNotesCount} notes attached`,
            color: "text-[#F5F5F5]",
          },
          {
            label: "Active Building",
            val: buildingCount,
            change: "In Progress",
            color: "text-amber-400",
          },
          {
            label: "Completed",
            val: completedCount,
            change: "Finished Vault",
            color: "text-emerald-400",
          },
          {
            label: "Dormant",
            val: dormantCount,
            change: "Archived / Resting",
            color: "text-gray-400",
          },
        ].map((stat, idx) => (
          <div
            key={idx}
            className="bg-[#0A0A0A] border border-[#262626] rounded-none p-5 flex flex-col justify-between h-28 relative overflow-hidden group hover:bg-[#111111] hover:border-[#525252] transition-all duration-300"
          >
            <div className="absolute top-0 right-0 size-16 bg-gradient-to-bl from-neutral-500/2 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <span className="text-[10px] uppercase font-mono tracking-wider text-[#737373]">
              {stat.label}
            </span>
            <div className="flex items-baseline justify-between mt-auto">
              <span className={`text-2xl sm:text-3xl font-bold tracking-tight ${stat.color}`}>
                {stat.val}
              </span>
              <span className="text-[10px] text-[#737373]/80 font-mono">{stat.change}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Analytics Visualization Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Step-progression Dial Widget */}
        <div className="bg-[#0A0A0A] border border-[#262626] rounded-none p-6 flex flex-col justify-between h-64 relative overflow-hidden group hover:bg-[#111111] hover:border-[#525252] transition-all">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-1.5">
              <TrendingUp className="size-4 text-neutral-400" />
              <span className="text-xs font-semibold text-[#F5F5F5]">Progression Index</span>
            </div>
            <span className="text-[9px] font-mono bg-[#111111] text-[#737373] border border-[#262626] px-1.5 py-0.5 rounded-none uppercase">
              Refinement
            </span>
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
              <span className="text-2xl font-bold tracking-tight text-[#F5F5F5]">
                {progressionPercentage}%
              </span>
              <span className="text-[9px] text-[#737373] font-semibold uppercase tracking-wider">
                Refined
              </span>
            </div>
          </div>

          <div className="flex justify-between items-center text-[10px] text-[#737373] border-t border-[#262626]/60 pt-3">
            <span>
              {progressiveCount} of {totalCount} active/done
            </span>
            <span className="font-mono text-neutral-400 font-medium">Neon Postgres</span>
          </div>
        </div>

        {/* Ideas Labyrinth Chart Widget */}
        <div className="bg-[#0A0A0A] border border-[#262626] rounded-none p-6 flex flex-col justify-between h-64 relative overflow-hidden group hover:bg-[#111111] hover:border-[#525252] transition-all">
          <div>
            <span className="text-xs font-semibold text-[#F5F5F5]">Labyrinth Distribution</span>
            <p className="text-[10px] text-[#737373] mt-0.5">Idea lifecycle category spread</p>
          </div>

          {/* SVG Bar Chart */}
          <div className="h-28 flex items-end justify-between px-2 gap-4 mt-2">
            {[
              { label: "Seed", count: seedCount, color: "var(--status-seed)" },
              { label: "Think", count: thinkingCount, color: "var(--status-thinking)" },
              { label: "Build", count: buildingCount, color: "var(--status-building)" },
              { label: "Done", count: completedCount, color: "var(--status-completed)" },
            ].map((bar, idx) => {
              const maxCount = Math.max(1, seedCount, thinkingCount, buildingCount, completedCount);
              const heightPct = Math.max(8, Math.round((bar.count / maxCount) * 80));

              return (
                <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group/bar">
                  <span className="text-[9px] font-mono text-[#F5F5F5] opacity-0 group-hover/bar:opacity-100 transition-opacity mb-1">
                    {bar.count}
                  </span>
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
            <span>Total Entities Managed</span>
            <span className="font-mono text-emerald-400">{totalCount + totalNotesCount}</span>
          </div>
        </div>

        {/* Live Vault Knowledge Graph Preview */}
        <div className="bg-[#0A0A0A] border border-[#262626] rounded-none p-5 flex flex-col justify-between h-64 relative overflow-hidden group hover:border-[#525252] transition-all">
          <div className="flex items-center justify-between z-10">
            <div className="flex items-center gap-1.5">
              <Network className="size-4 text-accent-gold" />
              <span className="text-xs font-semibold text-[#F5F5F5]">Vault Synaptic Graph</span>
            </div>
            <Link
              to="/app/graph"
              className="text-[10px] font-mono text-accent-gold hover:underline flex items-center gap-1"
            >
              <span>Explore Full</span>
              <ArrowRight className="size-3" />
            </Link>
          </div>

          {/* Interactive Graph Canvas Preview */}
          <div className="h-32 w-full my-1 border border-[#262626]/50 bg-[#070707] relative overflow-hidden">
            <KnowledgeGraph
              data={vaultGraphData}
              height="100%"
              showControls={false}
            />
          </div>

          <div className="flex justify-between items-center text-[10px] text-[#737373] border-t border-[#262626]/60 pt-2 z-10">
            <span>
              {vaultGraphData.nodes.length} Nodes • {vaultGraphData.links.length} Links
            </span>
            <span className="font-mono text-accent-gold">
              {vaultGraphData.tags.length} Tag Clusters
            </span>
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

        {isLoadingIdeas ? (
          <div className="py-10 text-center text-xs text-[#737373] font-mono">
            Loading your thoughts from database...
          </div>
        ) : recentIdeas.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 border border-dashed border-[#262626] rounded-none bg-[#111111]/10">
            <p className="text-xs text-[#737373] mb-3">No ideas captured yet.</p>
            <CreateIdeaDialog
              trigger={
                <Button className="bg-[#F5F5F5] hover:bg-[#EAEAEA] text-[#030303] text-xs font-semibold rounded-none px-3 h-8 cursor-pointer">
                  <Plus className="size-3.5 mr-1" />
                  <span>Capture Your First Idea</span>
                </Button>
              }
            />
          </div>
        ) : (
          <div className="divide-y divide-[#262626]/60">
            {recentIdeas.map((idea) => (
              <div
                key={idea.id}
                className="py-4 first:pt-0 last:pb-0 flex items-center justify-between gap-4"
              >
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
