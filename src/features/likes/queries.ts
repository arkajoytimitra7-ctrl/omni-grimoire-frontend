import { queryOptions } from "@tanstack/react-query";

import type { GrimoireFile } from "@/lib/database.types";
import { supabase } from "@/lib/supabase";

export type LikedFile = {
  user_id: string;
  file_id: string;
  created_at: string;
  file: GrimoireFile | null;
};

/**
 * Files liked by the signed-in user.
 *
 * Query strategy:
 * 1. Get the user's likes.
 * 2. Fetch the corresponding files explicitly.
 * 3. Combine the two datasets.
 *
 * This avoids relying on a nested Supabase relationship
 * between `likes` and `files`.
 */
export const userLikesQuery = (userId: string | undefined) =>
  queryOptions({
    queryKey: ["likes", userId],
    enabled: Boolean(userId),

    queryFn: async (): Promise<LikedFile[]> => {
      if (!userId) {
        return [];
      }

      const { data: likes, error: likesError } = await supabase
        .from("likes")
        .select("user_id, file_id, created_at")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (likesError) {
        throw likesError;
      }

      if (!likes || likes.length === 0) {
        return [];
      }

      const fileIds = likes.map((like) => like.file_id);

      const { data: files, error: filesError } = await supabase
        .from("files")
        .select("*")
        .in("id", fileIds)
        .eq("is_deleted", false);

      if (filesError) {
        throw filesError;
      }

      const filesById = new Map(
        (files ?? []).map((file) => [
          file.id,
          file as unknown as GrimoireFile,
        ]),
      );

      return likes.map((like) => ({
        user_id: like.user_id,
        file_id: like.file_id,
        created_at: like.created_at,
        file: filesById.get(like.file_id) ?? null,
      }));
    },
  });

export const fileLikeCountsQuery = (fileIds: string[]) =>
  queryOptions({
    queryKey: ["likes", "counts", fileIds],
    enabled: fileIds.length > 0,

    queryFn: async (): Promise<Record<string, number>> => {
      if (fileIds.length === 0) {
        return {};
      }

      const { data, error } = await supabase
        .from("likes")
        .select("file_id")
        .in("file_id", fileIds);

      if (error) {
        throw error;
      }

      return (data ?? []).reduce<Record<string, number>>(
        (counts, like) => {
          counts[like.file_id] = (counts[like.file_id] ?? 0) + 1;
          return counts;
        },
        {},
      );
    },
  });
