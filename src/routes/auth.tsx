import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { toast } from "sonner";

import { Brand } from "@/components/layout/brand";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/auth")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Sign in — Omni Grimoire" },
      { name: "description", content: "Sign in or create an account to open your Omni Grimoire." },
      { property: "og:title", content: "Sign in — Omni Grimoire" },
      {
        property: "og:description",
        content: "Sign in or create an account to open your Omni Grimoire.",
      },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const { isAuthenticated, isLoading, signInWithPassword, signUpWithPassword } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (!isLoading && isAuthenticated) void navigate({ to: "/dashboard", replace: true });
  }, [isAuthenticated, isLoading, navigate]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setPending(true);
    try {
      if (mode === "signin") {
        await signInWithPassword(email, password);
        await navigate({ to: "/dashboard", replace: true });
      } else {
        await signUpWithPassword(email, password);
        toast.success("Account created. Check your inbox if confirmation is required.");
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Authentication failed");
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-4 py-10">
      <Link to="/">
        <Brand />
      </Link>

      <div className="surface-rune w-full max-w-md p-6 sm:p-8">
        <h1 className="font-display text-2xl font-semibold">Enter the grimoire</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Authentication uses the existing account system — nothing here changes it.
        </p>

        <Tabs
          value={mode}
          onValueChange={(value) => setMode(value as "signin" | "signup")}
          className="mt-6"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Sign in</TabsTrigger>
            <TabsTrigger value="signup">Create account</TabsTrigger>
          </TabsList>
          <TabsContent value={mode} className="mt-5">
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="scribe@grimoire.app"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  autoComplete={mode === "signin" ? "current-password" : "new-password"}
                  required
                  minLength={6}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="••••••••"
                />
              </div>
              <Button type="submit" className="w-full" disabled={pending}>
                {pending ? "Working…" : mode === "signin" ? "Sign in" : "Create account"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
