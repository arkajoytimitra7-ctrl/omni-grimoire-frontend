import { useState, type ChangeEvent, type FormEvent } from "react";

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

export function FileUploadDialog({
  categories,
  onSubmit,
}: {
  categories: Category[];
  onSubmit?: (data: {
    title: string;
    description: string;
    file: File;
    categoryId: string | null;
    visibility: "private" | "public";
  }) => Promise<void> | void;
}) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [categoryId, setCategoryId] = useState<string>("none");
  const [visibility, setVisibility] = useState<"private" | "public">("private");
  const [pending, setPending] = useState(false);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selected = event.target.files?.[0] ?? null;

    setFile(selected);

    if (selected && !title.trim()) {
      setTitle(selected.name.replace(/\.[^/.]+$/, ""));
    }
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!file) return;

    setPending(true);

    try {
      await onSubmit?.({
        title: title.trim(),
        description: description.trim(),
        file,
        categoryId: categoryId === "none" ? null : categoryId,
        visibility,
      });

      setOpen(false);
      setTitle("");
      setDescription("");
      setFile(null);
      setCategoryId("none");
      setVisibility("private");
    } finally {
      setPending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add file</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add to your grimoire</DialogTitle>
          <DialogDescription>
            Upload a file and bind it to your library.
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
          </div>

          <div className="space-y-2">
            <Label htmlFor="file-title">Title</Label>
            <Input
              id="file-title"
              required
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="My study notes"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="file-description">Description</Label>
            <Textarea
              id="file-description"
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

          <Button type="submit" className="w-full" disabled={pending || !file}>
            {pending ? "Preparing…" : "Add file"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
    }
