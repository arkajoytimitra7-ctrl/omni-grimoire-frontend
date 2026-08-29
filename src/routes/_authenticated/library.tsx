import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Library } from "lucide-react";

import { EmptyState } from "@/components/common/empty-state";
import { PageHeader } from "@/components/common/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { libraryFilesQuery } from "@/features/files/queries";

export const Route = createFileRoute("/_authenticated/library")({
  head: () => ({
    meta: [
      { title: "Library — Omni Grimoire" },
      { name: "description", content: "Browse the shared Omni Grimoire collection." },
    ],
  }),
  component: LibraryPage,
});

function LibraryPage() {
  const { data, isPending, error } = useQuery(libraryFilesQuery);

  return (
    <>
      <PageHeader title="Library" description="Entries visible to you across the grimoire." />
      {isPending && (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-28 rounded-xl" />
          ))}
        </div>
      )}
      {error && <p className="text-sm text-destructive">{error.message}</p>}
      {data && data.length === 0 && (
        <EmptyState
          icon={Library}
          title="The shelves are bare"
          description="No entries are visible yet. Once files are added they will appear here."
        />
      )}
      {data && data.length > 0 && (
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {data.map((file) => (
            <li key={file.id} className="surface-rune p-4">
              <h2 className="truncate text-base font-semibold">{file.title}</h2>
              {file.description && (
                <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                  {file.description}
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
