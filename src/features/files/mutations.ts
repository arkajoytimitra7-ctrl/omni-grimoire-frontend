import { supabase } from "@/lib/supabase";

const BUCKET = "omni-grimoire-files";

type CreateFileInput = {
  userId: string;
  title: string;
  description: string;
  file: File;
  categoryId: string | null;
  visibility: "private" | "public";
  publicTagIds: string[];
};

function getFileType(mimeType: string): 
  | "image"
  | "pdf"
  | "document"
  | "presentation"
  | "spreadsheet" {
  if (mimeType.startsWith("image/")) return "image";
  if (mimeType === "application/pdf") return "pdf";

  if (
    mimeType.includes("presentation") ||
    mimeType === "application/vnd.ms-powerpoint"
  ) {
    return "presentation";
  }

  if (
    mimeType.includes("spreadsheet") ||
    mimeType === "application/vnd.ms-excel"
  ) {
    return "spreadsheet";
  }

  return "document";
}

export async function createFile({
  userId,
  title,
  description,
  file,
  categoryId,
  visibility,
  publicTagIds,
}: CreateFileInput) {
  const fileId = crypto.randomUUID();

  const safeFilename = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");

  const storagePath = `${userId}/${fileId}-${safeFilename}`;

  const fileType = getFileType(file.type);

  const { error: insertError } = await supabase
    .from("files")
    .insert({
      id: fileId,
      owner_id: userId,
      title,
      description: description || null,
      original_filename: file.name,
      storage_path: storagePath,
      file_type: fileType,
      mime_type: file.type || "application/octet-stream",
      file_size: file.size,
      visibility,
      private_category_id: categoryId,
      is_deleted: false,
    });

  if (insertError) {
    throw insertError;
  }

  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(storagePath, file, {
      contentType: file.type || "application/octet-stream",
      upsert: false,
    });

  if (uploadError) {
    await supabase
      .from("files")
      .delete()
      .eq("id", fileId)
      .eq("owner_id", userId);

    throw uploadError;
  }

  if (publicTagIds.length > 0) {
  const { error: tagError } = await supabase
    .from("file_tags")
    .insert(
      publicTagIds.map((tagId) => ({
        file_id: fileId,
        tag_id: tagId,
      })),
    );

  if (tagError) {
    // Clean up the uploaded file and database row if tag assignment fails.
    await supabase.storage.from(BUCKET).remove([storagePath]);

    await supabase
      .from("files")
      .delete()
      .eq("id", fileId)
      .eq("owner_id", userId);

    throw tagError;
  }
  }

  return fileId;
}

export async function deleteFile({
  userId,
  fileId,
  storagePath,
}: {
  userId: string;
  fileId: string;
  storagePath: string;
}) {
  // Delete the actual Storage object first.
  const { error: storageError } = await supabase.storage
    .from(BUCKET)
    .remove([storagePath]);

  if (storageError) {
    throw storageError;
  }

  // Only after Storage deletion succeeds, soft-delete the database row.
  const { error: databaseError } = await supabase
    .from("files")
    .update({ is_deleted: true })
    .eq("id", fileId)
    .eq("owner_id", userId);

  if (databaseError) {
    throw databaseError;
  }
}
