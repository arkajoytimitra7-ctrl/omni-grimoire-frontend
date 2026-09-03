import { BookOpen } from "lucide-react";

import { cn } from "@/lib/utils";

export function Brand({
  className,
  compact = false,
  tone = "light",
}: {
  className?: string;
  compact?: boolean;
  /** "light" renders for dark navy surfaces, "dark" for warm content surfaces. */
  tone?: "light" | "dark";
}) {
  return (
    <span className={cn("flex items-center gap-3", className)}>
      <span
        className={cn(
          "icon-chip",
          tone === "light"
            ? "bg-sidebar-accent text-sidebar-accent-foreground"
            : "bg-lavender text-lavender-foreground",
        )}
      >
        <BookOpen className="size-5" aria-hidden />
      </span>
      {!compact && (
        <span className="flex flex-col leading-tight">
          <span
            className={cn(
              "font-display text-base font-semibold tracking-tight",
              tone === "light" ? "text-sidebar-foreground" : "text-foreground",
            )}
          >
            Omni Grimoire
          </span>
          <span
            className={cn(
              "text-[0.66rem] tracking-[0.18em] uppercase",
              tone === "light" ? "text-sidebar-foreground/55" : "text-muted-foreground",
            )}
          >
            Digital Library
          </span>
        </span>
      )}
    </span>
  );
}
