import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import { Bell, LogOut, Menu } from "lucide-react";
import { useState, type ReactNode } from "react";
import { toast } from "sonner";

import { Brand } from "@/components/layout/brand";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { myProfileQuery } from "@/features/profile/queries";
import { useAuth } from "@/hooks/use-auth";
import { appNav } from "@/lib/nav";

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav className="space-y-1" aria-label="Main">
      <p className="px-3 pb-2 text-[0.66rem] font-semibold tracking-[0.18em] text-sidebar-foreground/45 uppercase">
        Library
      </p>
      {appNav.map(({ label, to, icon: Icon }) => (
        <Link
          key={to}
          to={to}
          onClick={onNavigate}
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-sidebar-foreground/75 transition-colors hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
          activeProps={{
            className: "bg-sidebar-accent text-sidebar-accent-foreground shadow-[var(--shadow-soft)]",
          }}
        >
          <Icon className="size-4 shrink-0" aria-hidden />
          {label}
        </Link>
      ))}
    </nav>
  );
}

function UserBadge({
  name,
  email,
  compact = false,
}: {
  name: string;
  email: string | undefined;
  compact?: boolean;
}) {
  const initial = (name || email || "?").charAt(0).toUpperCase();

  return (
    <div className="flex min-w-0 items-center gap-3">
      <span className="bg-lavender text-lavender-foreground flex size-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold">
        {initial}
      </span>
      {!compact && (
        <span className="min-w-0 leading-tight">
          <span className="block truncate text-sm font-semibold">{name}</span>
          <span className="block truncate text-xs text-muted-foreground">{email}</span>
        </span>
      )}
    </div>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { data: profile } = useQuery(myProfileQuery(user?.id));

  const displayName = profile?.display_name?.trim() || user?.email?.split("@")[0] || "Scribe";

  const handleSignOut = async () => {
    try {
      await signOut();
      await navigate({ to: "/auth", replace: true });
    } catch {
      toast.error("Could not sign out. Please try again.");
    }
  };

  return (
    <div className="flex min-h-screen">
      <aside className="bg-navy hidden w-[272px] shrink-0 flex-col justify-between border-r border-sidebar-border p-4 lg:flex">
        <div className="space-y-8">
          <Link to="/dashboard" className="block px-1 pt-2">
            <Brand />
          </Link>
          <NavLinks />
        </div>
        <div className="space-y-3 border-t border-sidebar-border pt-4">
          <p className="truncate px-1 text-xs text-sidebar-foreground/60">{user?.email}</p>
          <Button variant="secondary" size="sm" className="w-full" onClick={handleSignOut}>
            <LogOut className="size-4" aria-hidden />
            Sign out
          </Button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-border bg-background/85 px-4 py-3 backdrop-blur sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Open navigation" className="lg:hidden">
                  <Menu className="size-5" aria-hidden />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="bg-navy w-72 border-sidebar-border p-4">
                <SheetTitle className="sr-only">Navigation</SheetTitle>
                <div className="mb-8 px-1 pt-2">
                  <Brand />
                </div>
                <NavLinks onNavigate={() => setMobileOpen(false)} />
              </SheetContent>
            </Sheet>
            <span className="lg:hidden">
              <Brand tone="dark" compact />
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <span
              className="text-muted-foreground hidden size-9 items-center justify-center rounded-full border border-border sm:inline-flex"
              aria-hidden
            >
              <Bell className="size-4" />
            </span>
            <UserBadge name={displayName} email={user?.email} />
            <Button
              variant="ghost"
              size="icon"
              aria-label="Sign out"
              className="lg:hidden"
              onClick={handleSignOut}
            >
              <LogOut className="size-5" aria-hidden />
            </Button>
          </div>
        </header>

        <main className="mx-auto w-full max-w-6xl flex-1 space-y-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
          {children}
        </main>
      </div>
    </div>
  );
}
