import { supabase } from "@/lib/supabase";

export async function likeFile({
  userId,
  fileId,
}: {
  userId: string;
  fileId: string;
}) {
  const { error } = await supabase.from("likes").insert({
    user_id: userId,
    file_id: fileId,
  });

  if (error) {
    throw error;
  }
}

export async function unlikeFile({
  userId,
  fileId,
}: {
  userId: string;
  fileId: string;
}) {
  const { error } = await supabase
    .from("likes")
    .delete()
    .eq("user_id", userId)
    .eq("file_id", fileId);

  if (error) {
    throw error;
  }
}
