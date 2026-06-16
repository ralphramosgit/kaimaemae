import { AlertTriangle, ShieldAlert, ShieldCheck } from "lucide-react";
import type { ComponentType } from "react";

import type { SafetyLevel } from "@/lib/types";
import { cn } from "@/lib/utils";

const SAFETY_CONFIG: Record<
  SafetyLevel,
  {
    label: string;
    icon: ComponentType<{ className?: string }>;
    badge: string;
    dot: string;
  }
> = {
  safe: {
    label: "Safe",
    icon: ShieldCheck,
    badge: "bg-sage-100 text-sage-600 ring-sage-200",
    dot: "bg-sage-500",
  },
  caution: {
    label: "Caution",
    icon: AlertTriangle,
    badge: "bg-caution-100 text-caution-500 ring-caution-300",
    dot: "bg-caution-400",
  },
  unsafe: {
    label: "Unsafe",
    icon: ShieldAlert,
    badge: "bg-coral-100 text-coral-600 ring-coral-300",
    dot: "bg-coral-500",
  },
};

interface SafetyBadgeProps {
  level: SafetyLevel;
  size?: "sm" | "md";
  showIcon?: boolean;
  className?: string;
}

/** Pill that communicates a water-safety verdict with color and icon. */
export function SafetyBadge({
  level,
  size = "md",
  showIcon = true,
  className,
}: SafetyBadgeProps) {
  const config = SAFETY_CONFIG[level];
  const Icon = config.icon;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full font-semibold ring-1",
        size === "sm" ? "px-2 py-0.5 text-[11px]" : "px-2.5 py-1 text-xs",
        config.badge,
        className,
      )}
    >
      {showIcon ? (
        <Icon className={size === "sm" ? "h-3 w-3" : "h-3.5 w-3.5"} />
      ) : null}
      {config.label}
    </span>
  );
}

/** Small colored status dot for compact list rows. */
export function SafetyDot({
  level,
  className,
}: {
  level: SafetyLevel;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-block h-2.5 w-2.5 rounded-full",
        SAFETY_CONFIG[level].dot,
        className,
      )}
    />
  );
}
