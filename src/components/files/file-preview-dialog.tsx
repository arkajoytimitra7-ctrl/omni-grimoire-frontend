import { useEffect, useState } from "react";
import { Loader2, Maximize2 } from "lucide-react";
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
import { createFileSignedUrl } from "@/features/files/access";

type PreviewFile = {
  title: string;
  storage_path: string | null;
  mime_type: string | null;
};

export function FilePreviewDialog({
  file,
}: {
  file: PreviewFile;
}) {
  const [open, setOpen] = useState(false);
  const [signedUrl, setSignedUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) {
      setSignedUrl(null);
      return;
    }

    let cancelled = false;

    const loadPreview = async () => {
      setLoading(true);

      try {
        if (!file.storage_path) {
          throw new Error("This entry has no stored file.");
        }

        const url = await createFileSignedUrl(file.storage_path);

        if (!cancelled) {
          setSignedUrl(url);
        }
      } catch (error) {
        if (!cancelled) {
          toast.error(
            error instanceof Error
              ? error.message
              : "Could not load image preview.",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void loadPreview();

    return () => {
      cancelled = true;
    };
  }, [open, file.storage_path]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Maximize2 className="mr-2 size-4" aria-hidden />
          Preview
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>{file.title}</DialogTitle>
          <DialogDescription>
            Temporary secure preview of your image.
          </DialogDescription>
        </DialogHeader>

        <div className="flex min-h-64 items-center justify-center overflow-hidden rounded-lg border border-border bg-muted/30 p-2">
          {loading && (
            <Loader2
              className="size-6 animate-spin text-muted-foreground"
              aria-label="Loading preview"
            />
          )}

          {!loading && signedUrl && (
            <img
              src={signedUrl}
              alt={file.title}
              className="max-h-[70vh] max-w-full rounded-md object-contain"
            />
          )}

          {!loading && !signedUrl && (
            <p className="text-sm text-muted-foreground">
              Preview unavailable.
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
      }
