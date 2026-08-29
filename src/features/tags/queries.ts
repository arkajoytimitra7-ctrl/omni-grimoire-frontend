import { queryOptions } from "@tanstack/react-query";

import type { PublicTag } from "@/lib/database.types";
import { supabase } from "@/lib/supabase";

/** Public tags are readable by everyone (anon SELECT policy on the live DB). */
export const publicTagsQuery = queryOptions({
  queryKey: ["public_tags"],
  queryFn: async (): Promise<PublicTag[]> => {
    const { data, error } = await supabase
      .from("public_tags")
      .select("id, name, slug, description, icon, created_at")
      .order("name", { ascending: true });

    if (error) throw error;
    return data ?? [];
  },
});
