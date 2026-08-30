import { useState } from "react";
import { Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { deleteFile } from "@/features/files/mutations";

type DeleteFileDialogProps = {
  fileId: string;
  storagePath: string;
  title: string;
  userId: string;
  onDeleted?: () => void;
};

export function FileDeleteDialog({
  fileId,
  storagePath,
  title,
  userId,
  onDeleted,
}: DeleteFileDialogProps) {
  const [open, setOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);

    try {
      await deleteFile({
        userId,
        fileId,
        storagePath,
      });

      toast.success("File deleted.");
      setOpen(false);
      onDeleted?.();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Could not delete this file.",
      );
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Trash2 className="mr-2 size-4" aria-hidden />
          Delete
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete this file?</DialogTitle>
          <DialogDescription>
            This will permanently remove the stored file. The file
            <strong> "{title}" </strong>
            will no longer be available in your grimoire.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={deleting}
          >
            Cancel
          </Button>

          <Button
            variant="destructive"
            onClick={() => void handleDelete()}
            disabled={deleting}
          >
            {deleting && (
              <Loader2
                className="mr-2 size-4 animate-spin"
                aria-hidden
              />
            )}
            {deleting ? "Deleting…" : "Delete file"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
