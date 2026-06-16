"use client";

import { MapPinned } from "lucide-react";

import { REGION_LABELS, REGION_ORDER } from "@/lib/constants";
import type { Region } from "@/lib/types";
import { cn } from "@/lib/utils";

type FocusValue = Region | "island-wide";

interface RegionFocusProps {
  value: FocusValue;
  onChange: (value: FocusValue) => void;
}

const OPTIONS: { value: FocusValue; label: string }[] = [
  { value: "island-wide", label: "Island-wide" },
  ...REGION_ORDER.map((region) => ({
    value: region,
    label: REGION_LABELS[region],
  })),
];

/** Chip group to focus the storm on a coast, or the whole island. */
export function RegionFocus({ value, onChange }: RegionFocusProps) {
  return (
    <div>
      <span className="mb-1.5 flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide text-ocean-600/80">
        <MapPinned className="h-3.5 w-3.5" />
        Storm focus
      </span>
      <div className="flex flex-wrap gap-1.5">
        {OPTIONS.map((option) => {
          const active = option.value === value;
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              className={cn(
                "rounded-full px-2.5 py-1 text-xs font-semibold transition-all active:scale-95",
                active
                  ? "bg-sage-500 text-white shadow-panel-sm"
                  : "bg-white/60 text-ocean-600 ring-1 ring-ocean-100 hover:bg-white",
              )}
              aria-pressed={active}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
