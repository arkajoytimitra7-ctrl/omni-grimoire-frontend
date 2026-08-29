import { queryOptions } from "@tanstack/react-query";

import type { GrimoireFile } from "@/lib/database.types";
import { supabase } from "@/lib/supabase";

const FILE_COLUMNS =
  "id, owner_id, title, description, original_filename, storage_path, file_type, mime_type, file_size, visibility, private_category_id, is_deleted, created_at, updated_at";

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
        .eq("owner_id", userId!)
        .eq("is_deleted", false)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data ?? [];
    },
  });
