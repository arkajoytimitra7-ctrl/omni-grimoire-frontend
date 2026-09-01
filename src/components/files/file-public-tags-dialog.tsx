import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { updateFilePublicTags } from "@/features/tags/mutations";

type PublicTag = {
  id: string;
  name: string;
  slug: string;
};

type FilePublicTagsDialogProps = {
  fileId: string;
  currentTagIds: string[];
  publicTags: PublicTag[];
  onSaved?: () => void | Promise<void>;
};

export function FilePublicTagsDialog({
  fileId,
  currentTagIds,
  publicTags,
  onSaved,
}: FilePublicTagsDialogProps) {
  const [open, setOpen] = useState(false);
  const [selectedTagIds, setSelectedTagIds] =
    useState<string[]>(currentTagIds);
  const [pending, setPending] = useState(false);

  const toggleTag = (tagId: string) => {
    setSelectedTagIds((current) =>
      current.includes(tagId)
        ? current.filter((id) => id !== tagId)
        : [...current, tagId],
    );
  };

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);

    if (nextOpen) {
      setSelectedTagIds(currentTagIds);
    }
  };

  const handleSave = async () => {
    setPending(true);

    try {
      await updateFilePublicTags({
        fileId,
        tagIds: selectedTagIds,
      });

      await onSaved?.();

      toast.success("Public tags updated.");
      setOpen(false);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Could not update public tags.",
      );
    } finally {
      setPending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Tags
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Public Tags</DialogTitle>
          <DialogDescription>
            Choose the public tags that describe this file.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Available tags</Label>

            <div className="flex flex-wrap gap-2">
              {publicTags.map((tag) => {
                const selected = selectedTagIds.includes(tag.id);

                return (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => toggleTag(tag.id)}
                    aria-pressed={selected}
                    className={[
                      "rounded-full border px-3 py-1.5 text-sm transition",
                      selected
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-background text-muted-foreground hover:bg-muted",
                    ].join(" ")}
                  >
                    {tag.name}
                  </button>
                );
              })}
            </div>

            {publicTags.length === 0 && (
              <p className="text-sm text-muted-foreground">
                No public tags are currently available.
              </p>
            )}
          </div>

          <Button
            type="button"
            className="w-full"
            disabled={pending}
            onClick={() => void handleSave()}
          >
            {pending ? "Saving…" : "Save tags"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
    }
