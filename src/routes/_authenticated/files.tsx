import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { BookMarked, FileText, Search } from "lucide-react";
import { useMemo, useState } from "react";

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

function FilesPage() {
  const { user } = useAuth();
  const { data, isPending, error } = useQuery(userFilesQuery(user?.id));
  const [search, setSearch] = useState("");

    const filteredFiles = useMemo(() => {
    if (!data) return [];

    const term = search.trim().toLowerCase();

    if (!term) return data;

    return data.filter((file) =>
      [file.title, file.description, file.mime_type]
        .filter(Boolean)
        .some((value) => value!.toLowerCase().includes(term)),
    );
  }, [data, search]);

    return (
    <>
      <PageHeader
        title="Files"
        description="Your personal collection of files stored in Omni Grimoire."
      />

      <div className="relative">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden
        />

        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search your files..."
          aria-label="Search your files"
          className="h-10 w-full rounded-lg border border-border bg-background pl-9 pr-4 text-sm outline-none transition focus:ring-2 focus:ring-ring"
        />
      </div>

      {isPending && (
        <div className="space-y-3">
          <Skeleton className="h-24 rounded-xl" />
          <Skeleton className="h-24 rounded-xl" />
          <Skeleton className="h-24 rounded-xl" />
        </div>
      )}

      {error && (
        <p className="text-sm text-destructive">
          {error.message}
        </p>
      )}

      {!isPending && !error && data && data.length === 0 && (
        <EmptyState
          icon={BookMarked}
          title="No files yet"
          description="Your grimoire doesn't contain any files yet."
        />
      )}

      {!isPending && !error && data && data.length > 0 && filteredFiles.length === 0 && (
        <EmptyState
          icon={Search}
          title="No matching files"
          description={`No files match "${search}". Try a different search term.`}
        />
      )}

      {!isPending && !error && filteredFiles.length > 0 && (
        <ul className="space-y-3">
          {filteredFiles.map((file) => (
            <li
              key={file.id}
              className="surface-rune flex items-start gap-4 p-4"
            >
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-border">
                <FileText
                  className="size-5 text-primary"
                  aria-hidden
                />
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

                  {file.size_bytes !== null && (
                    <span>
                      {formatFileSize(file.size_bytes)}
                    </span>
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
