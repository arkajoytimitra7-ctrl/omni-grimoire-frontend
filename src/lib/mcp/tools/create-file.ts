import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";

import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "create_file",
  title: "Create grimoire entry",
  description: "Create a new grimoire entry (file record) owned by the signed-in user.",
  inputSchema: {
    title: z.string().describe("Title of the entry."),
    description: z.string().optional().describe("Longer description or body text."),
    category_id: z.string().optional().describe("Private category id to file it under."),
    is_public: z.boolean().optional().describe("Whether the entry is visible in the shared library."),
  },
  annotations: { readOnlyHint: false, destructiveHint: false, openWorldHint: false },
  handler: async ({ title, description, category_id, is_public }, ctx) => {
    if (!ctx.isAuthenticated())
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    const clean = title.trim();
    if (!clean) return { content: [{ type: "text", text: "Title is required" }], isError: true };
    const supabase = supabaseForUser(ctx);
    const { data, error } = await supabase
      .from("files")
      .insert({
        owner_id: ctx.getUserId()!,
        title: clean,
        description: description ?? null,
        private_category_id: category_id ?? null,
        visibility: is_public ? "public" : "private",
      })
      .select("id,title,description,private_category_id,visibility,created_at");
    return error
      ? { content: [{ type: "text", text: error.message }], isError: true }
      : {
          content: [{ type: "text", text: JSON.stringify(data?.[0] ?? null) }],
          structuredContent: { file: data?.[0] ?? null },
        };
  },
});
