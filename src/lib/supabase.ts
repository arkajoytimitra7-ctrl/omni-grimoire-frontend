import { createClient } from "@supabase/supabase-js";

import type { Database } from "./database.types";

const supabaseUrl = import.meta.env["VITE_SUPABASE_URL"] as string | undefined;
const supabaseKey = import.meta.env["VITE_SUPABASE_PUBLISHABLE_KEY"] as string | undefined;

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    "Missing VITE_SUPABASE_URL / VITE_SUPABASE_PUBLISHABLE_KEY. Check your environment configuration.",
  );
}

/**
 * Browser Supabase client for the existing Omni Grimoire project.
 * Row Level Security applies — the publishable key is safe in the bundle.
 */
export const supabase = createClient<Database>(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storageKey: "omni-grimoire-auth",
  },
});
