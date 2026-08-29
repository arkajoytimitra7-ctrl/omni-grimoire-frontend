import { auth, defineMcp } from "@lovable.dev/mcp-js";

import createFileTool from "./tools/create-file";
import listCategoriesTool from "./tools/list-categories";
import listFilesTool from "./tools/list-files";
import listLikesTool from "./tools/list-likes";
import listTagsTool from "./tools/list-tags";
import searchLibraryTool from "./tools/search-library";

// The OAuth issuer must be the direct Supabase host; the project ref is inlined
// by Vite at build time.
const projectRef = import.meta.env["VITE_SUPABASE_PROJECT_ID"] ?? "project-ref-unset";

export default defineMcp({
  name: "omni-grimoire-frontend",
  title: "Omni Grimoire Frontend",
  version: "0.1.0",
  instructions:
    "Tools for Omni Grimoire. Read and create the signed-in user's grimoire entries, browse their private categories, the shared public tags, and their liked entries. All access is scoped to the authenticated user by row level security.",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  tools: [
    listFilesTool,
    searchLibraryTool,
    listCategoriesTool,
    listTagsTool,
    listLikesTool,
    createFileTool,
  ],
});
