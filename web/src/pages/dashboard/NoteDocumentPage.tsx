import { useParams, useNavigate, Link } from "react-router";
import { ArrowLeft, FileText, Plus } from "lucide-react";
import { useGetNoteQuery, useGetNotesQuery } from "@/features/notes/noteApi";
import { NoteDocumentEditor } from "@/components/notes/NoteDocumentEditor";
import { CreateNoteDialog } from "@/components/notes/CreateNoteDialog";
import { Button } from "@/components/ui/button";

export default function NoteDocumentPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: note, isLoading, error } = useGetNoteQuery(id || "", {
    skip: !id,
  });

  const { data: allNotesData } = useGetNotesQuery({ limit: 300 });
  const allNotes = allNotesData?.data || [];

  if (isLoading) {
    return (
      <div className="py-20 text-center font-mono text-xs text-[#737373]">
        Loading document workspace from database...
      </div>
    );
  }

  if (error || !note) {
    return (
      <div className="text-center py-20">
        <FileText className="size-10 text-[#737373] mx-auto mb-3" />
        <h2 className="text-lg font-semibold text-[#F5F5F5]">Document Not Found</h2>
        <p className="text-xs text-[#737373] mt-2">
          This note does not exist or may have been deleted.
        </p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <Link
            to="/app/notes"
            className="inline-flex items-center gap-1.5 text-xs text-neutral-400 hover:underline"
          >
            <ArrowLeft className="size-3.5" /> Back to Notes Archive
          </Link>
          <CreateNoteDialog
            trigger={
              <Button className="bg-[#F5F5F5] hover:bg-[#EAEAEA] text-[#030303] text-xs font-semibold rounded-none px-3 h-8 cursor-pointer">
                <Plus className="size-3.5 mr-1" />
                <span>Create New Note</span>
              </Button>
            }
          />
        </div>
      </div>
    );
  }

  const handleNavigateToNote = (targetTitle: string) => {
    const found = allNotes.find(
      (n) => n.title.trim().toLowerCase() === targetTitle.trim().toLowerCase()
    );
    if (found) {
      navigate(`/app/notes/${found.id}`);
    }
  };

  return (
    <div className="space-y-4 max-w-6xl mx-auto">
      <NoteDocumentEditor
        key={note.id}
        note={note}
        onBack={() => navigate("/app/notes")}
        onNavigateToNote={handleNavigateToNote}
      />
    </div>
  );
}
