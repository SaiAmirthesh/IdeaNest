import { useNavigate } from "react-router";
import { ExternalLink } from "lucide-react";
import type { Note } from "@/features/notes/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { NoteDocumentEditor } from "./NoteDocumentEditor";
import { Button } from "@/components/ui/button";

interface NoteEditorModalProps {
  note: Note | null;
  open: boolean;
  onClose: () => void;
}

export function NoteEditorModal({ note, open, onClose }: NoteEditorModalProps) {
  const navigate = useNavigate();

  if (!note) return null;

  const handleOpenFullPage = () => {
    onClose();
    navigate(`/app/notes/${note.id}`);
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-[920px] w-[95vw] max-h-[90vh] bg-[#070707] border border-[#262626] rounded-none p-0 text-[#F5F5F5] shadow-2xl overflow-hidden flex flex-col">
        <DialogHeader className="sr-only">
          <DialogTitle>{note.title}</DialogTitle>
        </DialogHeader>

        <div className="flex items-center justify-end px-4 py-2 border-b border-[#262626] bg-[#0A0A0A]">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleOpenFullPage}
            className="text-xs text-accent-gold hover:text-white hover:bg-[#161616] rounded-none h-7 px-2.5 cursor-pointer flex items-center gap-1.5 font-mono"
          >
            <span>Open in Full Page Workspace</span>
            <ExternalLink className="size-3.5" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <NoteDocumentEditor
            key={note.id}
            note={note}
            onBack={onClose}
            onNavigateToNote={(title) => {
              onClose();
              navigate(`/app/notes?search=${encodeURIComponent(title)}`);
            }}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
