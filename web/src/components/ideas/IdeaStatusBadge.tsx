import type { IdeaStatus } from "@/features/ideas/types";
import { Badge } from "@/components/ui/badge";

interface IdeaStatusBadgeProps {
  status: IdeaStatus;
  className?: string;
}

export default function IdeaStatusBadge({ status, className }: IdeaStatusBadgeProps) {
  // Map statuses to appropriate Tailwind color combinations
  const config: Record<
    IdeaStatus,
    { text: string; bg: string; border: string; dot: string }
  > = {
    SEED: {
      text: "text-lime-400",
      bg: "bg-lime-950/20",
      border: "border-lime-500/20",
      dot: "bg-lime-400 shadow-[0_0_8px_rgba(163,230,53,0.5)]",
    },
    THINKING: {
      text: "text-blue-400",
      bg: "bg-blue-950/20",
      border: "border-blue-500/20",
      dot: "bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.5)]",
    },
    BUILDING: {
      text: "text-amber-400",
      bg: "bg-amber-950/20",
      border: "border-amber-500/20",
      dot: "bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.5)] animate-pulse",
    },
    DORMANT: {
      text: "text-gray-400",
      bg: "bg-gray-900/30",
      border: "border-gray-800/40",
      dot: "bg-gray-500",
    },
    COMPLETED: {
      text: "text-emerald-400",
      bg: "bg-emerald-950/20",
      border: "border-emerald-500/20",
      dot: "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]",
    },
    ARCHIVED: {
      text: "text-zinc-500",
      bg: "bg-zinc-950/25",
      border: "border-zinc-800/30",
      dot: "bg-zinc-600",
    },
  };

  const style = config[status] || config.SEED;

  // Format label for display
  const label = status === "ARCHIVED" ? "Archived" : status.charAt(0) + status.slice(1).toLowerCase();

  return (
    <Badge
      variant="outline"
      className={`flex items-center gap-1.5 px-2 py-0.5 rounded-none border text-[10px] font-semibold tracking-wider uppercase font-mono backdrop-blur-xs select-none ${style.text} ${style.bg} ${style.border} ${className}`}
    >
      <span className={`size-1.5 rounded-none shrink-0 ${style.dot}`}></span>
      <span>{label}</span>
    </Badge>
  );
}
export { IdeaStatusBadge };
