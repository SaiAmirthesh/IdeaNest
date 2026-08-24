import { useState, useMemo, useRef } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import {
  Tag as TagIcon,
  Plus,
  X,
  Lightbulb,
  Save,
  Trash2,
  Columns,
  Eye,
  Code2,
  Heading1,
  Heading2,
  Heading3,
  Bold,
  Italic,
  List,
  CheckSquare,
  Link as LinkIcon,
  Quote,
  ArrowLeft,
  Sparkles,
  Link2,
} from "lucide-react";
import { useUpdateNoteMutation, useDeleteNoteMutation, useGetNotesQuery } from "@/features/notes/noteApi";
import { useGetIdeasQuery } from "@/features/ideas/ideaApi";
import { extractTags, extractWikiLinks } from "@/features/graph/graphUtils";
import type { Note } from "@/features/notes/types";
import { ObsidianMarkdownRenderer } from "./ObsidianMarkdownRenderer";
import { Button } from "@/components/ui/button";

interface NoteDocumentEditorProps {
  note: Note;
  onBack?: () => void;
  onNavigateToNote?: (noteTitle: string) => void;
  className?: string;
}

export function NoteDocumentEditor({
  note,
  onBack,
  onNavigateToNote,
  className = "",
}: NoteDocumentEditorProps) {
  const navigate = useNavigate();
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // Note Field State
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const [ideaId, setIdeaId] = useState<string | null>(note.ideaId ?? null);
  const [tagInput, setTagInput] = useState("");
  const [showTagInput, setShowTagInput] = useState(false);
  const [viewMode, setViewMode] = useState<"SPLIT" | "PREVIEW" | "EDIT">("SPLIT");
  const [showBacklinks, setShowBacklinks] = useState(false);

  // Queries & Mutations
  const [updateNote, { isLoading: isUpdating }] = useUpdateNoteMutation();
  const [deleteNote, { isLoading: isDeleting }] = useDeleteNoteMutation();
  const { data: ideasData } = useGetIdeasQuery({ limit: 100 });
  const { data: allNotesData } = useGetNotesQuery({ limit: 300 });

  const ideas = ideasData?.data || [];
  const allNotes = useMemo(() => allNotesData?.data || [], [allNotesData]);

  // Extract explicit tags from content
  const existingTags = useMemo(() => {
    return extractTags(content);
  }, [content]);

  // Calculate Backlinks (notes that reference [[this note title]])
  const backlinks = useMemo(() => {
    const targetTitle = title.trim().toLowerCase();
    if (!targetTitle) return [];

    return allNotes.filter((n) => {
      if (n.id === note.id) return false;
      const links = extractWikiLinks(n.content);
      return links.some((l) => l.toLowerCase() === targetTitle);
    });
  }, [allNotes, note.id, title]);

  // Word & Character count
  const wordCount = useMemo(() => {
    const trimmed = content.trim();
    return trimmed ? trimmed.split(/\s+/).length : 0;
  }, [content]);

  const charCount = content.length;

  // Auto-save debounced or on blur
  const handleSave = async (customTitle = title, customContent = content, customIdeaId = ideaId) => {
    if (!customTitle.trim()) {
      toast.error("Title cannot be empty");
      return;
    }

    try {
      await updateNote({
        id: note.id,
        title: customTitle.trim(),
        content: customContent,
        ideaId: customIdeaId && customIdeaId !== "NONE" ? customIdeaId : null,
      }).unwrap();
    } catch {
      toast.error("Failed to save note");
    }
  };

  // Quick text insertion helper for Markdown Toolbar
  const insertMarkdown = (prefix: string, suffix = "", defaultText = "") => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end) || defaultText;

    const newContent =
      content.substring(0, start) + prefix + selectedText + suffix + content.substring(end);
    setContent(newContent);

    // Save and focus cursor
    handleSave(title, newContent, ideaId);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length + selectedText.length);
    }, 0);
  };

  // Add new Tag to markdown content
  const handleAddTag = (tagToAdd: string) => {
    const cleaned = tagToAdd.trim().replace(/^#/, "").toLowerCase();
    if (!cleaned) return;
    if (existingTags.includes(cleaned)) {
      setTagInput("");
      setShowTagInput(false);
      return;
    }

    const newContent = `${content.trimEnd()}\n\n#${cleaned}`;
    setContent(newContent);
    setTagInput("");
    setShowTagInput(false);
    handleSave(title, newContent, ideaId);
    toast.success(`Added tag #${cleaned}`);
  };

  // Remove Tag from markdown content
  const handleRemoveTag = (tagToRemove: string) => {
    const regex = new RegExp(`(?:^|\\s)#${tagToRemove}(?=\\s|$|[.,;:!?])`, "gi");
    const newContent = content.replace(regex, "").trim();
    setContent(newContent);
    handleSave(title, newContent, ideaId);
    toast.success(`Removed tag #${tagToRemove}`);
  };

  const handleDelete = async () => {
    if (confirm(`Are you sure you want to delete "${note.title}"?`)) {
      try {
        await deleteNote(note.id).unwrap();
        toast.success("Note deleted");
        if (onBack) {
          onBack();
        } else {
          navigate("/app/notes");
        }
      } catch {
        toast.error("Failed to delete note");
      }
    }
  };

  // Navigate when clicking a wikilink
  const handleWikiLinkClick = (targetTitle: string) => {
    const foundNote = allNotes.find(
      (n) => n.title.trim().toLowerCase() === targetTitle.trim().toLowerCase()
    );
    if (foundNote) {
      if (onNavigateToNote) {
        onNavigateToNote(foundNote.title);
      } else {
        navigate(`/app/notes/${foundNote.id}`);
      }
    } else {
      toast.info(`Referenced note "[[${targetTitle}]]" not yet created.`);
    }
  };

  return (
    <div className={`flex flex-col bg-[#070707] text-[#F5F5F5] border border-[#262626] rounded-none overflow-hidden font-sans min-h-[700px] shadow-2xl ${className}`}>
      {/* Top Header Bar */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-[#262626] bg-[#0A0A0A]">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="p-1.5 text-[#737373] hover:text-[#F5F5F5] hover:bg-[#161616] rounded-none transition-colors cursor-pointer"
              title="Back"
            >
              <ArrowLeft className="size-4" />
            </button>
          )}
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-accent-gold flex items-center gap-1.5">
            <Sparkles className="size-3.5" /> Obsidian Document Workspace
          </span>
        </div>

        {/* View Mode Toggle & Actions */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-[#111111] border border-[#262626] p-0.5 rounded-none">
            <button
              onClick={() => setViewMode("PREVIEW")}
              className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-none cursor-pointer transition-all ${
                viewMode === "PREVIEW"
                  ? "bg-[#1C1C1C] text-accent-gold shadow-sm"
                  : "text-[#737373] hover:text-[#F5F5F5]"
              }`}
              title="Reading / Preview View"
            >
              <Eye className="size-3.5" />
              <span className="hidden sm:inline">Preview</span>
            </button>

            <button
              onClick={() => setViewMode("SPLIT")}
              className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-none cursor-pointer transition-all ${
                viewMode === "SPLIT"
                  ? "bg-[#1C1C1C] text-accent-gold shadow-sm"
                  : "text-[#737373] hover:text-[#F5F5F5]"
              }`}
              title="Split View (Source + Preview)"
            >
              <Columns className="size-3.5" />
              <span className="hidden sm:inline">Split</span>
            </button>

            <button
              onClick={() => setViewMode("EDIT")}
              className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-none cursor-pointer transition-all ${
                viewMode === "EDIT"
                  ? "bg-[#1C1C1C] text-accent-gold shadow-sm"
                  : "text-[#737373] hover:text-[#F5F5F5]"
              }`}
              title="Source Edit Mode"
            >
              <Code2 className="size-3.5" />
              <span className="hidden sm:inline">Edit</span>
            </button>
          </div>

          <Button
            onClick={() => handleSave()}
            disabled={isUpdating}
            className="bg-[#F5F5F5] hover:bg-[#EAEAEA] text-[#030303] text-xs font-semibold rounded-none px-3.5 h-8 cursor-pointer flex items-center gap-1.5 shadow-sm"
          >
            <Save className="size-3.5" />
            <span>{isUpdating ? "Saving..." : "Save"}</span>
          </Button>

          <Button
            onClick={handleDelete}
            disabled={isDeleting}
            variant="destructive"
            size="sm"
            className="text-xs h-8 px-2.5 rounded-none cursor-pointer"
            title="Delete Note"
          >
            <Trash2 className="size-3.5" />
          </Button>
        </div>
      </div>

      {/* Main Document Content Scroll Container */}
      <div className="flex-1 overflow-y-auto px-6 sm:px-12 py-8 space-y-6">
        {/* Document Title Header (Matching the screenshot's prominent title e.g. JAVA) */}
        <div className="space-y-1">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={() => handleSave(title, content, ideaId)}
            className="w-full bg-transparent border-b border-transparent hover:border-[#262626] focus:border-accent-gold text-3xl sm:text-4xl font-bold tracking-tight text-[#F5F5F5] focus:outline-none pb-2 transition-all font-sans"
            placeholder="Untitled Document..."
          />
        </div>

        {/* Obsidian Properties Box (Matching screenshot's Properties card) */}
        <div className="bg-[#0A0A0A] border border-[#262626] rounded-none p-4 space-y-3 shadow-md max-w-3xl">
          <span className="text-xs font-bold uppercase tracking-wider text-[#A3A3A3] block font-mono">
            Properties
          </span>

          {/* Tags Row */}
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5 text-[#737373] w-20 shrink-0 font-medium">
              <TagIcon className="size-3.5" />
              <span>tags</span>
            </div>

            <div className="flex flex-wrap items-center gap-1.5 flex-1">
              {existingTags.length === 0 && !showTagInput && (
                <span className="text-xs text-[#525252] italic font-mono">No tags added</span>
              )}

              {existingTags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 bg-[#162722] border border-[#234e40] text-[#48bb78] px-2.5 py-1 text-xs font-mono rounded-none group"
                >
                  <span>{tag}</span>
                  <button
                    onClick={() => handleRemoveTag(tag)}
                    className="text-[#234e40] group-hover:text-red-400 cursor-pointer"
                  >
                    <X className="size-3" />
                  </button>
                </span>
              ))}

              {showTagInput ? (
                <div className="flex items-center gap-1 bg-[#111111] border border-[#262626] px-2 py-0.5">
                  <input
                    type="text"
                    autoFocus
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddTag(tagInput);
                      } else if (e.key === "Escape") {
                        setShowTagInput(false);
                      }
                    }}
                    placeholder="tag/name + Enter..."
                    className="bg-transparent text-xs text-[#F5F5F5] focus:outline-none w-28 font-mono"
                  />
                  <button
                    onClick={() => handleAddTag(tagInput)}
                    className="text-emerald-400 hover:text-emerald-300"
                  >
                    <Plus className="size-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowTagInput(true)}
                  className="size-6 bg-[#111111] hover:bg-[#1C1C1C] border border-[#262626] text-[#737373] hover:text-[#F5F5F5] flex items-center justify-center rounded-none cursor-pointer transition-colors"
                  title="Add tag"
                >
                  <Plus className="size-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Linked Idea Row */}
          <div className="flex items-center gap-3 text-xs pt-2 border-t border-[#262626]/50">
            <div className="flex items-center gap-1.5 text-[#737373] w-20 shrink-0 font-medium">
              <Lightbulb className="size-3.5 text-accent-gold" />
              <span>Idea</span>
            </div>

            <select
              value={ideaId || "NONE"}
              onChange={(e) => {
                const val = e.target.value === "NONE" ? null : e.target.value;
                setIdeaId(val);
                handleSave(title, content, val);
              }}
              className="bg-[#111111] border border-[#262626] text-[#F5F5F5] rounded-none text-xs h-8 px-3 focus:outline-none focus:border-accent-gold font-sans max-w-sm"
            >
              <option value="NONE" className="bg-[#111111] text-[#737373]">
                -- Standalone Document (No Parent Idea) --
              </option>
              {ideas.map((i) => (
                <option key={i.id} value={i.id} className="bg-[#111111] text-[#F5F5F5]">
                  {i.title} ({i.status})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Markdown Toolbar */}
        <div className="flex flex-wrap items-center gap-1 bg-[#0A0A0A] border border-[#262626] p-1.5 px-2 shadow-sm sticky top-0 z-20">
          <button
            onClick={() => insertMarkdown("# ", "", "Main Title")}
            className="p-1.5 text-[#737373] hover:text-[#F5F5F5] hover:bg-[#161616] rounded-none cursor-pointer"
            title="Heading 1 Banner"
          >
            <Heading1 className="size-4" />
          </button>
          <button
            onClick={() => insertMarkdown("## ", "", "Section Banner")}
            className="p-1.5 text-[#737373] hover:text-[#F5F5F5] hover:bg-[#161616] rounded-none cursor-pointer"
            title="Heading 2 Emerald Banner"
          >
            <Heading2 className="size-4" />
          </button>
          <button
            onClick={() => insertMarkdown("### ", "", "Subheading")}
            className="p-1.5 text-[#737373] hover:text-[#F5F5F5] hover:bg-[#161616] rounded-none cursor-pointer"
            title="Heading 3"
          >
            <Heading3 className="size-4" />
          </button>

          <span className="w-px h-4 bg-[#262626] mx-1" />

          <button
            onClick={() => insertMarkdown("**", "**", "bold text")}
            className="p-1.5 text-[#737373] hover:text-[#F5F5F5] hover:bg-[#161616] rounded-none cursor-pointer"
            title="Bold"
          >
            <Bold className="size-4" />
          </button>
          <button
            onClick={() => insertMarkdown("*", "*", "italic text")}
            className="p-1.5 text-[#737373] hover:text-[#F5F5F5] hover:bg-[#161616] rounded-none cursor-pointer"
            title="Italic"
          >
            <Italic className="size-4" />
          </button>
          <button
            onClick={() => insertMarkdown("- ", "", "List item")}
            className="p-1.5 text-[#737373] hover:text-[#F5F5F5] hover:bg-[#161616] rounded-none cursor-pointer"
            title="Bullet List"
          >
            <List className="size-4" />
          </button>
          <button
            onClick={() => insertMarkdown("- [ ] ", "", "Checklist task")}
            className="p-1.5 text-[#737373] hover:text-[#F5F5F5] hover:bg-[#161616] rounded-none cursor-pointer"
            title="Task Checklist"
          >
            <CheckSquare className="size-4" />
          </button>

          <span className="w-px h-4 bg-[#262626] mx-1" />

          <button
            onClick={() => insertMarkdown("[[", "]]", "Linked Note Title")}
            className="p-1.5 px-2 text-xs font-mono font-semibold bg-[#2ecc71]/10 text-[#2ecc71] hover:bg-[#2ecc71]/20 border border-[#2ecc71]/30 rounded-none cursor-pointer flex items-center gap-1"
            title="Insert Obsidian [[WikiLink]]"
          >
            <LinkIcon className="size-3.5" />
            <span>[[WikiLink]]</span>
          </button>

          <button
            onClick={() => insertMarkdown("#", "", "tag_name")}
            className="p-1.5 px-2 text-xs font-mono font-semibold bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 border border-purple-500/30 rounded-none cursor-pointer"
            title="Insert #Tag"
          >
            #Tag
          </button>

          <button
            onClick={() => insertMarkdown("```typescript\n", "\n```", "const hello = 'world';")}
            className="p-1.5 text-[#737373] hover:text-[#F5F5F5] hover:bg-[#161616] rounded-none cursor-pointer"
            title="Code Block"
          >
            <Code2 className="size-4" />
          </button>
          <button
            onClick={() => insertMarkdown("> ", "", "Blockquote")}
            className="p-1.5 text-[#737373] hover:text-[#F5F5F5] hover:bg-[#161616] rounded-none cursor-pointer"
            title="Quote"
          >
            <Quote className="size-4" />
          </button>
        </div>

        {/* Editor & Preview Pane Area */}
        <div className="min-h-[420px]">
          {viewMode === "SPLIT" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              {/* Left: Source Markdown Editor */}
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-mono font-semibold text-[#737373] block mb-1">
                  Source Markdown
                </span>
                <textarea
                  ref={textareaRef}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  onBlur={() => handleSave(title, content, ideaId)}
                  placeholder="Write your thoughts in markdown (# Heading, [[WikiLink]], #tag)..."
                  className="w-full bg-[#0E0E0E] border border-[#262626] text-[#F5F5F5] placeholder-[#525252] focus-visible:border-accent-gold p-4 font-mono text-xs leading-relaxed min-h-[500px] resize-y rounded-none focus:outline-none"
                />
              </div>

              {/* Right: Live Rendered Obsidian Document Preview */}
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-mono font-semibold text-[#737373] block mb-1">
                  Obsidian Document View
                </span>
                <div className="bg-[#0A0A0A] border border-[#262626] p-5 min-h-[500px] rounded-none shadow-md overflow-y-auto">
                  <ObsidianMarkdownRenderer
                    content={content}
                    onWikiLinkClick={handleWikiLinkClick}
                  />
                </div>
              </div>
            </div>
          )}

          {viewMode === "PREVIEW" && (
            <div className="bg-[#0A0A0A] border border-[#262626] p-8 min-h-[550px] rounded-none shadow-md max-w-4xl">
              <ObsidianMarkdownRenderer
                content={content}
                onWikiLinkClick={handleWikiLinkClick}
              />
            </div>
          )}

          {viewMode === "EDIT" && (
            <div className="space-y-1">
              <textarea
                ref={textareaRef}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onBlur={() => handleSave(title, content, ideaId)}
                placeholder="Write your thoughts in markdown..."
                className="w-full bg-[#0E0E0E] border border-[#262626] text-[#F5F5F5] placeholder-[#525252] focus-visible:border-accent-gold p-5 font-mono text-sm leading-relaxed min-h-[600px] resize-y rounded-none focus:outline-none"
              />
            </div>
          )}
        </div>

        {/* Backlinks Section (Obsidian Linked Mentions) */}
        {backlinks.length > 0 && (
          <div className="bg-[#0A0A0A] border border-[#262626] rounded-none p-5 mt-6 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Link2 className="size-4 text-[#2ecc71]" />
                <span className="text-xs font-bold text-[#F5F5F5] tracking-tight">
                  Linked Mentions & Backlinks ({backlinks.length})
                </span>
              </div>
              <button
                onClick={() => setShowBacklinks(!showBacklinks)}
                className="text-xs text-[#737373] hover:text-[#F5F5F5] font-mono cursor-pointer"
              >
                {showBacklinks ? "Hide" : "Show"}
              </button>
            </div>

            {showBacklinks && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {backlinks.map((b) => (
                  <div
                    key={b.id}
                    onClick={() => handleWikiLinkClick(b.title)}
                    className="bg-[#111111] border border-[#262626] hover:border-[#2ecc71]/40 p-3 rounded-none cursor-pointer transition-all group"
                  >
                    <span className="text-xs font-semibold text-[#F5F5F5] group-hover:text-[#2ecc71] truncate block">
                      {b.title}
                    </span>
                    <p className="text-[11px] text-[#737373] line-clamp-2 mt-1 font-light">
                      {b.content}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Status Bar (Matching screenshot status bar: 71 words 519 characters, All done) */}
      <div className="flex items-center justify-between px-6 py-2 border-t border-[#262626] bg-[#0A0A0A] text-[11px] text-[#737373] font-mono select-none">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="size-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#10B981]" />
            <span>{wordCount} words {charCount} characters</span>
          </span>
          <span>•</span>
          <span className="text-emerald-400">All saved</span>
        </div>

        <div className="flex items-center gap-4">
          {backlinks.length > 0 && (
            <span className="text-[#2ecc71] flex items-center gap-1">
              <Link2 className="size-3" />
              <span>{backlinks.length} Backlinks</span>
            </span>
          )}
          <span>Updated {new Date(note.updatedAt).toLocaleTimeString()}</span>
        </div>
      </div>
    </div>
  );
}
