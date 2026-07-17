import { useParams, useNavigate, Link } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "sonner";
import { ArrowLeft, Trash2, History } from "lucide-react";
import type { RootState } from "@/app/store";
import { updateIdea, deleteIdea } from "@/features/ideas/ideaSlice";
import type { IdeaStatus } from "@/features/ideas/types";
import { IdeaStatusBadge } from "@/components/ideas/IdeaStatusBadge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function IdeaDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const idea = useSelector((state: RootState) =>
    state.ideas.ideas.find((i) => i.id === id)
  );

  if (!idea) {
    return (
      <div className="text-center py-20">
        <h2 className="text-lg font-semibold text-[#F5F5F5]">Idea Not Found</h2>
        <p className="text-xs text-[#737373] mt-2">The idea you are looking for does not exist or has been deleted.</p>
        <Link to="/app/ideas" className="mt-4 inline-flex items-center gap-1.5 text-xs text-neutral-400 hover:underline">
          <ArrowLeft className="size-3.5" /> Back to Vault
        </Link>
      </div>
    );
  }

  const handleFieldChange = (field: "title" | "description" | "notes", value: string) => {
    dispatch(updateIdea({ id: idea.id, [field]: value }));
    // In real app, this could auto-save to backend
  };

  const handleStatusChange = (newStatus: IdeaStatus) => {
    dispatch(updateIdea({ id: idea.id, status: newStatus }));
    toast.success(`Lifecycle shifted to ${newStatus}`, {
      description: `"${idea.title}" is now marked as ${newStatus.toLowerCase()}.`,
    });
  };

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this idea? This action is irreversible.")) {
      dispatch(deleteIdea(idea.id));
      toast.success("Idea deleted");
      navigate("/app/ideas");
    }
  };

  // Mock activity logs based on idea dates
  const activityLogs = [
    {
      action: `Status shifted to ${idea.status}`,
      time: idea.updatedAt,
      detail: "Updated by user",
    },
    {
      action: "Brainstorming notes updated",
      time: new Date(new Date(idea.updatedAt).getTime() - 1000 * 60 * 30).toISOString(),
      detail: "Content refinement saved",
    },
    {
      action: "Idea originally captured",
      time: idea.createdAt,
      detail: "Saved to second brain",
    },
  ];

  const statuses: IdeaStatus[] = ["SEED", "THINKING", "BUILDING", "DORMANT", "COMPLETED", "ARCHIVED"];

  return (
    <div className="space-y-6">
      {/* Top Header Actions */}
      <div className="flex items-center justify-between border-b border-[#262626]/40 pb-4">
        <Link
          to="/app/ideas"
          className="inline-flex items-center gap-1.5 text-xs text-[#737373] hover:text-[#F5F5F5] transition-colors"
        >
          <ArrowLeft className="size-3.5" />
          <span>Back to Vault</span>
        </Link>

        <Button
          onClick={handleDelete}
          variant="destructive"
          size="sm"
          className="text-xs h-8 cursor-pointer gap-1.5"
        >
          <Trash2 className="size-3.5" />
          <span>Delete Idea</span>
        </Button>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left Column: Editors */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Editable Title */}
          <div className="space-y-1">
            <input
              type="text"
              value={idea.title}
              onChange={(e) => handleFieldChange("title", e.target.value)}
              className="w-full bg-transparent border-b border-transparent hover:border-[#262626] focus:border-neutral-500 text-xl font-bold text-[#F5F5F5] focus:outline-none pb-1 transition-all"
              placeholder="Idea Title..."
            />
          </div>

          {/* Editable Description */}
          <div className="space-y-1 bg-[#0A0A0A]/40 border border-[#262626] rounded-none p-4">
            <label className="text-[10px] uppercase font-mono tracking-wider text-[#737373] block mb-2">Description</label>
            <Textarea
              value={idea.description}
              onChange={(e) => handleFieldChange("description", e.target.value)}
              className="w-full bg-transparent border-none text-[#F5F5F5] placeholder-[#737373] focus-visible:ring-0 p-0 text-sm min-h-[60px] resize-none"
              placeholder="Describe this concept..."
            />
          </div>

          {/* Editable Notes Segment */}
          <div className="space-y-1 bg-[#0A0A0A]/40 border border-[#262626] rounded-none p-4">
            <div className="flex items-center justify-between mb-3">
              <label className="text-[10px] uppercase font-mono tracking-wider text-[#737373] block">Brainstorming Notes</label>
              <span className="text-[9px] text-neutral-500 font-mono">Auto-saved to store</span>
            </div>
            <Textarea
              value={idea.notes || ""}
              onChange={(e) => handleFieldChange("notes", e.target.value)}
              className="w-full bg-transparent border-none text-[#F5F5F5] placeholder-[#737373]/70 focus-visible:ring-0 p-0 text-sm min-h-[220px] font-sans leading-relaxed"
              placeholder="Expand on this idea... Add checklist items, reference links, specifications, and design notes here."
            />
          </div>
        </div>

        {/* Right Column: Metadata & Lifecycles */}
        <div className="space-y-6">
          
          {/* Status selector card */}
          <div className="bg-[#0A0A0A] border border-[#262626] rounded-none p-5 shadow-lg space-y-4">
            <div>
              <span className="text-[10px] uppercase font-mono tracking-wider text-[#737373]">Current State</span>
              <div className="mt-2">
                <IdeaStatusBadge status={idea.status} className="text-xs px-2.5 py-1" />
              </div>
            </div>

            <div className="border-t border-[#262626] pt-3">
              <span className="text-[10px] uppercase font-mono tracking-wider text-[#737373] block mb-2">Shift Lifecycle</span>
              <div className="grid grid-cols-2 gap-2">
                {statuses.map((s) => (
                  <button
                    key={s}
                    onClick={() => handleStatusChange(s)}
                    className={`py-1.5 px-2 rounded-none text-[10px] font-semibold font-mono border transition-all cursor-pointer ${
                      idea.status === s
                        ? "bg-[#1C1C1C] border-[#525252] text-[#F5F5F5]"
                        : "bg-[#111111] border-[#262626] text-[#737373] hover:border-[#525252] hover:text-[#F5F5F5]"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Info card */}
          <div className="bg-[#0A0A0A] border border-[#262626] rounded-none p-5 shadow-lg space-y-3 text-xs text-[#737373]">
            <div className="flex justify-between items-center">
              <span>Date Created</span>
              <span className="text-[#F5F5F5] font-mono font-medium">
                {new Date(idea.createdAt).toLocaleDateString()}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span>Last Refinement</span>
              <span className="text-[#F5F5F5] font-mono font-medium">
                {new Date(idea.updatedAt).toLocaleDateString()}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span>Idea ID</span>
              <span className="text-[#F5F5F5] font-mono">
                {idea.id}
              </span>
            </div>
          </div>

          {/* Activity Feed */}
          <div className="bg-[#0A0A0A] border border-[#262626] rounded-none p-5 shadow-lg space-y-4">
            <span className="text-[10px] uppercase font-mono tracking-wider text-[#737373] flex items-center gap-1.5">
              <History className="size-3.5" /> Activity Timeline
            </span>

            <div className="space-y-4 relative pl-3 border-l border-[#262626] ml-2.5 pt-1">
              {activityLogs.map((log, idx) => (
                <div key={idx} className="relative space-y-1">
                  {/* Bullet */}
                  <span className="absolute -left-[17px] top-1.5 size-2 rounded-none bg-[#262626] border border-[#0A0A0A] z-10 flex items-center justify-center">
                    <span className="size-1 rounded-none bg-[#737373]" />
                  </span>

                  <span className="text-xs font-semibold text-[#F5F5F5] block leading-none">
                    {log.action}
                  </span>
                  <span className="text-[10px] text-[#737373] font-mono block">
                    {new Date(log.time).toLocaleTimeString()} • {log.detail}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
