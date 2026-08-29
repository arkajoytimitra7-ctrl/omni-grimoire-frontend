import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { BookMarked, FolderTree, Heart, Tags } from "lucide-react";

import { PageHeader } from "@/components/common/page-header";
import { privateCategoriesQuery } from "@/features/categories/queries";
import { userFilesQuery } from "@/features/files/queries";
import { userLikesQuery } from "@/features/likes/queries";
import { publicTagsQuery } from "@/features/tags/queries";
import { useAuth } from "@/hooks/use-auth";

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

function DashboardPage() {
  const { user } = useAuth();
  const files = useQuery(userFilesQuery(user?.id));
  const categories = useQuery(privateCategoriesQuery(user?.id));
  const likes = useQuery(userLikesQuery(user?.id));
  const tags = useQuery(publicTagsQuery);

  return (
    <>
      <PageHeader
        title="Dashboard"
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
      <p className="text-sm text-muted-foreground">
        Signed in as <span className="text-foreground">{user?.email}</span>. Feature screens are
        scaffolded and read from the existing database.
      </p>
    </>
  );
}
