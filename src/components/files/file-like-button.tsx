import { useState } from "react";
import { Heart } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { likeFile, unlikeFile } from "@/features/likes/mutations";

type FileLikeButtonProps = {
  userId: string;
  fileId: string;
  initiallyLiked: boolean;
  onChanged?: () => void | Promise<void>;
};

export function FileLikeButton({
  userId,
  fileId,
  initiallyLiked,
  onChanged,
}: FileLikeButtonProps) {
  const [liked, setLiked] = useState(initiallyLiked);
  const [pending, setPending] = useState(false);

  const handleToggle = async () => {
    if (pending) return;

    const previousLiked = liked;

    setLiked(!previousLiked);
    setPending(true);

    try {
      if (previousLiked) {
        await unlikeFile({
          userId,
          fileId,
        });
      } else {
        await likeFile({
          userId,
          fileId,
        });
      }

      await onChanged?.();
    } catch (error) {
      setLiked(previousLiked);

      toast.error(
        error instanceof Error
          ? error.message
          : "Could not update like.",
      );
    } finally {
      setPending(false);
    }
  };

  return (
    <Button
      type="button"
      variant={liked ? "default" : "outline"}
      size="sm"
      disabled={pending}
      onClick={() => void handleToggle()}
      aria-label={liked ? "Unlike file" : "Like file"}
      aria-pressed={liked}
    >
      <Heart
        className={`mr-2 size-4 ${liked ? "fill-current" : ""}`}
        aria-hidden
      />
      {liked ? "Liked" : "Like"}
    </Button>
  );
}
