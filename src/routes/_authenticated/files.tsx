import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createFile } from "@/features/files/mutations";
import { createFileRoute } from "@tanstack/react-router";
import { BookMarked, 
         FileText, 
         Search, 
         ExternalLink,
         Download,
       } from "lucide-react";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/common/empty-state";
import { PageHeader } from "@/components/common/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { userFilesQuery } from "@/features/files/queries";
import { privateCategoriesQuery } from "@/features/categories/queries";
import { useAuth } from "@/hooks/use-auth";
import { FileUploadDialog } from "@/components/files/file-upload-dialog";
import { FilePreviewDialog } from "@/components/files/file-preview-dialog";
import { createFileSignedUrl,
         downloadFile,
       } from "@/features/files/access";

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
  const queryClient = useQueryClient();

const { data, isPending, error } = useQuery(userFilesQuery(user?.id));

const { data: categories = [] } = useQuery(
  privateCategoriesQuery(user?.id),
);

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

  const handleOpenFile = async (storagePath: string) => {
  try {
    const signedUrl = await createFileSignedUrl(storagePath);
    window.open(signedUrl, "_blank", "noopener,noreferrer");
  } catch (error) {
    toast.error(
      error instanceof Error
        ? error.message
        : "Could not open this file.",
    );
  }
};

  const handleDownloadFile = async (
  storagePath: string,
  originalFilename: string,
) => {
  try {
    await downloadFile(storagePath, originalFilename);
  } catch (error) {
    toast.error(
      error instanceof Error
        ? error.message
        : "Could not download this file.",
    );
  }
};

    return (
    <>
      <PageHeader
  title="Files"
  description="Your personal collection of files stored in Omni Grimoire."
  actions={
  <FileUploadDialog
    categories={categories}
    onSubmit={async ({
      title,
      description,
      file,
      categoryId,
      visibility,
    }) => {
      if (!user) {
        toast.error("You must be signed in to upload a file.");
        return;
      }

      try {
        await createFile({
          userId: user.id,
          title,
          description,
          file,
          categoryId,
          visibility,
        });

        await queryClient.invalidateQueries({
          queryKey: ["files", "owned", user.id],
        });

        toast.success("File uploaded successfully.");
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : "Could not upload file.",
        );

        throw error;
      }
    }}
  />
  }
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

                  {file.file_size !== null && (
                    <span>
                      {formatFileSize(file.file_size)}
                    </span>
                  )}

                  <span>
                    {new Date(file.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
                     {file.mime_type?.startsWith("image/") && (
  <FilePreviewDialog file={file} />
)}
              <Button
  variant="outline"
  size="sm"
  onClick={() => void handleOpenFile(file.storage_path)}
>
  <ExternalLink className="mr-2 size-4" aria-hidden />
  Open
</Button>
   <Button
  variant="outline"
  size="sm"
  onClick={() =>
    void handleDownloadFile(
      file.storage_path,
      file.original_filename,
    )
  }
>
  <Download className="mr-2 size-4" aria-hidden />
  Download
</Button>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
