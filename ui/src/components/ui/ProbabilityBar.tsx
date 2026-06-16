"use client";

import { motion } from "framer-motion";

import { SAFETY_THRESHOLDS } from "@/lib/constants";
import type { SafetyLevel } from "@/lib/types";
import { cn } from "@/lib/utils";

const FILL_BY_LEVEL: Record<SafetyLevel, string> = {
  safe: "bg-sage-400",
  caution: "bg-caution-400",
  unsafe: "bg-coral-500",
};

interface ProbabilityBarProps {
  probability: number;
  level: SafetyLevel;
  /** Show the BAV action-level threshold marker. */
  showThreshold?: boolean;
  className?: string;
}

/**
 * Horizontal probability meter with the action-level threshold marked, so a
 * reading can be eyeballed against the safe and unsafe cut points.
 */
export function ProbabilityBar({
  probability,
  level,
  showThreshold = true,
  className,
}: ProbabilityBarProps) {
  return (
    <div
      className={cn(
        "relative h-2.5 w-full overflow-hidden rounded-full bg-ocean-50",
        className,
      )}
    >
      <motion.div
        className={cn("h-full rounded-full", FILL_BY_LEVEL[level])}
        initial={{ width: 0 }}
        animate={{ width: `${Math.round(probability * 100)}%` }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      />
      {showThreshold ? (
        <span
          className="absolute top-1/2 h-3.5 w-0.5 -translate-y-1/2 rounded-full bg-ocean-700/60"
          style={{ left: `${SAFETY_THRESHOLDS.unsafe * 100}%` }}
          aria-hidden
        />
      ) : null}
    </div>
  );
}
