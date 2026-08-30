import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";

export function CategoryDeleteButton({
  categoryId,
  onDeleted,
}: {
  categoryId: string;
  onDeleted?: () => void;
}) {
  const [pending, setPending] = useState(false);

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Delete this category? Files assigned to it will remain safe but become uncategorized.",
    );

    if (!confirmed) return;

    setPending(true);

    try {
      const { error } = await supabase
        .from("private_categories")
        .delete()
        .eq("id", categoryId);

      if (error) throw error;

      toast.success("Category deleted.");
      onDeleted?.();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Could not delete category.",
      );
    } finally {
      setPending(false);
    }
  };

  return (
    <Button
      variant="destructive"
      size="sm"
      onClick={handleDelete}
      disabled={pending}
    >
      {pending ? "Deleting…" : "Delete"}
    </Button>
  );
}
