import { supabase } from "@/lib/supabase";

const BUCKET = "omni-grimoire-files";

export async function createFileSignedUrl(storagePath: string) {
  const { data, error } = await supabase.storage
    .from(BUCKET)
    .createSignedUrl(storagePath, 60 * 10);

  if (error) throw error;

  return data.signedUrl;
}

export async function downloadFile(
  storagePath: string,
  originalFilename: string,
) {
  const { data, error } = await supabase.storage
    .from(BUCKET)
    .createSignedUrl(storagePath, 60 * 10);

  if (error) throw error;

  const response = await fetch(data.signedUrl);

  if (!response.ok) {
    throw new Error("Could not download the file.");
  }

  const blob = await response.blob();
  const blobUrl = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = blobUrl;
  link.download = originalFilename;
  document.body.appendChild(link);
  link.click();
  link.remove();

  URL.revokeObjectURL(blobUrl);
}
