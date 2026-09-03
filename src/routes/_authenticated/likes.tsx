import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Download, ExternalLink, FileText, Heart, Image } from "lucide-react";
import { useMemo } from "react";
import { toast } from "sonner";

import { EmptyState } from "@/components/common/empty-state";
import { FileLikeButton } from "@/components/files/file-like-button";
import { PageHeader } from "@/components/common/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  createFileSignedUrl,
  downloadFile,
} from "@/features/files/access";
import {
  fileLikeCountsQuery,
  userLikesQuery,
} from "@/features/likes/queries";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/_authenticated/likes")({
  head: () => ({
    meta: [
      { title: "Likes — Omni Grimoire" },
      {
        name: "description",
        content: "Entries you have favourited in Omni Grimoire.",
      },
    ],
  }),
  component: LikesPage,
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

function LikesPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data, isPending, error } = useQuery(
    userLikesQuery(user?.id),
  );

  const fileIds = useMemo(
    () => (data ?? []).map((like) => like.file_id),
    [data],
  );

  const { data: likeCounts = {} } = useQuery(
    fileLikeCountsQuery(fileIds),
  );

  const handleOpenFile = async (storagePath: string | null) => {
    try {
      if (!storagePath) {
        throw new Error("This entry has no stored file.");
      }

      const signedUrl = await createFileSignedUrl(storagePath);

      window.open(
        signedUrl,
        "_blank",
        "noopener,noreferrer",
      );
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Could not open this file.",
      );
    }
  };

  const handleDownloadFile = async (
    storagePath: string | null,
    originalFilename: string | null,
  ) => {
    try {
      if (!storagePath) {
        throw new Error("This entry has no stored file.");
      }

      await downloadFile(
        storagePath,
        originalFilename ?? "download",
      );
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
        title="Likes"
        description="Everything you have marked worth returning to."
      />

      {isPending && (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton
              key={index}
              className="h-32 rounded-xl"
            />
          ))}
        </div>
      )}

      {error && (
        <p className="text-sm text-destructive">
          {error.message}
        </p>
      )}

      {data && data.length === 0 && (
        <EmptyState
          icon={Heart}
          title="Nothing liked yet"
          description="Like entries from the Library and they will appear here."
        />
      )}

      {data && data.length > 0 && (
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {data.map((like) => {
            const file = like.file;

            if (!file) {
              return null;
            }

            return (
              <li
                key={like.file_id}
                className="surface-panel flex flex-col gap-4 p-4"
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
                    <span>
                      {file.mime_type ?? "Unknown type"}
                    </span>

                    {file.file_size !== null && (
                      <span>
                        {formatFileSize(file.file_size)}
                      </span>
                    )}

                    <span>
                      {new Date(
                        file.created_at,
                      ).toLocaleDateString()}
                    </span>

                    <span className="inline-flex items-center gap-1">
                      <Heart className="size-3.5" aria-hidden />
                      {likeCounts[file.id] ?? 0}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <FileLikeButton
                    userId={user!.id}
                    fileId={file.id}
                    initiallyLiked
                    onChanged={() => {
                      void queryClient.invalidateQueries({
                        queryKey: ["likes", user!.id],
                      });

                      void queryClient.invalidateQueries({
                        queryKey: ["likes", "counts"],
                      });
                    }}
                  />

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      void handleOpenFile(file.storage_path)
                    }
                  >
                    <ExternalLink
                      className="mr-2 size-4"
                      aria-hidden
                    />
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
                    <Download
                      className="mr-2 size-4"
                      aria-hidden
                    />
                    Download
                  </Button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
        }
