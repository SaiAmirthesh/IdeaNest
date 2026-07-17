import { Link } from "react-router";
import { formatDistanceToNow } from "date-fns";
import { motion } from "motion/react";
import { ArrowUpRight, Calendar } from "lucide-react";
import type { Idea } from "@/features/ideas/types";
import { IdeaStatusBadge } from "./IdeaStatusBadge";

interface IdeaCardProps {
  idea: Idea;
}

export default function IdeaCard({ idea }: IdeaCardProps) {
  // Gracefully handle date parsing
  const getRelativeTime = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch {
      return "recently";
    }
  };

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="group relative flex flex-col justify-between h-48 p-5 bg-[#0A0A0A] hover:bg-[#111111] border border-[#262626] hover:border-[#525252] rounded-none overflow-hidden transition-all duration-300"
    >
      {/* Background soft glow on card hover */}
      <div className="absolute -inset-px bg-gradient-to-tr from-neutral-500/5 via-transparent to-neutral-500/3 rounded-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      {/* Header Area */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-2">
          <IdeaStatusBadge status={idea.status} />
          <Link
            to={`/app/ideas/${idea.id}`}
            className="opacity-0 group-hover:opacity-100 text-[#737373] hover:text-[#F5F5F5] transition-all flex items-center justify-center size-6 rounded-none bg-[#111111] border border-[#262626]"
          >
            <ArrowUpRight className="size-3.5" />
          </Link>
        </div>
        
        <Link to={`/app/ideas/${idea.id}`} className="block">
          <h3 className="text-sm font-semibold text-[#F5F5F5] group-hover:text-white transition-colors line-clamp-1">
            {idea.title}
          </h3>
        </Link>
        
        <p className="text-xs text-[#737373] line-clamp-2 mt-2 leading-relaxed font-light">
          {idea.description}
        </p>
      </div>

      {/* Footer Area */}
      <div className="flex items-center justify-between text-[10px] text-[#737373] border-t border-[#262626]/60 pt-3 mt-4">
        <span className="flex items-center gap-1">
          <Calendar className="size-3" />
          Updated {getRelativeTime(idea.updatedAt)}
        </span>
        <span className="font-mono text-[9px] uppercase tracking-wider text-[#262626] group-hover:text-neutral-500 transition-colors">
          ID-{idea.id.substring(0, 4)}
        </span>
      </div>
    </motion.div>
  );
}
export { IdeaCard };
