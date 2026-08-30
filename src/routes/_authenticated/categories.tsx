import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { FolderTree } from "lucide-react";

import { EmptyState } from "@/components/common/empty-state";
import { PageHeader } from "@/components/common/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { privateCategoriesQuery } from "@/features/categories/queries";
import { useAuth } from "@/hooks/use-auth";
import { CategoryCreateDialog } from "@/components/categories/category-create-dialog";

export const Route = createFileRoute("/_authenticated/categories")({
  head: () => ({
    meta: [
      { title: "Categories — Omni Grimoire" },
      { name: "description", content: "Your private categories inside Omni Grimoire." },
    ],
  }),
  component: CategoriesPage,
});

function CategoriesPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data, isPending, error } = useQuery(
    privateCategoriesQuery(user?.id),
  );

  return (
    <>
      <PageHeader
  title="Categories"
  description="Private shelves visible only to you."
  actions={
    user ? (
      <CategoryCreateDialog
        userId={user.id}
        onCreated={() => {
          void queryClient.invalidateQueries({
            queryKey: ["private_categories", user.id],
          });
        }}
      />
    ) : null
  }
/>
      {isPending && <Skeleton className="h-24 rounded-xl" />}
      {error && <p className="text-sm text-destructive">{error.message}</p>}
      {data && data.length === 0 && (
        <EmptyState
          icon={FolderTree}
          title="No categories yet"
          description="Category management arrives in the next phase."
        />
      )}
      {data && data.length > 0 && (
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {data.map((category) => (
            <li key={category.id} className="surface-rune p-4">
              <h2 className="text-base font-semibold">{category.name}</h2>
              {category.description && (
                <p className="mt-1 text-sm text-muted-foreground">{category.description}</p>
              )}
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
