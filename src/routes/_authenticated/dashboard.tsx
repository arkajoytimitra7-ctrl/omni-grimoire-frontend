import { useQuery } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import {
  ArrowRight,
  BookMarked,
  BookOpen,
  FolderTree,
  Heart,
  Library,
  Lock,
  Share2,
  Sparkles,
  Tags,
} from "lucide-react";

import { privateCategoriesQuery } from "@/features/categories/queries";
import { userFilesQuery } from "@/features/files/queries";
import { userLikesQuery } from "@/features/likes/queries";
import { myProfileQuery } from "@/features/profile/queries";
import { publicTagsQuery } from "@/features/tags/queries";
import { useAuth } from "@/hooks/use-auth";

import type { GrimoireFile, PrivateCategory } from "@/lib/database.types";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — Omni Grimoire" },
      { name: "description", content: "Totals and recent activity across your Omni Grimoire." },
      { property: "og:title", content: "Dashboard — Omni Grimoire" },
      {
        property: "og:description",
        content: "Totals and recent activity across your Omni Grimoire library.",
      },
    ],
  }),
  component: DashboardPage,
});

const features = [
  {
    icon: FolderTree,
    title: "Organize Your Data",
    copy: "Private categories keep every entry exactly where you expect it.",
    tone: "bg-lavender text-lavender-foreground",
  },
  {
    icon: Lock,
    title: "Private & Secure",
    copy: "Your files stay private until you decide to publish them.",
    tone: "bg-mint text-mint-foreground",
  },
  {
    icon: Share2,
    title: "Share & Discover",
    copy: "Publish to the shared library and explore what others have added.",
    tone: "bg-sky text-sky-foreground",
  },
  {
    icon: Heart,
    title: "Like & Appreciate",
    copy: "Favourite the entries that matter and find them again instantly.",
    tone: "bg-cream text-cream-foreground",
  },
] as const;

function StatTile({
  icon: Icon,
  label,
  value,
  loading,
  to,
  tone,
}: {
  icon: typeof BookMarked;
  label: string;
  value: number | undefined;
  loading: boolean;
  to: "/files" | "/categories" | "/tags" | "/likes";
  tone: string;
}) {
  return (
    <Link
      to={to}
      className="surface-rune group flex items-center gap-4 p-5 transition-shadow hover:shadow-[var(--shadow-lift)]"
    >
      <span className={`icon-chip ${tone}`}>
        <Icon className="size-5" aria-hidden />
      </span>
      <span className="min-w-0">
        <span className="block text-sm text-muted-foreground">{label}</span>
        <span className="font-display block text-2xl font-semibold">
          {loading ? "—" : (value ?? 0)}
        </span>
      </span>
    </Link>
  );
}

function DeveloperHero({ name }: { name: string }) {
  return (
    <section className="bg-arcane relative overflow-hidden rounded-2xl border border-border p-6 shadow-[var(--shadow-lift)] sm:p-10">
      <div className="grid items-center gap-8 sm:grid-cols-[1.4fr_1fr]">
        <div className="max-w-xl">
          <p className="eyebrow">Developer</p>
          <h2 className="font-display mt-2 text-3xl font-semibold sm:text-4xl">{name}</h2>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
            Omni Grimoire began as a simple idea: a calm, beautiful place to keep everything worth
            keeping. One library for your private notes, your published work, and the things you
            want to share with others.
          </p>
          <Link
            to="/developer"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            Developer access
            <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>

        <div className="hidden justify-center sm:flex">
          <div className="relative flex size-44 items-center justify-center rounded-full border border-border bg-card/70 shadow-[var(--shadow-soft)]">
            <BookOpen className="size-20 text-primary" aria-hidden />
            <Sparkles
              className="text-primary/60 absolute top-6 right-7 size-6"
              aria-hidden
            />
            <Sparkles className="text-primary/40 absolute bottom-8 left-7 size-4" aria-hidden />
          </div>
        </div>
      </div>
    </section>
  );
}

