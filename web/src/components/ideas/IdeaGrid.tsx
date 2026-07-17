import { motion } from "motion/react";
import type { Idea } from "@/features/ideas/types";
import { IdeaCard } from "./IdeaCard";

interface IdeaGridProps {
  ideas: Idea[];
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 260, damping: 25 } },
};

export default function IdeaGrid({ ideas }: IdeaGridProps) {
  if (ideas.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 border border-dashed border-[#262626] rounded-none bg-[#0A0A0A]/50">
        <p className="text-sm text-[#737373] font-medium">No ideas found</p>
        <p className="text-xs text-[#737373]/80 mt-1">Try adjusting your filters or capture a new idea.</p>
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {ideas.map((idea) => (
        <motion.div key={idea.id} variants={itemVariants}>
          <IdeaCard idea={idea} />
        </motion.div>
      ))}
    </motion.div>
  );
}
export { IdeaGrid };
