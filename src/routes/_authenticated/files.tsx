import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { BookMarked } from "lucide-react";

import { EmptyState } from "@/components/common/empty-state";
import { PageHeader } from "@/components/common/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { userFilesQuery } from "@/features/files/queries";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/_authenticated/files")({
  head: () => ({
    meta: [
      { title: "Files — Omni Grimoire" },
      { name: "description", content: "Manage the files you own in Omni Grimoire." },
    ],
  }),
  component: FilesPage,
});

function FilesPage() {
  const { user } = useAuth();
  const { data, isPending, error } = useQuery(userFilesQuery(user?.id));

  return (
    <>
      <PageHeader title="Files" description="Entries you own, with their storage metadata." />
      {isPending && <Skeleton className="h-28 rounded-xl" />}
      {error && <p className="text-sm text-destructive">{error.message}</p>}
      {data && data.length === 0 && (
        <EmptyState
          icon={BookMarked}
          title="No files yet"
          description="File creation and upload arrive in the next phase."
        />
      )}
      {data && data.length > 0 && (
        <ul className="space-y-3">
          {data.map((file) => (
            <li key={file.id} className="surface-rune flex items-center justify-between gap-4 p-4">
              <div className="min-w-0">
                <h2 className="truncate text-base font-semibold">{file.title}</h2>
                <p className="truncate text-xs text-muted-foreground">
                  {file.mime_type ?? "unknown type"}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
