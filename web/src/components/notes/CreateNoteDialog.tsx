import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Plus, FileText, Sparkles } from "lucide-react";
import { useCreateNoteMutation } from "@/features/notes/noteApi";
import { useGetIdeasQuery } from "@/features/ideas/ideaApi";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const noteSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title is too long"),
  content: z.string().min(1, "Content is required"),
  ideaId: z.string().optional(),
});

type NoteFormValues = z.infer<typeof noteSchema>;

interface CreateNoteDialogProps {
  trigger?: React.ReactNode;
  defaultIdeaId?: string;
  onSuccess?: () => void;
}

export function CreateNoteDialog({ trigger, defaultIdeaId, onSuccess }: CreateNoteDialogProps) {
  const [open, setOpen] = useState(false);
  const [createNote, { isLoading: isCreatingNote }] = useCreateNoteMutation();
  const { data: ideasData } = useGetIdeasQuery({ limit: 100 });
  const ideas = ideasData?.data || [];

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<NoteFormValues>({
    resolver: zodResolver(noteSchema),
    defaultValues: {
      title: "",
      content: "",
      ideaId: defaultIdeaId || "",
    },
  });

  const onSubmit = async (values: NoteFormValues) => {
    try {
      await createNote({
        title: values.title.trim(),
        content: values.content.trim(),
        ideaId: values.ideaId && values.ideaId !== "NONE" ? values.ideaId : null,
      }).unwrap();

      toast.success("Note captured successfully");
      reset({ title: "", content: "", ideaId: defaultIdeaId || "" });
      setOpen(false);
      onSuccess?.();
    } catch {
      toast.error("Failed to capture note");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="bg-[#F5F5F5] hover:bg-[#EAEAEA] text-[#030303] font-semibold rounded-none px-4 h-9 text-xs shadow-md shadow-white/5 cursor-pointer flex items-center gap-1.5">
            <Plus className="size-4" />
            <span>Capture Note</span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[540px] bg-[#0A0A0A] border border-[#262626] rounded-none p-6 text-[#F5F5F5] shadow-2xl">
        <DialogHeader className="gap-1 mb-2">
          <div className="flex items-center gap-2">
            <FileText className="size-4 text-accent-gold" />
            <DialogTitle className="text-base font-bold text-[#F5F5F5] tracking-tight">
              Capture Thought / Note
            </DialogTitle>
          </div>
          <p className="text-xs text-[#737373] leading-relaxed">
            Record research, technical specifications, or brainstorming ideas in your private archive.
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
          {/* Note Title */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-[#737373] block">Note Title</label>
            <Input
              placeholder="e.g. Architecture Overview, Research Findings..."
              className="bg-[#111111] border-[#262626] text-[#F5F5F5] placeholder-[#525252] focus-visible:border-neutral-500 rounded-none text-xs h-9"
              {...register("title")}
            />
            {errors.title && (
              <span className="text-[11px] text-red-400 font-medium">{errors.title.message}</span>
            )}
          </div>

          {/* Associated Idea Selector */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-[#737373] block">Associate with Idea (Optional)</label>
            <select
              defaultValue={defaultIdeaId || "NONE"}
              {...register("ideaId")}
              className="w-full bg-[#111111] border border-[#262626] text-[#F5F5F5] rounded-none text-xs h-9 px-3 focus:outline-none focus:border-neutral-500 font-sans"
            >
              <option value="NONE" className="bg-[#111111] text-[#737373]">
                -- Standalone Note (No Idea Attached) --
              </option>
              {ideas.map((idea) => (
                <option key={idea.id} value={idea.id} className="bg-[#111111] text-[#F5F5F5]">
                  {idea.title} ({idea.status})
                </option>
              ))}
            </select>
          </div>

          {/* Note Content */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-[#737373] flex items-center justify-between">
              <span>Content & Markdown</span>
              <span className="text-[10px] text-neutral-500 font-mono">Markdown supported</span>
            </label>
            <Textarea
              placeholder="Write thoughts, checklist items, links, or technical notes..."
              className="bg-[#111111] border-[#262626] text-[#F5F5F5] placeholder-[#525252] focus-visible:border-neutral-500 rounded-none text-xs min-h-[140px] font-sans leading-relaxed"
              {...register("content")}
            />
            {errors.content && (
              <span className="text-[11px] text-red-400 font-medium">{errors.content.message}</span>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 pt-4 border-t border-[#262626]">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="bg-transparent border-[#262626] hover:bg-[#111111] text-[#A3A3A3] hover:text-[#F5F5F5] rounded-none text-xs h-9 px-4 cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isCreatingNote}
              className="bg-[#F5F5F5] hover:bg-[#EAEAEA] text-[#030303] font-semibold rounded-none text-xs h-9 px-5 cursor-pointer shadow-md shadow-white/5"
            >
              <Sparkles className="size-3.5 mr-1" />
              <span>{isCreatingNote ? "Saving..." : "Save Note"}</span>
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
