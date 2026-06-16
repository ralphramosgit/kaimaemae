"use client";

import { motion } from "framer-motion";

import { cn } from "@/lib/utils";

export interface SegmentOption<T extends string> {
  value: T;
  label: string;
}

interface SegmentedControlProps<T extends string> {
  options: SegmentOption<T>[];
  value: T;
  onChange: (value: T) => void;
  /** Shared layout id so the active pill can morph between control instances. */
  layoutId: string;
  size?: "sm" | "md";
  /** Stretch options to fill the available width evenly. */
  fluid?: boolean;
  className?: string;
}

/**
 * Pill switcher with a sliding active indicator. Generic over the option value
 * so it can drive intensity, region, and other single-choice controls.
 */
export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  layoutId,
  size = "md",
  fluid = false,
  className,
}: SegmentedControlProps<T>) {
  return (
    <div
      className={cn(
        "rounded-full bg-ocean-50/80 p-1 ring-1 ring-ocean-100",
        fluid ? "flex w-full" : "inline-flex",
        className,
      )}
      role="tablist"
    >
      {options.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(option.value)}
            className={cn(
              "relative rounded-full font-semibold transition-colors",
              size === "sm" ? "px-3 py-1 text-xs" : "px-3.5 py-1.5 text-sm",
              fluid && "flex-1 text-center",
              active ? "text-white" : "text-ocean-600 hover:text-ocean-700",
            )}
          >
            {active ? (
              <motion.span
                layoutId={layoutId}
                className="absolute inset-0 rounded-full bg-ocean-500 shadow-panel-sm"
                transition={{ type: "spring", stiffness: 420, damping: 34 }}
              />
            ) : null}
            <span className="relative z-10 whitespace-nowrap">
              {option.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
