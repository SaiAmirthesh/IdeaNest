import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { toast } from "sonner";
import {
  ArrowLeft,
  Trash2,
  History,
  Plus,
  FileText,
  Save,
} from "lucide-react";
import {
  useGetIdeaQuery,
  useUpdateIdeaMutation,
  useDeleteIdeaMutation,
} from "@/features/ideas/ideaApi";
import { useGetNotesQuery, useDeleteNoteMutation } from "@/features/notes/noteApi";
import type { IdeaStatus } from "@/features/ideas/types";
import type { Note } from "@/features/notes/types";
import { IdeaStatusBadge } from "@/components/ideas/IdeaStatusBadge";
import { NoteCard } from "@/components/notes/NoteCard";
import { CreateNoteDialog } from "@/components/notes/CreateNoteDialog";
import { NoteEditorModal } from "@/components/notes/NoteEditorModal";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function IdeaDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [localTitle, setLocalTitle] = useState("");
  const [localDescription, setLocalDescription] = useState("");
  const [hasChanges, setHasChanges] = useState(false);

  const { data: idea, isLoading: isLoadingIdea, error: ideaError } = useGetIdeaQuery(id || "", {
    skip: !id,
  });

  const { data: notesData, isLoading: isLoadingNotes } = useGetNotesQuery(
    id ? { ideaId: id } : undefined,
    { skip: !id }
  );

  const [updateIdea, { isLoading: isUpdatingIdea }] = useUpdateIdeaMutation();
  const [deleteIdea, { isLoading: isDeletingIdea }] = useDeleteIdeaMutation();
  const [deleteNote] = useDeleteNoteMutation();

  const notes = notesData?.data || [];

  useEffect(() => {
    if (idea) {
      setLocalTitle(idea.title);
      setLocalDescription(idea.description);
      setHasChanges(false);
    }
  }, [idea]);

  if (isLoadingIdea) {
    return (
      <div className="text-center py-20 font-mono text-xs text-[#737373]">
        Loading idea details from database...
      </div>
    );
  }

  if (ideaError || !idea) {
    return (
      <div className="text-center py-20">
        <h2 className="text-lg font-semibold text-[#F5F5F5]">Idea Not Found</h2>
        <p className="text-xs text-[#737373] mt-2">
          The idea you are looking for does not exist or has been deleted.
        </p>
        <Link
          to="/app/ideas"
          className="mt-4 inline-flex items-center gap-1.5 text-xs text-neutral-400 hover:underline"
        >
          <ArrowLeft className="size-3.5" /> Back to Vault
        </Link>
      </div>
    );
  }

  const handleSaveTextChanges = async () => {
    if (!id) return;
    try {
      await updateIdea({
        id,
        title: localTitle.trim(),
        description: localDescription.trim(),
      }).unwrap();
      setHasChanges(false);
      toast.success("Idea details updated");
    } catch (error) {
      toast.error("Failed to update idea");
    }
  };

  const handleStatusChange = async (newStatus: IdeaStatus) => {
    if (!id) return;
    try {
      await updateIdea({
        id,
        status: newStatus,
      }).unwrap();
      toast.success(`Lifecycle shifted to ${newStatus}`, {
        description: `"${idea.title}" is now marked as ${newStatus.toLowerCase()}.`,
      });
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const handleDelete = async () => {
    if (
      confirm(
        "Are you sure you want to delete this idea and all its attached notes? This action is irreversible."
      )
    ) {
      try {
        await deleteIdea(idea.id).unwrap();
        toast.success("Idea deleted");
        navigate("/app/ideas");
      } catch (error) {
        toast.error("Failed to delete idea");
      }
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    try {
      await deleteNote(noteId).unwrap();
      toast.success("Note deleted");
    } catch (error) {
      toast.error("Failed to delete note");
    }
  };

  // Activity logs based on idea and notes
  const activityLogs = [
    {
      action: `Status: ${idea.status}`,
      time: idea.updatedAt,
      detail: "Current state in DB",
    },
    ...notes.slice(0, 2).map((n) => ({
      action: `Note: "${n.title}"`,
      time: n.updatedAt,
      detail: "Attached specification",
    })),
    {
      action: "Idea captured",
      time: idea.createdAt,
      detail: "Permanent archive",
    },
  ];

  const statuses: IdeaStatus[] = [
    "SEED",
    "THINKING",
    "BUILDING",
    "DORMANT",
    "COMPLETED",
    "ARCHIVED",
  ];

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

        <div className="flex items-center gap-2">
          {hasChanges && (
            <Button
              onClick={handleSaveTextChanges}
              disabled={isUpdatingIdea}
              className="bg-accent-gold hover:bg-[#DBC182] text-[#030303] font-semibold rounded-none px-3 h-8 text-xs cursor-pointer flex items-center gap-1.5 shadow-sm"
            >
              <Save className="size-3.5" />
              <span>{isUpdatingIdea ? "Saving..." : "Save Changes"}</span>
            </Button>
          )}

          <CreateNoteDialog
            defaultIdeaId={idea.id}
            trigger={
              <Button className="bg-[#161616] hover:bg-[#222222] border border-[#262626] text-[#F5F5F5] font-medium rounded-none px-3 h-8 text-xs cursor-pointer flex items-center gap-1.5">
                <Plus className="size-3.5 text-accent-gold" />
                <span>Add Note</span>
              </Button>
            }
          />
          <Button
            onClick={handleDelete}
            disabled={isDeletingIdea}
            variant="destructive"
            size="sm"
            className="text-xs h-8 cursor-pointer gap-1.5 rounded-none"
          >
            <Trash2 className="size-3.5" />
            <span>{isDeletingIdea ? "Deleting..." : "Delete Idea"}</span>
          </Button>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column: Idea Details & Attached Notes */}
        <div className="lg:col-span-2 space-y-6">
          {/* Editable Title */}
          <div className="space-y-1">
            <input
              type="text"
              value={localTitle}
              onChange={(e) => {
                setLocalTitle(e.target.value);
                setHasChanges(true);
              }}
              onBlur={handleSaveTextChanges}
              className="w-full bg-transparent border-b border-transparent hover:border-[#262626] focus:border-neutral-500 text-xl font-bold text-[#F5F5F5] focus:outline-none pb-1 transition-all"
              placeholder="Idea Title..."
            />
          </div>

          {/* Editable Description */}
          <div className="space-y-1 bg-[#0A0A0A] border border-[#262626] rounded-none p-5 shadow-md">
            <label className="text-[10px] uppercase font-mono tracking-wider text-[#737373] block mb-2">
              Concept Overview & Vision
            </label>
            <Textarea
              value={localDescription}
              onChange={(e) => {
                setLocalDescription(e.target.value);
                setHasChanges(true);
              }}
              onBlur={handleSaveTextChanges}
              className="w-full bg-transparent border-none text-[#F5F5F5] placeholder-[#737373] focus-visible:ring-0 p-0 text-sm min-h-[60px] resize-none leading-relaxed font-sans"
              placeholder="Describe this concept..."
            />
          </div>

          {/* Attached Research & Specifications Notes Segment */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="size-4 text-accent-gold" />
                <h2 className="text-sm font-semibold text-[#F5F5F5]">
                  Attached Research & Notes
                </h2>
                <span className="px-2 py-0.2 rounded-none text-[10px] uppercase font-mono font-semibold bg-[#161616] text-[#A3A3A3] border border-[#262626]">
                  {notes.length} Notes
                </span>
              </div>

              <CreateNoteDialog
                defaultIdeaId={idea.id}
                trigger={
                  <Button className="bg-[#F5F5F5] hover:bg-[#EAEAEA] text-[#030303] text-xs font-semibold rounded-none px-3 h-8 cursor-pointer flex items-center gap-1.5 shadow-sm">
                    <Plus className="size-3.5" />
                    <span>New Note</span>
                  </Button>
                }
              />
            </div>

            {isLoadingNotes ? (
              <div className="py-8 text-center text-xs text-[#737373] font-mono">
                Loading notes...
              </div>
            ) : notes.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 border border-dashed border-[#262626] rounded-none bg-[#0A0A0A]/50 text-center p-6">
                <FileText className="size-7 text-[#737373] mb-2" />
                <h3 className="text-xs font-semibold text-[#F5F5F5]">
                  No Notes Attached to this Idea
                </h3>
                <p className="text-xs text-[#737373] max-w-sm mt-1 mb-4 leading-relaxed">
                  Attach research findings, system architecture specs, checklist items, or design inspirations.
                </p>
                <CreateNoteDialog
                  defaultIdeaId={idea.id}
                  trigger={
                    <Button className="bg-[#161616] hover:bg-[#222222] border border-[#262626] text-[#F5F5F5] text-xs font-medium rounded-none px-3 h-8 cursor-pointer">
                      <Plus className="size-3.5 mr-1 text-accent-gold" />
                      <span>Capture First Note</span>
                    </Button>
                  }
                />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {notes.map((note) => (
                  <NoteCard
                    key={note.id}
                    note={note}
                    idea={idea}
                    onEdit={(n) => setEditingNote(n)}
                    onDelete={handleDeleteNote}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Metadata & Lifecycles */}
        <div className="space-y-6">
          {/* Status selector card */}
          <div className="bg-[#0A0A0A] border border-[#262626] rounded-none p-5 shadow-lg space-y-4">
            <div>
              <span className="text-[10px] uppercase font-mono tracking-wider text-[#737373]">
                Current State
              </span>
              <div className="mt-2">
                <IdeaStatusBadge
                  status={idea.status}
                  className="text-xs px-2.5 py-1"
                />
              </div>
            </div>

            <div className="border-t border-[#262626] pt-3">
              <span className="text-[10px] uppercase font-mono tracking-wider text-[#737373] block mb-2">
                Shift Lifecycle
              </span>
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
              <span>Attached Notes</span>
              <span className="text-accent-gold font-mono font-semibold">
                {notes.length}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span>Idea ID</span>
              <span className="text-[#F5F5F5] font-mono truncate max-w-[140px]">{idea.id}</span>
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

      {/* Note Editor Modal */}
      <NoteEditorModal
        note={editingNote}
        open={!!editingNote}
        onClose={() => setEditingNote(null)}
      />
    </div>
  );
}
