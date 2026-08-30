import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { FileText, Image, Library } from "lucide-react";

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

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";

  const units = ["B", "KB", "MB", "GB"];
  const exponent = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    units.length - 1,
  );

  const value = bytes / 1024 ** exponent;

  return `${value.toFixed(exponent === 0 ? 0 : 1)} ${units[exponent]}`;
}

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
            <li
  key={file.id}
  className="surface-rune flex items-start gap-4 p-4"
>
  <div className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-border">
    {file.mime_type?.startsWith("image/") ? (
      <Image
        className="size-5 text-primary"
        aria-hidden
      />
    ) : (
      <FileText
        className="size-5 text-primary"
        aria-hidden
      />
    )}
  </div>

  <div className="min-w-0 flex-1">
    <h2 className="truncate text-base font-semibold">
      {file.title}
    </h2>

    {file.description && (
      <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
        {file.description}
      </p>
    )}

    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
      <span>{file.mime_type ?? "Unknown type"}</span>

      {file.file_size !== null && (
        <span>{formatFileSize(file.file_size)}</span>
      )}

      <span>
        {new Date(file.created_at).toLocaleDateString()}
      </span>
    </div>
  </div>
</li>
          ))}
        </ul>
      )}
    </>
  );
}
