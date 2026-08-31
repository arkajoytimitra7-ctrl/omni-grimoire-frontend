import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";

import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "list_files",
  title: "List grimoire entries",
  description:
    "List the signed-in user's grimoire entries (files), newest first. Optionally filter by category or public visibility.",
  inputSchema: {
    category_id: z.string().optional().describe("Only entries in this private category id."),
    only_public: z.boolean().optional().describe("Restrict to entries marked public."),
    limit: z.number().int().optional().describe("Maximum rows to return (default 25, max 100)."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ category_id, only_public, limit }, ctx) => {
    if (!ctx.isAuthenticated())
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    const supabase = supabaseForUser(ctx);
    let query = supabase
      .from("files")
      .select("id,title,description,private_category_id,visibility,mime_type,file_size,created_at")
      .eq("owner_id", ctx.getUserId()!)
      .order("created_at", { ascending: false })
      .limit(Math.min(Math.max(limit ?? 25, 1), 100));
    if (category_id) query = query.eq("private_category_id", category_id);
    if (only_public) query = query.eq("visibility", "public");
    const { data, error } = await query;
    return error
      ? { content: [{ type: "text", text: error.message }], isError: true }
      : {
          content: [{ type: "text", text: JSON.stringify(data ?? []) }],
          structuredContent: { files: data ?? [] },
        };
  },
});
