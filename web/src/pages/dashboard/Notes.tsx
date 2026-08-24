import { useState } from "react";
import { toast } from "sonner";
import { Search, Plus, FileText } from "lucide-react";
import { useGetNotesQuery, useDeleteNoteMutation } from "@/features/notes/noteApi";
import { useGetIdeasQuery } from "@/features/ideas/ideaApi";
import type { Note } from "@/features/notes/types";
import { NoteCard } from "@/components/notes/NoteCard";
import { CreateNoteDialog } from "@/components/notes/CreateNoteDialog";
import { NoteEditorModal } from "@/components/notes/NoteEditorModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Notes() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIdeaIdFilter, setSelectedIdeaIdFilter] = useState<string>("ALL");
  const [editingNote, setEditingNote] = useState<Note | null>(null);

  const { data: notesData, isLoading: isLoadingNotes } = useGetNotesQuery({ limit: 100 });
  const { data: ideasData } = useGetIdeasQuery({ limit: 100 });
  const [deleteNote] = useDeleteNoteMutation();

  const notes = notesData?.data || [];
  const ideas = ideasData?.data || [];

  // Filter notes by search term and selected idea
  const filteredNotes = notes.filter((note) => {
    const matchesSearch =
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.content.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    if (selectedIdeaIdFilter === "ALL") return true;
    if (selectedIdeaIdFilter === "STANDALONE") return !note.ideaId;
    return note.ideaId === selectedIdeaIdFilter;
  });

  const totalNotes = notes.length;
  const linkedNotes = notes.filter((n) => n.ideaId).length;
  const standaloneNotes = notes.filter((n) => !n.ideaId).length;

  const handleDeleteNote = async (id: string) => {
    try {
      await deleteNote(id).unwrap();
      toast.success("Note deleted");
    } catch {
      toast.error("Failed to delete note");
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header Row */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-[#F5F5F5]">Notes Archive</h1>
            <span className="px-2 py-0.5 rounded-none text-[10px] uppercase font-mono font-semibold bg-accent-gold/10 text-accent-gold border border-accent-gold/20">
              {totalNotes} Total
            </span>
          </div>
          <p className="text-xs text-[#737373] mt-1">
            Private repository of research, architecture specs, and creative brainstorms.
          </p>
        </div>

        {/* Capture Note Action */}
        <CreateNoteDialog
          trigger={
            <Button className="bg-[#F5F5F5] hover:bg-[#EAEAEA] text-[#030303] font-semibold rounded-none px-4 h-9 text-xs shadow-md shadow-white/5 cursor-pointer flex items-center gap-1.5 self-end sm:self-auto">
              <Plus className="size-4" />
              <span>Capture Note</span>
            </Button>
          }
        />
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div className="bg-[#0A0A0A] border border-[#262626] rounded-none p-4 flex flex-col justify-between">
          <span className="text-[10px] uppercase font-mono tracking-wider text-[#737373]">
            All Notes
          </span>
          <span className="text-xl font-bold tracking-tight text-[#F5F5F5] mt-2">{totalNotes}</span>
        </div>
        <div className="bg-[#0A0A0A] border border-[#262626] rounded-none p-4 flex flex-col justify-between">
          <span className="text-[10px] uppercase font-mono tracking-wider text-[#737373]">
            Idea Specifications
          </span>
          <span className="text-xl font-bold tracking-tight text-accent-gold mt-2">
            {linkedNotes}
          </span>
        </div>
        <div className="bg-[#0A0A0A] border border-[#262626] rounded-none p-4 flex flex-col justify-between col-span-2 sm:col-span-1">
          <span className="text-[10px] uppercase font-mono tracking-wider text-[#737373]">
            Standalone Thoughts
          </span>
          <span className="text-xl font-bold tracking-tight text-neutral-300 mt-2">
            {standaloneNotes}
          </span>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between bg-[#0A0A0A] border border-[#262626] rounded-none p-4 shadow-md">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[#737373]" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search notes by title or content..."
            className="pl-9 bg-[#111111] border-[#262626] text-[#F5F5F5] placeholder-[#737373]/80 focus-visible:border-neutral-500 rounded-none text-xs"
          />
        </div>

        {/* Filter Selection */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          <button
            onClick={() => setSelectedIdeaIdFilter("ALL")}
            className={`px-3 py-1.5 rounded-none text-xs font-medium border font-mono transition-all uppercase whitespace-nowrap cursor-pointer ${
              selectedIdeaIdFilter === "ALL"
                ? "bg-[#1C1C1C] border-[#525252] text-[#F5F5F5] shadow-md"
                : "bg-[#111111] border-[#262626] text-[#737373] hover:border-[#525252] hover:text-[#F5F5F5]"
            }`}
          >
            All Notes
          </button>

          <button
            onClick={() => setSelectedIdeaIdFilter("STANDALONE")}
            className={`px-3 py-1.5 rounded-none text-xs font-medium border font-mono transition-all uppercase whitespace-nowrap cursor-pointer ${
              selectedIdeaIdFilter === "STANDALONE"
                ? "bg-[#1C1C1C] border-[#525252] text-[#F5F5F5] shadow-md"
                : "bg-[#111111] border-[#262626] text-[#737373] hover:border-[#525252] hover:text-[#F5F5F5]"
            }`}
          >
            Standalone
          </button>

          {ideas.slice(0, 4).map((idea) => {
            const isActive = selectedIdeaIdFilter === idea.id;
            return (
              <button
                key={idea.id}
                onClick={() => setSelectedIdeaIdFilter(idea.id)}
                className={`px-3 py-1.5 rounded-none text-xs font-medium border font-mono transition-all truncate max-w-[160px] cursor-pointer ${
                  isActive
                    ? "bg-[#1C1C1C] border-[#525252] text-accent-gold shadow-md"
                    : "bg-[#111111] border-[#262626] text-[#737373] hover:border-[#525252] hover:text-[#F5F5F5]"
                }`}
                title={idea.title}
              >
                {idea.title}
              </button>
            );
          })}
        </div>
      </div>

      {/* Notes Grid */}
      {isLoadingNotes ? (
        <div className="py-16 text-center text-xs text-[#737373] font-mono">
          Loading notes from database...
        </div>
      ) : filteredNotes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 border border-dashed border-[#262626] rounded-none bg-[#111111]/20 text-center p-6">
          <FileText className="size-8 text-[#737373] mb-3" />
          <h3 className="text-sm font-semibold text-[#F5F5F5]">No Notes Found</h3>
          <p className="text-xs text-[#737373] max-w-sm mt-1 mb-4 leading-relaxed">
            {searchTerm
              ? `No notes match "${searchTerm}". Try a different keyword or clear your filter.`
              : "Capture your first research findings, technical specifications, or brainstorming notes."}
          </p>
          <CreateNoteDialog
            trigger={
              <Button className="bg-[#F5F5F5] hover:bg-[#EAEAEA] text-[#030303] text-xs font-semibold rounded-none px-4 h-8 cursor-pointer">
                <Plus className="size-3.5 mr-1" />
                <span>Capture New Note</span>
              </Button>
            }
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-1">
          {filteredNotes.map((note) => {
            const parentIdea = ideas.find((i) => i.id === note.ideaId);
            return (
              <NoteCard
                key={note.id}
                note={note}
                idea={parentIdea}
                onEdit={(n) => setEditingNote(n)}
                onDelete={handleDeleteNote}
              />
            );
          })}
        </div>
      )}

      {/* Edit Note Modal */}
      <NoteEditorModal
        note={editingNote}
        open={!!editingNote}
        onClose={() => setEditingNote(null)}
      />
    </div>
  );
}
