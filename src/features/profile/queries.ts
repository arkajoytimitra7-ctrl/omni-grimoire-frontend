import { queryOptions } from "@tanstack/react-query";

import type { Profile } from "@/lib/database.types";
import { supabase } from "@/lib/supabase";

/** The signed-in user's profile row (RLS scopes it to the owner). */
export const myProfileQuery = (userId: string | undefined) =>
  queryOptions({
    queryKey: ["profiles", userId],
    enabled: Boolean(userId),
    queryFn: async (): Promise<Profile | null> => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, username, display_name, avatar_url, bio, created_at, updated_at")
        .eq("id", userId!)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
  });
