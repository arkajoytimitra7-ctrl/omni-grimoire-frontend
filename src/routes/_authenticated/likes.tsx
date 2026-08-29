import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Heart } from "lucide-react";

import { EmptyState } from "@/components/common/empty-state";
import { PageHeader } from "@/components/common/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { userLikesQuery } from "@/features/likes/queries";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/_authenticated/likes")({
  head: () => ({
    meta: [
      { title: "Likes — Omni Grimoire" },
      { name: "description", content: "Entries you have favourited in Omni Grimoire." },
    ],
  }),
  component: LikesPage,
});

function LikesPage() {
  const { user } = useAuth();
  const { data, isPending, error } = useQuery(userLikesQuery(user?.id));

  return (
    <>
      <PageHeader title="Likes" description="Everything you have marked worth returning to." />
      {isPending && <Skeleton className="h-24 rounded-xl" />}
      {error && <p className="text-sm text-destructive">{error.message}</p>}
      {data && data.length === 0 && (
        <EmptyState
          icon={Heart}
          title="Nothing liked yet"
          description="Liking entries arrives with the library phase."
        />
      )}
      {data && data.length > 0 && (
        <ul className="space-y-2">
          {data.map((like) => (
            <li key={like.id} className="surface-rune p-4 text-sm">
              <span className="text-muted-foreground">File</span> {like.file_id}
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
