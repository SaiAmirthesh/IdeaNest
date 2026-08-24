import { useState } from "react";
import { Link } from "react-router";
import { formatDistanceToNow } from "date-fns";
import { Copy, Check, Pencil, Trash2, Lightbulb, FileText, CornerDownRight } from "lucide-react";
import { toast } from "sonner";
import type { Note } from "@/features/notes/types";
import type { Idea } from "@/features/ideas/types";

interface NoteCardProps {
  note: Note;
  idea?: Idea;
  onEdit?: (note: Note) => void;
  onDelete?: (id: string) => void;
}

export function NoteCard({ note, idea, onEdit, onDelete }: NoteCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(`${note.title}\n\n${note.content}`);
    setCopied(true);
    toast.success("Note copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(`Are you sure you want to delete note "${note.title}"?`)) {
      onDelete?.(note.id);
      toast.success("Note deleted");
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit?.(note);
  };

  // Preview content lines (truncate neatly)
  const contentPreview = note.content.replace(/^[#*>-]+\s*/gm, "");

  return (
    <div
      onClick={() => onEdit?.(note)}
      className="bg-[#0A0A0A] border border-[#262626] rounded-none p-5 flex flex-col justify-between group hover:bg-[#111111] hover:border-[#525252] transition-all duration-200 relative cursor-pointer"
    >
      {/* Top Header */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-2.5">
          <div className="flex items-center gap-2 min-w-0">
            <FileText className="size-3.5 text-accent-gold shrink-0 mt-0.5" />
            <h3 className="text-sm font-semibold text-[#F5F5F5] group-hover:text-white transition-colors truncate">
              {note.title}
            </h3>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-1 shrink-0 opacity-80 sm:opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              type="button"
              onClick={handleCopy}
              className="size-7 rounded-none text-[#737373] hover:text-[#F5F5F5] hover:bg-[#262626]/50 flex items-center justify-center transition-colors cursor-pointer"
              title="Copy note content"
            >
              {copied ? <Check className="size-3.5 text-emerald-400" /> : <Copy className="size-3.5" />}
            </button>
            <button
              type="button"
              onClick={handleEdit}
              className="size-7 rounded-none text-[#737373] hover:text-[#F5F5F5] hover:bg-[#262626]/50 flex items-center justify-center transition-colors cursor-pointer"
              title="Edit note"
            >
              <Pencil className="size-3.5" />
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="size-7 rounded-none text-[#737373] hover:text-red-400 hover:bg-red-950/30 flex items-center justify-center transition-colors cursor-pointer"
              title="Delete note"
            >
              <Trash2 className="size-3.5" />
            </button>
          </div>
        </div>

        {/* Note Body Preview */}
        <p className="text-xs text-[#A3A3A3] line-clamp-4 leading-relaxed font-light whitespace-pre-line mb-4 font-sans">
          {contentPreview}
        </p>
      </div>

      {/* Footer Info & Idea Reference */}
      <div className="border-t border-[#262626]/50 pt-3 flex flex-wrap items-center justify-between gap-2 mt-auto text-[10px]">
        {idea ? (
          <Link
            to={`/app/ideas/${idea.id}`}
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#161616] hover:bg-[#222222] border border-[#262626] text-[#A3A3A3] hover:text-accent-gold transition-colors font-mono truncate max-w-[200px]"
          >
            <Lightbulb className="size-3 text-accent-gold shrink-0" />
            <span className="truncate">{idea.title}</span>
          </Link>
        ) : (
          <span className="inline-flex items-center gap-1 text-[#737373] font-mono">
            <CornerDownRight className="size-3" />
            <span>Standalone Note</span>
          </span>
        )}

        <span className="text-[#737373] font-mono ml-auto">
          {formatDistanceToNow(new Date(note.updatedAt), { addSuffix: true })}
        </span>
      </div>
    </div>
  );
}
