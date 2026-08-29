import { Sparkles } from "lucide-react";

import { cn } from "@/lib/utils";

export function Brand({ className, compact = false }: { className?: string; compact?: boolean }) {
  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      <span className="bg-arcane flex size-9 shrink-0 items-center justify-center rounded-lg border border-border">
        <Sparkles className="size-4 text-primary" aria-hidden />
      </span>
      {!compact && (
        <span className="flex flex-col leading-none">
          <span className="font-display text-base font-semibold tracking-wide">Omni Grimoire</span>
          <span className="text-[0.68rem] tracking-[0.2em] text-muted-foreground uppercase">
            Codex
          </span>
        </span>
      )}
    </span>
  );
}
