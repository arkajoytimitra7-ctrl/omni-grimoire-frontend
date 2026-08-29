import { queryOptions } from "@tanstack/react-query";

import type { GrimoireFile } from "@/lib/database.types";
import { supabase } from "@/lib/supabase";

const FILE_COLUMNS =
  "id, user_id, category_id, title, description, storage_path, mime_type, size_bytes, is_public, created_at, updated_at";

/** Shared library: whatever the RLS policies expose to the current viewer. */
export const libraryFilesQuery = queryOptions({
  queryKey: ["files", "library"],
  queryFn: async (): Promise<GrimoireFile[]> => {
    const { data, error } = await supabase
      .from("files")
      .select(FILE_COLUMNS)
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) throw error;
    return data ?? [];
  },
});

/** Files owned by a specific user. */
export const userFilesQuery = (userId: string | undefined) =>
  queryOptions({
    queryKey: ["files", "owned", userId],
    enabled: Boolean(userId),
    queryFn: async (): Promise<GrimoireFile[]> => {
      const { data, error } = await supabase
        .from("files")
        .select(FILE_COLUMNS)
        .eq("user_id", userId!)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data ?? [];
    },
  });
