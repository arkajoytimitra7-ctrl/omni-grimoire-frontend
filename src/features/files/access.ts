import { supabase } from "@/lib/supabase";

const BUCKET = "omni-grimoire-files";

export async function createFileSignedUrl(storagePath: string) {
  const { data, error } = await supabase.storage
    .from(BUCKET)
    .createSignedUrl(storagePath, 60 * 10);

  if (error) throw error;

  return data.signedUrl;
}
