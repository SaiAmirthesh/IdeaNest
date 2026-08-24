import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { useCreateIdeaMutation } from "@/features/ideas/ideaApi";
import { useCreateNoteMutation } from "@/features/notes/noteApi";
import type { IdeaStatus } from "@/features/ideas/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const ideaSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(100, "Title is too long"),
  description: z.string().min(5, "Description must be at least 5 characters").max(500, "Description is too long"),
  status: z.enum(["SEED", "THINKING", "BUILDING", "DORMANT", "COMPLETED", "ARCHIVED"] as const),
  notes: z.string().optional(),
});

type IdeaFormValues = z.infer<typeof ideaSchema>;

interface CreateIdeaDialogProps {
  trigger: React.ReactNode;
}

export function CreateIdeaDialog({ trigger }: CreateIdeaDialogProps) {
  const [open, setOpen] = useState(false);
  const [createIdea, { isLoading: isCreatingIdea }] = useCreateIdeaMutation();
  const [createNote] = useCreateNoteMutation();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<IdeaFormValues>({
    resolver: zodResolver(ideaSchema),
    defaultValues: {
      title: "",
      description: "",
      status: "SEED",
      notes: "",
    },
  });

  const selectedStatus = watch("status");

  const onSubmit = async (values: IdeaFormValues) => {
    try {
      const createdIdea = await createIdea({
        title: values.title.trim(),
        description: values.description.trim(),
        status: values.status as IdeaStatus,
      }).unwrap();

      if (values.notes?.trim() && createdIdea.id) {
        await createNote({
          title: `Initial Notes: ${values.title.trim()}`,
          content: values.notes.trim(),
          ideaId: createdIdea.id,
        }).unwrap();
      }

      toast.success("Idea captured successfully!", {
        description: `"${values.title}" has been saved to your second brain.`,
      });
      setOpen(false);
      reset();
    } catch {
      toast.error("Failed to save idea. Please check your connection.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[480px] bg-[#0A0A0A] border border-[#262626] text-[#F5F5F5] rounded-none p-6 shadow-2xl">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-lg font-semibold text-[#F5F5F5]">Capture New Idea</DialogTitle>
          <DialogDescription className="text-xs text-[#737373]">
            Formulate your thought. Define its status and let it grow.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Title Field */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-[#737373]">Title</label>
            <Input
              placeholder="e.g. Multi-agent review system..."
              className="bg-[#111111] border-[#262626] text-[#F5F5F5] placeholder-[#737373] focus-visible:border-neutral-500 rounded-none text-xs h-9"
              {...register("title")}
            />
            {errors.title && <span className="text-xs text-red-400 font-medium">{errors.title.message}</span>}
          </div>

          {/* Description Field */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-[#737373]">Description</label>
            <Textarea
              placeholder="Provide a brief summary of the core concept..."
              className="min-h-[80px] bg-[#111111] border-[#262626] text-[#F5F5F5] placeholder-[#737373] focus-visible:border-neutral-500 resize-none rounded-none text-xs font-sans"
              {...register("description")}
            />
            {errors.description && <span className="text-xs text-red-400 font-medium">{errors.description.message}</span>}
          </div>

          {/* Status Selection */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[#737373]">Initial Lifecycle State</label>
            <div className="grid grid-cols-3 gap-2">
              {(["SEED", "THINKING", "BUILDING"] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setValue("status", s)}
                  className={`py-2 px-3 text-xs font-semibold rounded-none border transition-all duration-200 cursor-pointer ${
                    selectedStatus === s
                      ? "bg-[#1C1C1C] border-[#525252] text-[#F5F5F5] shadow-md shadow-white/5"
                      : "bg-[#111111] border-[#262626] text-[#737373] hover:border-[#525252] hover:text-[#F5F5F5]"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Initial Notes Field */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-[#737373]">Initial Notes (Optional)</label>
            <Textarea
              placeholder="Jot down any preliminary thoughts, resources, or reminders..."
              className="min-h-[80px] bg-[#111111] border-[#262626] text-[#F5F5F5] placeholder-[#737373] focus-visible:border-neutral-500 resize-none rounded-none text-xs font-sans"
              {...register("notes")}
            />
          </div>

          <DialogFooter className="mt-6 flex flex-row justify-end gap-3 border-t border-[#262626] pt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setOpen(false)}
              className="text-[#737373] hover:text-[#F5F5F5] hover:bg-[#111111] text-xs cursor-pointer rounded-none"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isCreatingIdea}
              className="bg-[#F5F5F5] hover:bg-[#EAEAEA] text-[#030303] font-semibold text-xs px-4 cursor-pointer shadow-md shadow-white/5 rounded-none"
            >
              {isCreatingIdea ? "Saving..." : "Save to Brain"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