function RecentFiles({ files, loading }: { files: GrimoireFile[] | undefined; loading: boolean }) {
  const recentFiles = files?.slice(0, 5) ?? [];

  return (
    <section className="surface-panel p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-xl font-semibold">Recent files</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            The latest additions to your grimoire.
          </p>
        </div>
        <Link
          to="/files"
          className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
        >
          View all
          <ArrowRight className="size-4" aria-hidden />
        </Link>
      </div>

      <div className="mt-4 divide-y divide-border">
        {loading ? (
          <p className="py-4 text-sm text-muted-foreground">Loading files…</p>
        ) : recentFiles.length === 0 ? (
          <p className="py-4 text-sm text-muted-foreground">Your grimoire has no files yet.</p>
        ) : (
          recentFiles.map((file) => (
            <div key={file.id} className="flex items-center gap-4 py-3.5">
              <span className="icon-chip bg-lavender text-lavender-foreground size-9!">
                <BookMarked className="size-4" aria-hidden />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">{file.title}</p>
                {file.description && (
                  <p className="mt-0.5 truncate text-sm text-muted-foreground">
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

function YourCategories({
  categories,
  loading,
}: {
  categories: PrivateCategory[] | undefined;
  loading: boolean;
}) {
  const visibleCategories = categories?.slice(0, 6) ?? [];

  return (
    <section className="surface-panel p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-xl font-semibold">Your categories</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Private shelves, organised for quick access.
          </p>
        </div>
        <Link
          to="/categories"
          className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
        >
          View all
          <ArrowRight className="size-4" aria-hidden />
        </Link>
      </div>

      <div className="mt-4 divide-y divide-border">
        {loading ? (
          <p className="py-4 text-sm text-muted-foreground">Loading categories…</p>
        ) : visibleCategories.length === 0 ? (
          <p className="py-4 text-sm text-muted-foreground">
            You haven't created any categories yet.
          </p>
        ) : (
          visibleCategories.map((category) => (
            <div key={category.id} className="flex items-center gap-4 py-3.5">
              <span className="icon-chip bg-mint text-mint-foreground size-9!">
                <FolderTree className="size-4" aria-hidden />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">{category.name}</p>
                {category.description && (
                  <p className="mt-0.5 truncate text-sm text-muted-foreground">
                    {category.description}
                  </p>
                )}
              </div>
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
  const { data: profile } = useQuery(myProfileQuery(user?.id));

  const displayName = profile?.display_name?.trim() || user?.email?.split("@")[0] || "Scribe";

  return (
    <>
      <header className="space-y-2">
        <h1 className="font-display text-3xl font-semibold sm:text-4xl">
          Welcome to Omni Grimoire ✨
        </h1>
        <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
          A calm home for everything you collect — private shelves, public discoveries, and the
          entries you keep coming back to.
        </p>
      </header>

      <DeveloperHero name={displayName} />

      <section className="surface-panel p-6">
        <h2 className="font-display text-xl font-semibold">Why Omni Grimoire?</h2>
        <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map(({ icon: Icon, title, copy, tone }) => (
            <li key={title} className="rounded-xl border border-border p-4">
              <span className={`icon-chip ${tone}`}>
                <Icon className="size-5" aria-hidden />
              </span>
              <h3 className="mt-3 text-base font-semibold">{title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{copy}</p>
            </li>
          ))}
        </ul>
      </section>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatTile
          icon={BookMarked}
          label="Your files"
          value={files.data?.length}
          loading={files.isPending}
          to="/files"
          tone="bg-lavender text-lavender-foreground"
        />
        <StatTile
          icon={FolderTree}
          label="Categories"
          value={categories.data?.length}
          loading={categories.isPending}
          to="/categories"
          tone="bg-mint text-mint-foreground"
        />
        <StatTile
          icon={Tags}
          label="Public tags"
          value={tags.data?.length}
          loading={tags.isPending}
          to="/tags"
          tone="bg-sky text-sky-foreground"
        />
        <StatTile
          icon={Heart}
          label="Likes"
          value={likes.data?.length}
          loading={likes.isPending}
          to="/likes"
          tone="bg-cream text-cream-foreground"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <RecentFiles files={files.data} loading={files.isPending} />
        <YourCategories categories={categories.data} loading={categories.isPending} />
      </div>

      <section className="surface-quiet flex flex-col gap-3 p-6 sm:flex-row sm:items-center">
        <Library className="size-6 shrink-0 text-primary" aria-hidden />
        <p className="font-display text-base leading-relaxed italic sm:text-lg">
          “A library is not a luxury but one of the necessities of life.”
          <span className="mt-1 block text-sm font-normal not-italic text-muted-foreground">
            Henry Ward Beecher
          </span>
        </p>
      </section>
    </>
  );
}
