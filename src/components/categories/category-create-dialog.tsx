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

export function CategoryCreateDialog({
  userId,
  onCreated,
}: {
  userId: string;
  onCreated?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [pending, setPending] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    const trimmedName = name.trim();
    const trimmedDescription = description.trim();

    if (!trimmedName) return;

    setPending(true);

    try {
      const { error } = await supabase
        .from("private_categories")
        .insert({
          user_id: userId,
          name: trimmedName,
          description: trimmedDescription || null,
        });

      if (error) throw error;

      toast.success("Category created.");

      setName("");
      setDescription("");
      setOpen(false);

      onCreated?.();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not create category.",
      );
    } finally {
      setPending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Create category</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create category</DialogTitle>
          <DialogDescription>
            Create a private shelf for organizing your grimoire.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="category-name">Name</Label>
            <Input
              id="category-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Chemistry"
              required
              maxLength={100}
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category-description">
              Description
            </Label>
            <Textarea
              id="category-description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="A collection of chemistry notes and resources."
              rows={4}
              maxLength={500}
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={pending || !name.trim()}
          >
            {pending ? "Creating…" : "Create category"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
      }
