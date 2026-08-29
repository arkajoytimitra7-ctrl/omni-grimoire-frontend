import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Tags } from "lucide-react";

import { EmptyState } from "@/components/common/empty-state";
import { PageHeader } from "@/components/common/page-header";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { publicTagsQuery } from "@/features/tags/queries";

export const Route = createFileRoute("/_authenticated/tags")({
  head: () => ({
    meta: [
      { title: "Tags — Omni Grimoire" },
      { name: "description", content: "Public tags shared across the Omni Grimoire library." },
    ],
  }),
  component: TagsPage,
});

function TagsPage() {
  const { data, isPending, error } = useQuery(publicTagsQuery);

  return (
    <>
      <PageHeader title="Tags" description="Public vocabulary shared by every scribe." />
      {isPending && (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-24 rounded-xl" />
          ))}
        </div>
      )}
      {error && <p className="text-sm text-destructive">{error.message}</p>}
      {data && data.length === 0 && (
        <EmptyState icon={Tags} title="No tags yet" description="Public tags will appear here." />
      )}
      {data && data.length > 0 && (
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {data.map((tag) => (
            <li key={tag.id} className="surface-rune p-4">
              <div className="flex items-center justify-between gap-2">
                <h2 className="text-base font-semibold">{tag.name}</h2>
                <Badge variant="secondary">{tag.slug}</Badge>
              </div>
              {tag.description && (
                <p className="mt-2 text-sm text-muted-foreground">{tag.description}</p>
              )}
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
