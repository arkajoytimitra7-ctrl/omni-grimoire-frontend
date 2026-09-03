import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import {
  BookOpen,
  Code2,
  Gauge,
  KeyRound,
  ShieldCheck,
  Sparkles,
  Terminal,
  Webhook,
} from "lucide-react";

import { PageHeader } from "@/components/common/page-header";
import { myProfileQuery } from "@/features/profile/queries";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/_authenticated/developer")({
  head: () => ({
    meta: [
      { title: "Developer — Omni Grimoire" },
      {
        name: "description",
        content:
          "Developer access, documentation and planned platform capabilities for Omni Grimoire.",
      },
      { property: "og:title", content: "Developer — Omni Grimoire" },
      {
        property: "og:description",
        content: "Developer access, documentation and planned platform capabilities.",
      },
    ],
  }),
  component: DeveloperPage,
});

const capabilities = [
  {
    icon: KeyRound,
    title: "API Keys",
    copy: "Issue and rotate scoped keys for programmatic access to your grimoire.",
    tone: "bg-lavender text-lavender-foreground",
  },
  {
    icon: BookOpen,
    title: "Documentation",
    copy: "Reference for endpoints, filters and file metadata shapes.",
    tone: "bg-sky text-sky-foreground",
  },
  {
    icon: Webhook,
    title: "Webhooks",
    copy: "Receive events when files, categories or likes change.",
    tone: "bg-mint text-mint-foreground",
  },
  {
    icon: Gauge,
    title: "Rate Limits",
    copy: "Per-key request budgets with transparent usage reporting.",
    tone: "bg-cream text-cream-foreground",
  },
  {
    icon: ShieldCheck,
    title: "OAuth Apps",
    copy: "Let third-party apps request access to a grimoire on a user's behalf.",
    tone: "bg-lavender text-lavender-foreground",
  },
  {
    icon: Terminal,
    title: "System Status",
    copy: "A public status surface for platform availability and incidents.",
    tone: "bg-sky text-sky-foreground",
  },
] as const;

function DeveloperPage() {
  const { user } = useAuth();
  const { data: profile } = useQuery(myProfileQuery(user?.id));

  const name = profile?.display_name?.trim() || user?.email?.split("@")[0] || "Scribe";

  return (
    <>
      <PageHeader
        title="Developer"
        description="Developer access for Omni Grimoire. Everything below is informational — these capabilities are planned, not active."
      />

      <section className="bg-arcane relative overflow-hidden rounded-2xl border border-border p-6 shadow-[var(--shadow-lift)] sm:p-8">
        <div className="max-w-2xl">
          <p className="eyebrow">Developer Access</p>
          <h2 className="font-display mt-2 text-2xl font-semibold sm:text-3xl">
            Hello, {name}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Omni Grimoire is being shaped into a programmable library. This page describes the
            developer surface we intend to open up. No keys are issued and no endpoints are live
            yet — when they are, they will appear here.
          </p>
          <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground">
            <Sparkles className="size-3.5 text-primary" aria-hidden />
            Informational preview — no backend implementation
          </div>
        </div>
        <Code2
          className="pointer-events-none absolute -right-6 -bottom-6 size-40 text-primary/10"
          aria-hidden
        />
      </section>

      <section className="surface-panel p-6">
        <h2 className="font-display text-xl font-semibold">Planned capabilities</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Each item below is a future capability. None of them report live operational data.
        </p>

        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {capabilities.map(({ icon: Icon, title, copy, tone }) => (
            <li key={title} className="rounded-xl border border-border p-4">
              <span className={`icon-chip ${tone}`}>
                <Icon className="size-5" aria-hidden />
              </span>
              <div className="mt-3 flex items-center gap-2">
                <h3 className="text-base font-semibold">{title}</h3>
                <span className="rounded-full border border-border px-2 py-0.5 text-[0.65rem] font-medium tracking-wide text-muted-foreground uppercase">
                  Planned
                </span>
              </div>
              <p className="mt-1.5 text-sm text-muted-foreground">{copy}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="surface-panel p-6">
        <h2 className="font-display text-xl font-semibold">Available today</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          The capabilities you can actually use right now, through the app interface.
        </p>
        <ul className="mt-5 divide-y divide-border text-sm">
          {[
            "Upload, preview, open, download and delete your own files",
            "Organise files into private categories you fully control",
            "Publish files to the public library and manage public tags",
            "Like files and track everything you have favourited",
          ].map((item) => (
            <li key={item} className="flex items-center gap-3 py-3">
              <ShieldCheck className="size-4 shrink-0 text-primary" aria-hidden />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
