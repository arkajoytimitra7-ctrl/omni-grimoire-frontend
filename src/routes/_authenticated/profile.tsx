import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { CalendarDays, Mail, Pencil, UserCircle } from "lucide-react";

import { PageHeader } from "@/components/common/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { myProfileQuery } from "@/features/profile/queries";
import { useUpdateProfile } from "@/features/profile/mutations";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/_authenticated/profile")({
  head: () => ({
    meta: [
      { title: "Profile — Omni Grimoire" },
      {
        name: "description",
        content: "View and edit your Omni Grimoire profile.",
      },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  const { user } = useAuth();

  const {
    data: profile,
    isPending,
    error,
  } = useQuery(myProfileQuery(user?.id));

  const updateProfileMutation = useUpdateProfile();

  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");

  useEffect(() => {
    if (!profile) return;

    setDisplayName(profile.display_name ?? "");
    setBio(profile.bio ?? "");
  }, [profile]);

  const handleEdit = () => {
    setDisplayName(profile?.display_name ?? "");
    setBio(profile?.bio ?? "");
    setIsEditing(true);
  };

  const handleCancel = () => {
    setDisplayName(profile?.display_name ?? "");
    setBio(profile?.bio ?? "");
    setIsEditing(false);
    updateProfileMutation.reset();
  };

  const handleSave = async () => {
    if (!user?.id) return;

    const trimmedDisplayName = displayName.trim();
    const trimmedBio = bio.trim();

    if (!trimmedDisplayName) {
      return;
    }

    try {
      await updateProfileMutation.mutateAsync({
        userId: user.id,
        displayName: trimmedDisplayName,
        bio: trimmedBio,
      });

      setIsEditing(false);
    } catch {
      // The mutation error is displayed below.
    }
  };

  return (
    <>
      <PageHeader
        title="Profile"
        description="Your identity and profile information."
      />

      {isPending && (
        <div className="max-w-2xl space-y-4">
          <Skeleton className="h-32 rounded-xl" />
          <Skeleton className="h-48 rounded-xl" />
        </div>
      )}

      {error && (
        <p className="text-sm text-destructive">
          {error.message}
        </p>
      )}

      {!isPending && !error && (
        <div className="max-w-2xl space-y-4">
          {/* Identity */}
          <section className="surface-rune p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex min-w-0 items-start gap-4">
                <div className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border bg-muted">
                  {profile?.avatar_url ? (
                    <img
                      src={profile.avatar_url}
                      alt=""
                      className="size-full object-cover"
                    />
                  ) : (
                    <UserCircle
                      className="size-9 text-muted-foreground"
                      aria-hidden
                    />
                  )}
                </div>

                <div className="min-w-0">
                  <h2 className="text-xl font-semibold">
                    {profile?.display_name || "Unnamed user"}
                  </h2>

                  <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="size-4" aria-hidden />
                    <span className="truncate">
                      {user?.email ?? "No email available"}
                    </span>
                  </div>
                </div>
              </div>

              {!isEditing && (
                <button
                  type="button"
                  onClick={handleEdit}
                  className="inline-flex shrink-0 items-center gap-2 rounded-md border border-border px-3 py-2 text-sm font-medium transition-colors hover:bg-muted"
                >
                  <Pencil className="size-4" aria-hidden />
                  Edit Profile
                </button>
              )}
            </div>
          </section>

          {/* Profile details */}
          <section className="surface-rune p-6">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-base font-semibold">
                About
              </h2>
            </div>

            {isEditing ? (
              <div className="mt-4 space-y-5">
                <div className="space-y-2">
                  <label
                    htmlFor="profile-display-name"
                    className="text-sm font-medium"
                  >
                    Username
                  </label>

                  <input
                    id="profile-display-name"
                    type="text"
                    value={displayName}
                    onChange={(event) =>
                      setDisplayName(event.target.value)
                    }
                    maxLength={100}
                    disabled={updateProfileMutation.isPending}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none transition-colors focus:border-ring focus:ring-2 focus:ring-ring/20 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Enter your username"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="profile-bio"
                    className="text-sm font-medium"
                  >
                    Biography
                  </label>

                  <textarea
                    id="profile-bio"
                    value={bio}
                    onChange={(event) =>
                      setBio(event.target.value)
                    }
                    maxLength={500}
                    rows={5}
                    disabled={updateProfileMutation.isPending}
                    className="w-full resize-y rounded-md border border-input bg-background px-3 py-2 text-sm outline-none transition-colors focus:border-ring focus:ring-2 focus:ring-ring/20 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Tell us a little about yourself"
                  />

                  <p className="text-xs text-muted-foreground">
                    {bio.length}/500 characters
                  </p>
                </div>

                {updateProfileMutation.error && (
                  <p
                    role="alert"
                    className="text-sm text-destructive"
                  >
                    {updateProfileMutation.error.message}
                  </p>
                )}

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={
                      updateProfileMutation.isPending ||
                      !displayName.trim()
                    }
                    className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {updateProfileMutation.isPending
                      ? "Saving..."
                      : "Save Changes"}
                  </button>

                  <button
                    type="button"
                    onClick={handleCancel}
                    disabled={updateProfileMutation.isPending}
                    className="rounded-md border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <p className="mt-3 text-sm text-muted-foreground">
                {profile?.bio || "No biography added yet."}
              </p>
            )}
          </section>

          {/* Account */}
          <section className="surface-rune p-6">
            <h2 className="text-base font-semibold">
              Account
            </h2>

            <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
              <CalendarDays className="size-4" aria-hidden />
              <span>
                Member since{" "}
                {profile?.created_at
                  ? new Date(
                      profile.created_at,
                    ).toLocaleDateString()
                  : "Unknown"}
              </span>
            </div>
          </section>
        </div>
      )}
    </>
  );
          }
