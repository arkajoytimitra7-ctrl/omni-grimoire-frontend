import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";

import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "search_library",
  title: "Search the library",
  description:
    "Search grimoire entries visible to the signed-in user by title or description text.",
  inputSchema: {
    query: z.string().describe("Text to match against entry titles and descriptions."),
    limit: z.number().int().optional().describe("Maximum rows to return (default 20, max 100)."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ query, limit }, ctx) => {
    if (!ctx.isAuthenticated())
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    const term = query.trim().replace(/[%,]/g, " ");
    if (!term) return { content: [{ type: "text", text: "Query is empty" }], isError: true };
    const supabase = supabaseForUser(ctx);
    const { data, error } = await supabase
      .from("files")
      .select("id,user_id,title,description,is_public,created_at")
      .or(`title.ilike.%${term}%,description.ilike.%${term}%`)
      .order("created_at", { ascending: false })
      .limit(Math.min(Math.max(limit ?? 20, 1), 100));
    return error
      ? { content: [{ type: "text", text: error.message }], isError: true }
      : {
          content: [{ type: "text", text: JSON.stringify(data ?? []) }],
          structuredContent: { results: data ?? [] },
        };
  },
});
