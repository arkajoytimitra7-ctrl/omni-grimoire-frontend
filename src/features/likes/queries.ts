import { queryOptions } from "@tanstack/react-query";

import type { GrimoireFile } from "@/lib/database.types";
import { supabase } from "@/lib/supabase";

export type LikedFile = {
  user_id: string;
  file_id: string;
  created_at: string;
  file: GrimoireFile | null;
};

/** Files liked by the signed-in user. */
export const userLikesQuery = (userId: string | undefined) =>
  queryOptions({
    queryKey: ["likes", userId],
    enabled: Boolean(userId),

    queryFn: async (): Promise<LikedFile[]> => {
      const { data, error } = await supabase
        .from("likes")
        .select(`
          user_id,
          file_id,
          created_at,
          files (
            id,
            owner_id,
            title,
            description,
            original_filename,
            storage_path,
            file_type,
            mime_type,
            file_size,
            visibility,
            private_category_id,
            is_deleted,
            created_at,
            updated_at
          )
        `)
        .eq("user_id", userId!)
        .order("created_at", { ascending: false });

      if (error) throw error;

      return (data ?? []).map((like) => ({
        user_id: like.user_id,
        file_id: like.file_id,
        created_at: like.created_at,
        file: like.files as unknown as GrimoireFile | null,
      }));
    },
  });
