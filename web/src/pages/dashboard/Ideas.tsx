import { useState } from "react";
import { Search, Plus, Lightbulb } from "lucide-react";
import { useGetIdeasQuery } from "@/features/ideas/ideaApi";
import type { IdeaStatus } from "@/features/ideas/types";
import { IdeaGrid } from "@/components/ideas/IdeaGrid";
import { CreateIdeaDialog } from "@/components/ideas/CreateIdeaDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Ideas() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<IdeaStatus | "ALL">("ALL");

  const { data: ideasData, isLoading } = useGetIdeasQuery({ limit: 100 });
  const ideas = ideasData?.data || [];

  // Parse filters
  const filteredIdeas = ideas.filter((idea) => {
    const matchesSearch =
      idea.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      idea.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || idea.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statuses: (IdeaStatus | "ALL")[] = [
    "ALL",
    "SEED",
    "THINKING",
    "BUILDING",
    "DORMANT",
    "COMPLETED",
    "ARCHIVED",
  ];

  return (
    <div className="space-y-6">
      {/* Top Filter and Actions Row */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-[#F5F5F5]">Ideas Vault</h1>
          <p className="text-xs text-[#737373] mt-1">
            Search, filter, and track ideas across their lifecycles.
          </p>
        </div>

        {/* Create Dialog Shortcut */}
        <CreateIdeaDialog
          trigger={
            <Button className="bg-[#F5F5F5] hover:bg-[#EAEAEA] text-[#030303] font-semibold rounded-none px-4 h-9 text-xs shadow-md shadow-white/5 cursor-pointer flex items-center gap-1.5 self-end sm:self-auto">
              <Plus className="size-4" />
              <span>Capture Idea</span>
            </Button>
          }
        />
      </div>

      {/* Search and Filters Segment */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between bg-[#0A0A0A] border border-[#262626] rounded-none p-4 shadow-md">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[#737373]" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by title or description..."
            className="pl-9 bg-[#111111] border-[#262626] text-[#F5F5F5] placeholder-[#737373]/80 focus-visible:border-neutral-500 rounded-none text-xs"
          />
        </div>

        {/* Status Scrollable Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {statuses.map((status) => {
            const isActive = statusFilter === status;
            const count =
              status === "ALL" ? ideas.length : ideas.filter((i) => i.status === status).length;

            return (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 rounded-none text-xs font-medium border font-mono transition-all uppercase whitespace-nowrap cursor-pointer ${
                  isActive
                    ? "bg-[#1C1C1C] border-[#525252] text-[#F5F5F5] shadow-md shadow-white/5"
                    : "bg-[#111111] border-[#262626] text-[#737373] hover:border-[#525252] hover:text-[#F5F5F5]"
                }`}
              >
                <span>{status === "ALL" ? "ALL" : status}</span>
                <span
                  className={`ml-1.5 px-1 py-0.2 rounded-none text-[10px] ${
                    isActive ? "bg-[#262626] text-[#F5F5F5]" : "bg-[#262626]/40 text-[#737373]"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid listing */}
      {isLoading ? (
        <div className="py-16 text-center text-xs text-[#737373] font-mono">
          Loading ideas from database...
        </div>
      ) : filteredIdeas.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 border border-dashed border-[#262626] rounded-none bg-[#111111]/10 text-center p-6">
          <Lightbulb className="size-8 text-[#737373] mb-3" />
          <h3 className="text-sm font-semibold text-[#F5F5F5]">No Ideas in this View</h3>
          <p className="text-xs text-[#737373] max-w-sm mt-1 mb-4 leading-relaxed">
            {searchTerm
              ? `No ideas matching "${searchTerm}". Try adjusting your search keyword.`
              : "Capture thoughts, startup ideas, or research concepts into your permanent library."}
          </p>
          <CreateIdeaDialog
            trigger={
              <Button className="bg-[#F5F5F5] hover:bg-[#EAEAEA] text-[#030303] text-xs font-semibold rounded-none px-4 h-8 cursor-pointer">
                <Plus className="size-3.5 mr-1" />
                <span>Capture New Idea</span>
              </Button>
            }
          />
        </div>
      ) : (
        <div className="pt-2">
          <IdeaGrid ideas={filteredIdeas} />
        </div>
      )}
    </div>
  );
}
