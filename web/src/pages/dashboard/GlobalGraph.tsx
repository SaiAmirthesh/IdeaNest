import { useState, useMemo } from "react";
import { Network, Sparkles, Plus } from "lucide-react";
import { useGetIdeasQuery } from "@/features/ideas/ideaApi";
import { useGetNotesQuery } from "@/features/notes/noteApi";
import { buildGlobalVaultGraph } from "@/features/graph/graphUtils";
import type { Note } from "@/features/notes/types";
import { KnowledgeGraph } from "@/components/graph/KnowledgeGraph";
import { NoteEditorModal } from "@/components/notes/NoteEditorModal";
import { CreateNoteDialog } from "@/components/notes/CreateNoteDialog";
import { CreateIdeaDialog } from "@/components/ideas/CreateIdeaDialog";
import { Button } from "@/components/ui/button";

export default function GlobalGraph() {
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const { data: ideasData, isLoading: isLoadingIdeas } = useGetIdeasQuery({ limit: 150 });
  const { data: notesData, isLoading: isLoadingNotes } = useGetNotesQuery({ limit: 300 });

  const ideas = useMemo(() => ideasData?.data || [], [ideasData]);
  const notes = useMemo(() => notesData?.data || [], [notesData]);

  const graphData = useMemo(() => {
    return buildGlobalVaultGraph(ideas, notes);
  }, [ideas, notes]);

  const isLoading = isLoadingIdeas || isLoadingNotes;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-[#F5F5F5]">Vault Knowledge Graph</h1>
            <span className="px-2 py-0.5 rounded-none text-[10px] uppercase font-mono font-semibold bg-accent-gold/10 text-accent-gold border border-accent-gold/20">
              Obsidian Brain
            </span>
          </div>
          <p className="text-xs text-[#737373] mt-1">
            Global force-directed visualization of mental clusters, [[WikiLinks]], and tag synapses.
          </p>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <CreateNoteDialog
            trigger={
              <Button className="bg-[#161616] hover:bg-[#222222] border border-[#262626] text-[#F5F5F5] font-medium rounded-none px-3 h-8 text-xs cursor-pointer flex items-center gap-1.5">
                <Plus className="size-3.5 text-accent-gold" />
                <span>New Note</span>
              </Button>
            }
          />
          <CreateIdeaDialog
            trigger={
              <Button className="bg-[#F5F5F5] hover:bg-[#EAEAEA] text-[#030303] font-semibold rounded-none px-3.5 h-8 text-xs shadow-md shadow-white/5 cursor-pointer flex items-center gap-1.5">
                <Sparkles className="size-3.5" />
                <span>Capture Idea</span>
              </Button>
            }
          />
        </div>
      </div>

      {/* Main Graph Canvas Container */}
      <div
        className={`${
          isFullscreen
            ? "fixed inset-0 z-50 p-6 bg-[#030303]/95 backdrop-blur-xl"
            : "h-[calc(100vh-230px)] min-h-[500px] w-full"
        }`}
      >
        {isLoading ? (
          <div className="size-full flex items-center justify-center bg-[#070707] border border-[#262626] font-mono text-xs text-[#737373]">
            Synthesizing global synaptic graph...
          </div>
        ) : graphData.nodes.length === 0 ? (
          <div className="size-full flex flex-col items-center justify-center bg-[#070707] border border-dashed border-[#262626] p-6 text-center">
            <Network className="size-10 text-[#737373] mb-3" />
            <h3 className="text-sm font-semibold text-[#F5F5F5]">No Knowledge Nodes Yet</h3>
            <p className="text-xs text-[#737373] max-w-sm mt-1 mb-4 leading-relaxed">
              Capture your first idea or research note to initiate your second brain graph.
            </p>
            <CreateIdeaDialog
              trigger={
                <Button className="bg-[#F5F5F5] hover:bg-[#EAEAEA] text-[#030303] text-xs font-semibold rounded-none px-4 h-8 cursor-pointer">
                  <Plus className="size-3.5 mr-1" />
                  <span>Capture First Idea</span>
                </Button>
              }
            />
          </div>
        ) : (
          <KnowledgeGraph
            data={graphData}
            height="100%"
            onSelectNote={(note) => setEditingNote(note)}
            isFullscreen={isFullscreen}
            onToggleFullscreen={() => setIsFullscreen(!isFullscreen)}
          />
        )}
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
