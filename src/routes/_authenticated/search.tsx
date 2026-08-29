import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";

import { EmptyState } from "@/components/common/empty-state";
import { PageHeader } from "@/components/common/page-header";
import { Input } from "@/components/ui/input";
import { libraryFilesQuery } from "@/features/files/queries";

export const Route = createFileRoute("/_authenticated/search")({
  head: () => ({
    meta: [
      { title: "Search — Omni Grimoire" },
      { name: "description", content: "Search across everything in your Omni Grimoire." },
    ],
  }),
  component: SearchPage,
});

function SearchPage() {
  const [term, setTerm] = useState("");
  const { data } = useQuery(libraryFilesQuery);

  const results = useMemo(() => {
    const needle = term.trim().toLowerCase();
    if (!needle) return [];
    return (data ?? []).filter((file) => file.title.toLowerCase().includes(needle));
  }, [data, term]);

  return (
    <>
      <PageHeader title="Search" description="A client-side pass for now; server search follows." />
      <Input
        value={term}
        onChange={(event) => setTerm(event.target.value)}
        placeholder="Search entries by title…"
        aria-label="Search entries"
      />
      {term.trim() === "" ? (
        <EmptyState
          icon={Search}
          title="Start typing"
          description="Results appear as you refine your query."
        />
      ) : results.length === 0 ? (
        <EmptyState icon={Search} title="No matches" description={`Nothing found for “${term}”.`} />
      ) : (
        <ul className="space-y-2">
          {results.map((file) => (
            <li key={file.id} className="surface-rune p-4 text-sm font-medium">
              {file.title}
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
