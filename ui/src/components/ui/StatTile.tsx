import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface StatTileProps {
  icon?: ReactNode;
  label: string;
  value: ReactNode;
  hint?: string;
  tone?: "ocean" | "sage" | "caution" | "coral" | "sand";
  className?: string;
}

const TONE_CLASSES: Record<NonNullable<StatTileProps["tone"]>, string> = {
  ocean: "bg-ocean-50/70 ring-ocean-100 text-ocean-700",
  sage: "bg-sage-50 ring-sage-200 text-sage-600",
  caution: "bg-caution-100/60 ring-caution-300 text-caution-500",
  coral: "bg-coral-100/60 ring-coral-300 text-coral-600",
  sand: "bg-sand-50 ring-sand-200 text-sand-500",
};

/** Compact metric tile: label, value, and an optional icon and hint. */
export function StatTile({
  icon,
  label,
  value,
  hint,
  tone = "ocean",
  className,
}: StatTileProps) {
  return (
    <div
      className={cn(
        "rounded-2xl p-3 ring-1 transition-shadow",
        TONE_CLASSES[tone],
        className,
      )}
    >
      <div className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide opacity-80">
        {icon}
        {label}
      </div>
      <div className="mt-1 text-xl font-bold leading-none tracking-tight">
        {value}
      </div>
      {hint ? <div className="mt-1 text-[11px] opacity-70">{hint}</div> : null}
    </div>
  );
}
