import { supabase } from "@/lib/supabase";

export async function updateFilePublicTags({
  fileId,
  tagIds,
}: {
  fileId: string;
  tagIds: string[];
}) {
  const uniqueTagIds = [...new Set(tagIds)];

  const { error: deleteError } = await supabase
    .from("file_tags")
    .delete()
    .eq("file_id", fileId);

  if (deleteError) {
    throw deleteError;
  }

  if (uniqueTagIds.length === 0) {
    return;
  }

  const { error: insertError } = await supabase
    .from("file_tags")
    .insert(
      uniqueTagIds.map((tagId) => ({
        file_id: fileId,
        tag_id: tagId,
      })),
    );

  if (insertError) {
    throw insertError;
  }
}
