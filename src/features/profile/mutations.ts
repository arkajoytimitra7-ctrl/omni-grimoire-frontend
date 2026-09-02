import { useMutation, useQueryClient } from "@tanstack/react-query";

import { supabase } from "@/lib/supabase";

export type UpdateProfileInput = {
  userId: string;
  displayName: string;
  bio: string;
};

export async function updateProfile({
  userId,
  displayName,
  bio,
}: UpdateProfileInput) {
  const { data, error } = await supabase
    .from("profiles")
    .update({
      display_name: displayName,
      bio,
    })
    .eq("id", userId)
    .select("id, display_name, avatar_url, bio, created_at, updated_at")
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProfile,
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({
        queryKey: ["profiles", variables.userId],
      });
    },
  });
}
