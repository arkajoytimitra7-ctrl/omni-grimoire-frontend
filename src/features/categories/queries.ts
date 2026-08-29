import { queryOptions } from "@tanstack/react-query";

import type { PrivateCategory } from "@/lib/database.types";
import { supabase } from "@/lib/supabase";

/** Private categories are owner-scoped by RLS on the live database. */
export const privateCategoriesQuery = (userId: string | undefined) =>
  queryOptions({
    queryKey: ["private_categories", userId],
    enabled: Boolean(userId),
    queryFn: async (): Promise<PrivateCategory[]> => {
      const { data, error } = await supabase
        .from("private_categories")
        .select("id, user_id, name, description, created_at")
        .eq("user_id", userId!)
        .order("name", { ascending: true });

      if (error) throw error;
      return data ?? [];
    },
  });
