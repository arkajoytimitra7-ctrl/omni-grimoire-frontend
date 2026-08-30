import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { FileText, Image, Library } from "lucide-react";
import { useMemo, useState } from "react";

import { EmptyState } from "@/components/common/empty-state";
import { PageHeader } from "@/components/common/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { libraryFilesQuery } from "@/features/files/queries";

import { Download, ExternalLink, Search } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { FilePreviewDialog } from "@/components/files/file-preview-dialog";
import {
  createFileSignedUrl,
  downloadFile,
} from "@/features/files/access";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  const [search, setSearch] = useState("");
  const [fileType, setFileType] = useState("all");

  const filteredFiles = useMemo(() => {
  if (!data) return [];

  const term = search.trim().toLowerCase();

  return data.filter((file) => {
    const matchesSearch =
      !term ||
      [file.title, file.description, file.mime_type]
        .filter(Boolean)
        .some((value) =>
          value!.toLowerCase().includes(term),
        );

    const matchesFileType =
      fileType === "all" ||
      file.mime_type?.startsWith(`${fileType}/`);

    return matchesSearch && matchesFileType;
  });
}, [data, search, fileType]);

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
      <PageHeader title="Library" description="Entries visible to you across the grimoire." />

      <div className="relative">
  <Search
    className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
    aria-hidden
  />

  <input
    type="search"
    value={search}
    onChange={(event) => setSearch(event.target.value)}
    placeholder="Search the library..."
    aria-label="Search the library"
    className="h-10 w-full rounded-lg border border-border bg-background pl-9 pr-4 text-sm outline-none transition focus:ring-2 focus:ring-ring"
  />
</div>
      <div className="flex flex-col gap-3 sm:flex-row">
  <Select value={fileType} onValueChange={setFileType}>
    <SelectTrigger className="w-full sm:w-48">
      <SelectValue placeholder="File type" />
    </SelectTrigger>

    <SelectContent>
      <SelectItem value="all">All types</SelectItem>
      <SelectItem value="image">Images</SelectItem>
      <SelectItem value="application">Documents</SelectItem>
      <SelectItem value="text">Text</SelectItem>
      <SelectItem value="audio">Audio</SelectItem>
      <SelectItem value="video">Video</SelectItem>
    </SelectContent>
  </Select>
</div>
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
      {!isPending &&
  !error &&
  data &&
  data.length > 0 &&
  filteredFiles.length === 0 && (
    <EmptyState
      icon={Search}
      title="No matching files"
      description={`No files match "${search}". Try a different search term.`}
    />
  )}
      {filteredFiles.length > 0 && (
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filteredFiles.map((file) => (
            <li
  key={file.id}
  className="surface-rune flex flex-col gap-4 p-4"
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
              <div className="flex flex-wrap gap-2">
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
</div>
</li>
          ))}
        </ul>
      )}
    </>
  );
}
