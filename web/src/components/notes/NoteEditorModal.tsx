import { useState } from "react";
import { toast } from "sonner";
import { FileText, Save, Trash2 } from "lucide-react";
import type { Note } from "@/features/notes/types";
import { useUpdateNoteMutation, useDeleteNoteMutation } from "@/features/notes/noteApi";
import { useGetIdeasQuery } from "@/features/ideas/ideaApi";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface NoteEditorFormProps {
  note: Note;
  onClose: () => void;
}

function NoteEditorForm({ note, onClose }: NoteEditorFormProps) {
  const [updateNote, { isLoading: isUpdating }] = useUpdateNoteMutation();
  const [deleteNote, { isLoading: isDeleting }] = useDeleteNoteMutation();
  const { data: ideasData } = useGetIdeasQuery({ limit: 100 });
  const ideas = ideasData?.data || [];

  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const [ideaId, setIdeaId] = useState<string | null>(note.ideaId ?? null);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Title cannot be empty");
      return;
    }
    if (!content.trim()) {
      toast.error("Content cannot be empty");
      return;
    }

    try {
      await updateNote({
        id: note.id,
        title: title.trim(),
        content: content.trim(),
        ideaId: ideaId && ideaId !== "NONE" ? ideaId : null,
      }).unwrap();
      toast.success("Note saved successfully");
      onClose();
    } catch {
      toast.error("Failed to save note. Please check connection.");
    }
  };

  const handleDelete = async () => {
    if (confirm(`Are you sure you want to delete "${note.title}"?`)) {
      try {
        await deleteNote(note.id).unwrap();
        toast.success("Note deleted");
        onClose();
      } catch {
        toast.error("Failed to delete note.");
      }
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-4 mt-1">
      {/* Note Title */}
      <div className="space-y-1">
        <label className="text-xs font-medium text-[#737373] block">Note Title</label>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="bg-[#111111] border-[#262626] text-[#F5F5F5] placeholder-[#525252] focus-visible:border-neutral-500 rounded-none text-sm font-semibold h-10"
          placeholder="Note title..."
        />
      </div>

      {/* Associated Idea Selector */}
      <div className="space-y-1">
        <label className="text-xs font-medium text-[#737373] block">Linked Idea</label>
        <select
          value={ideaId || "NONE"}
          onChange={(e) => setIdeaId(e.target.value === "NONE" ? null : e.target.value)}
          className="w-full bg-[#111111] border border-[#262626] text-[#F5F5F5] rounded-none text-xs h-9 px-3 focus:outline-none focus:border-neutral-500 font-sans"
        >
          <option value="NONE" className="bg-[#111111] text-[#737373]">
            -- Standalone Note (No Idea Linked) --
          </option>
          {ideas.map((i) => (
            <option key={i.id} value={i.id} className="bg-[#111111] text-[#F5F5F5]">
              {i.title} ({i.status})
            </option>
          ))}
        </select>
      </div>

      {/* Note Content Editor */}
      <div className="space-y-1">
        <label className="text-xs font-medium text-[#737373] flex items-center justify-between">
          <span>Content & Markdown</span>
          <span className="text-[10px] text-neutral-500 font-mono">
            Updated {new Date(note.updatedAt).toLocaleTimeString()}
          </span>
        </label>
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="bg-[#111111] border-[#262626] text-[#F5F5F5] placeholder-[#525252] focus-visible:border-neutral-500 rounded-none text-xs min-h-[220px] font-sans leading-relaxed resize-y"
          placeholder="Note content..."
        />
      </div>

      {/* Bottom Actions */}
      <div className="flex items-center justify-between gap-3 pt-4 border-t border-[#262626]">
        <Button
          type="button"
          variant="destructive"
          size="sm"
          disabled={isDeleting}
          onClick={handleDelete}
          className="rounded-none text-xs h-9 px-3 cursor-pointer gap-1.5"
        >
          <Trash2 className="size-3.5" />
          <span>{isDeleting ? "Deleting..." : "Delete"}</span>
        </Button>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="bg-transparent border-[#262626] hover:bg-[#111111] text-[#A3A3A3] hover:text-[#F5F5F5] rounded-none text-xs h-9 px-4 cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isUpdating}
            className="bg-[#F5F5F5] hover:bg-[#EAEAEA] text-[#030303] font-semibold rounded-none text-xs h-9 px-5 cursor-pointer shadow-md shadow-white/5 gap-1.5"
          >
            <Save className="size-3.5" />
            <span>{isUpdating ? "Saving..." : "Save Changes"}</span>
          </Button>
        </div>
      </div>
    </form>
  );
}

interface NoteEditorModalProps {
  note: Note | null;
  open: boolean;
  onClose: () => void;
}

export function NoteEditorModal({ note, open, onClose }: NoteEditorModalProps) {
  if (!note) return null;

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-[680px] bg-[#0A0A0A] border border-[#262626] rounded-none p-6 text-[#F5F5F5] shadow-2xl">
        <DialogHeader className="gap-1 mb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="size-4 text-accent-gold" />
              <DialogTitle className="text-base font-bold text-[#F5F5F5] tracking-tight">
                Edit Note
              </DialogTitle>
            </div>
            <span className="text-[10px] text-[#737373] font-mono mr-6">
              ID: {note.id}
            </span>
          </div>
        </DialogHeader>

        <NoteEditorForm key={note.id + note.updatedAt} note={note} onClose={onClose} />
      </DialogContent>
    </Dialog>
  );
}
