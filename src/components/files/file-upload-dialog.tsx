import { useState, type ChangeEvent, type FormEvent } from "react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

type Category = {
  id: string;
  name: string;
};

type PublicTag = {
  id: string;
  name: string;
  slug: string;
};

type FileUploadData = {
  title: string;
  description: string;
  file: File;
  categoryId: string | null;
  visibility: "private" | "public";
  publicTagIds: string[];
};

const MAX_FILE_SIZE = 50 * 1024 * 1024;

const ALLOWED_MIME_TYPES = new Set([
  "application/pdf",
  "text/plain",
  "text/markdown",
  "application/rtf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
]);

export function FileUploadDialog({
  categories,
  publicTags,
  onSubmit,
}: {
  categories: Category[];
  publicTags: PublicTag[];
  onSubmit?: (data: FileUploadData) => Promise<void> | void;
}) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [categoryId, setCategoryId] = useState("none");
  const [publicTagIds, setPublicTagIds] = useState<string[]>([]);
  const [visibility, setVisibility] =
    useState<"private" | "public">("private");
  const [pending, setPending] = useState(false);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selected = event.target.files?.[0] ?? null;

    if (!selected) {
      setFile(null);
      return;
    }

    if (selected.size > MAX_FILE_SIZE) {
      toast.error("File is too large. Maximum size is 50 MB.");
      event.target.value = "";
      setFile(null);
      return;
    }

    if (!ALLOWED_MIME_TYPES.has(selected.type)) {
      toast.error("This file type is not supported.");
      event.target.value = "";
      setFile(null);
      return;
    }

    setFile(selected);

    if (!title.trim()) {
      setTitle(selected.name.replace(/\.[^/.]+$/, ""));
    }
  };

  const togglePublicTag = (tagId: string) => {
  setPublicTagIds((current) =>
    current.includes(tagId)
      ? current.filter((id) => id !== tagId)
      : [...current, tagId],
  );
};

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!file) {
      toast.error("Please select a file.");
      return;
    }

    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      toast.error("Please enter a title.");
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      toast.error("File is too large. Maximum size is 50 MB.");
      return;
    }

    if (!ALLOWED_MIME_TYPES.has(file.type)) {
      toast.error("This file type is not supported.");
      return;
    }

    setPending(true);

    try {
      await onSubmit?.({
  title: trimmedTitle,
  description: description.trim(),
  file,
  categoryId: categoryId === "none" ? null : categoryId,
  visibility,
  publicTagIds,
});

      setOpen(false);
      setTitle("");
      setDescription("");
      setFile(null);
      setCategoryId("none");
      setPublicTagIds([]);
      setVisibility("private");
    } catch {
      // The upload handler is responsible for displaying its own error.
    } finally {
      setPending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add file</Button>
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add to your grimoire</DialogTitle>
          <DialogDescription>
            Upload a supported file and optionally organize it into a
            category.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="file-upload">File</Label>
            <Input
              id="file-upload"
              type="file"
              required
              onChange={handleFileChange}
            />

            {file && (
              <p className="text-xs text-muted-foreground">
                {file.name} · {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
            )}

            <p className="text-xs text-muted-foreground">
              Maximum 50 MB. Supported documents and common image formats.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="file-title">Title</Label>
            <Input
              id="file-title"
              required
              maxLength={200}
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="My study notes"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="file-description">Description</Label>
            <Textarea
              id="file-description"
              maxLength={1000}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="A short description of this file"
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label>Category</Label>
            <Select value={categoryId} onValueChange={setCategoryId}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a category" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="none">No category</SelectItem>

                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
  <Label>Public Tags</Label>

  <div className="flex flex-wrap gap-2">
    {publicTags.map((tag) => {
      const selected = publicTagIds.includes(tag.id);

      return (
        <button
          key={tag.id}
          type="button"
          onClick={() => togglePublicTag(tag.id)}
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
    <p className="text-xs text-muted-foreground">
      No public tags are currently available.
    </p>
  )}

  <p className="text-xs text-muted-foreground">
    Select one or more public tags to help organize this file in the Library.
  </p>
</div>

          <div className="space-y-2">
            <Label>Visibility</Label>

            <Select
              value={visibility}
              onValueChange={(value) =>
                setVisibility(value as "private" | "public")
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="private">Private</SelectItem>
                <SelectItem value="public">Public</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={pending || !file || !title.trim()}
          >
            {pending ? "Preparing…" : "Add file"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
