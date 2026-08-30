import { useState, type FormEvent } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/lib/supabase";

type Category = {
  id: string;
  name: string;
  description: string | null;
};

export function CategoryEditDialog({
  category,
  onUpdated,
}: {
  category: Category;
  onUpdated?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(category.name);
  const [description, setDescription] = useState(category.description ?? "");
  const [pending, setPending] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    const trimmedName = name.trim();

    if (!trimmedName) return;

    setPending(true);

    try {
      const { error } = await supabase
        .from("private_categories")
        .update({
          name: trimmedName,
          description: description.trim() || null,
        })
        .eq("id", category.id);

      if (error) throw error;

      toast.success("Category updated.");
      setOpen(false);
      onUpdated?.();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Could not update category.",
      );
    } finally {
      setPending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Edit
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit category</DialogTitle>
          <DialogDescription>
            Update this private category.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor={`category-name-${category.id}`}>
              Name
            </Label>
            <Input
              id={`category-name-${category.id}`}
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
              maxLength={100}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor={`category-description-${category.id}`}>
              Description
            </Label>
            <Textarea
              id={`category-description-${category.id}`}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              rows={4}
              maxLength={500}
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={pending || !name.trim()}
          >
            {pending ? "Saving…" : "Save changes"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
            }
