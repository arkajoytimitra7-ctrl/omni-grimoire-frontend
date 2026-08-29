import { Link, createFileRoute } from "@tanstack/react-router";
import { BookMarked, FolderTree, Heart, Search, Sparkles, Tags } from "lucide-react";

import { Brand } from "@/components/layout/brand";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Omni Grimoire — Your arcane file library" },
      {
        name: "description",
        content:
          "Omni Grimoire is a tagged, categorised library for your files: private categories, public tags, likes and instant search.",
      },
      { property: "og:title", content: "Omni Grimoire — Your arcane file library" },
      {
        property: "og:description",
        content:
          "A tagged, categorised library for your files: private categories, public tags, likes and instant search.",
      },
    ],
  }),
  component: Landing,
});

const pillars = [
  { icon: BookMarked, title: "Files", copy: "Every artefact stored with its own entry." },
  { icon: FolderTree, title: "Categories", copy: "Private shelves only you can see." },
  { icon: Tags, title: "Tags", copy: "Shared vocabulary across the whole codex." },
  { icon: Heart, title: "Likes", copy: "Mark what deserves a second reading." },
  { icon: Search, title: "Search", copy: "Find any entry in a heartbeat." },
  { icon: Sparkles, title: "Profiles", copy: "Your identity across the grimoire." },
];

function Landing() {
  return (
    <div className="min-h-screen">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-5 sm:px-6">
        <Brand />
        <Button asChild size="sm">
          <Link to="/auth">Enter</Link>
        </Button>
      </header>

      <main className="mx-auto w-full max-w-6xl px-4 pb-20 sm:px-6">
        <section className="py-14 sm:py-24">
          <p className="text-xs tracking-[0.35em] text-primary uppercase">The codex is open</p>
          <h1 className="mt-4 max-w-3xl text-4xl leading-tight font-semibold sm:text-6xl">
            <span className="text-gilded">Omni Grimoire</span> — one library for everything you
            keep.
          </h1>
          <p className="mt-5 max-w-xl text-base text-muted-foreground sm:text-lg">
            Catalogue files into private categories, describe them with shared public tags, and
            surface the ones that matter with likes and search.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link to="/auth">Open the grimoire</Link>
            </Button>
            <Button asChild size="lg" variant="secondary">
              <Link to="/library">Browse the library</Link>
            </Button>
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {pillars.map(({ icon: Icon, title, copy }) => (
            <article key={title} className="surface-rune p-5">
              <Icon className="size-5 text-primary" aria-hidden />
              <h2 className="mt-3 text-lg font-semibold">{title}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{copy}</p>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}
