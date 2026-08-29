import { useQuery } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowRight, BookMarked, FolderTree, Heart, Tags } from "lucide-react";

import { PageHeader } from "@/components/common/page-header";
import { privateCategoriesQuery } from "@/features/categories/queries";
import { userFilesQuery } from "@/features/files/queries";
import { userLikesQuery } from "@/features/likes/queries";
import { publicTagsQuery } from "@/features/tags/queries";
import { useAuth } from "@/hooks/use-auth";

import type { GrimoireFile } from "@/lib/database.types";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — Omni Grimoire" },
      { name: "description", content: "Totals and recent activity across your Omni Grimoire." },
    ],
  }),
  component: DashboardPage,
});

function StatCard({
  icon: Icon,
  label,
  value,
  loading,
}: {
  icon: typeof BookMarked;
  label: string;
  value: number | undefined;
  loading: boolean;
}) {
  return (
    <div className="surface-rune p-5">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">{label}</span>
        <Icon className="size-4 text-primary" aria-hidden />
      </div>
      <p className="mt-3 font-display text-3xl font-semibold">{loading ? "—" : (value ?? 0)}</p>
    </div>
  );
}

function RecentFiles({
  files,
  loading,
}: {
  files: GrimoireFile[] | undefined;
  loading: boolean;
}) {
  const recentFiles = files?.slice(0, 5) ?? [];

  return (
    <section className="surface-rune p-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-xl font-semibold">Recent files</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            The latest additions to your grimoire.
          </p>
        </div>

        <Link
          to="/files"
          className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
        >
          View all
          <ArrowRight className="size-4" aria-hidden />
        </Link>
      </div>

      <div className="mt-5 divide-y divide-border">
        {loading ? (
          <p className="py-4 text-sm text-muted-foreground">Loading files…</p>
        ) : recentFiles.length === 0 ? (
          <p className="py-4 text-sm text-muted-foreground">
            Your grimoire has no files yet.
          </p>
        ) : (
          recentFiles.map((file) => (
            <div key={file.id} className="flex items-center justify-between gap-4 py-4">
              <div className="min-w-0">
                <p className="truncate font-medium">{file.title}</p>
                {file.description && (
                  <p className="mt-1 truncate text-sm text-muted-foreground">
                    {file.description}
                  </p>
                )}
              </div>

              <span className="shrink-0 text-xs text-muted-foreground">
                {new Date(file.created_at).toLocaleDateString()}
              </span>
            </div>
          ))
        )}
      </div>
    </section>
  );
}

function DashboardPage() {
  const { user } = useAuth();
  const files = useQuery(userFilesQuery(user?.id));
  const categories = useQuery(privateCategoriesQuery(user?.id));
  const likes = useQuery(userLikesQuery(user?.id));
  const tags = useQuery(publicTagsQuery);

  return (
    <>
      <PageHeader
  title={`Welcome back${user?.email ? `, ${user.email.split("@")[0]}` : ""}`}
  description="A quick reading of everything currently bound to your grimoire."
/>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={BookMarked}
          label="Your files"
          value={files.data?.length}
          loading={files.isPending}
        />
        <StatCard
          icon={FolderTree}
          label="Categories"
          value={categories.data?.length}
          loading={categories.isPending}
        />
        <StatCard icon={Tags} label="Public tags" value={tags.data?.length} loading={tags.isPending} />
        <StatCard icon={Heart} label="Likes" value={likes.data?.length} loading={likes.isPending} />
      </div>
      <RecentFiles files={files.data} loading={files.isPending} />
      <p className="text-sm text-muted-foreground">
        Signed in as <span className="text-foreground">{user?.email}</span>. Feature screens are
        scaffolded and read from the existing database.
      </p>
    </>
  );
}
