import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { CalendarDays, Mail, UserCircle } from "lucide-react";

import { PageHeader } from "@/components/common/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { myProfileQuery } from "@/features/profile/queries";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/_authenticated/profile")({
  head: () => ({
    meta: [
      { title: "Profile — Omni Grimoire" },
      {
        name: "description",
        content: "View your Omni Grimoire profile.",
      },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  const { user } = useAuth();

  const { data: profile, isPending, error } = useQuery(
    myProfileQuery(user?.id),
  );

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
          <section className="surface-rune p-6">
            <div className="flex items-start gap-4">
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
          </section>

          <section className="surface-rune p-6">
            <h2 className="text-base font-semibold">
              About
            </h2>

            <p className="mt-3 text-sm text-muted-foreground">
              {profile?.bio || "No biography added yet."}
            </p>
          </section>

          <section className="surface-rune p-6">
            <h2 className="text-base font-semibold">
              Account
            </h2>

            <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
              <CalendarDays className="size-4" aria-hidden />
              <span>
                Member since{" "}
                {profile?.created_at
                  ? new Date(profile.created_at).toLocaleDateString()
                  : "Unknown"}
              </span>
            </div>
          </section>
        </div>
      )}
    </>
  );
}
