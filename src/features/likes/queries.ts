import { queryOptions } from "@tanstack/react-query";

import type { Like } from "@/lib/database.types";
import { supabase } from "@/lib/supabase";

/** Likes belonging to the signed-in user. */
export const userLikesQuery = (userId: string | undefined) =>
  queryOptions({
    queryKey: ["likes", userId],
    enabled: Boolean(userId),
    queryFn: async (): Promise<Like[]> => {
      const { data, error } = await supabase
        .from("likes")
        .select("user_id, file_id, created_at")
        .eq("user_id", userId!)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data ?? [];
    },
  });
