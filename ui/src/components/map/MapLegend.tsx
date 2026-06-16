"use client";

import { Layers } from "lucide-react";

import type { SafetyLevel } from "@/lib/types";
import { SAFETY_META } from "@/lib/constants";
import { cn } from "@/lib/utils";

const LEVELS: SafetyLevel[] = ["safe", "caution", "unsafe"];

interface MapLegendProps {
  heatmapVisible: boolean;
  onToggleHeatmap: () => void;
}

/** Floating legend with safety color key and a heatmap toggle. */
export function MapLegend({ heatmapVisible, onToggleHeatmap }: MapLegendProps) {
  return (
    <div className="glass-panel flex items-center gap-3 rounded-2xl px-3 py-2 shadow-panel-sm">
      <div className="flex items-center gap-2.5">
        {LEVELS.map((level) => (
          <div key={level} className="flex items-center gap-1.5">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: SAFETY_META[level].hex }}
            />
            <span className="text-[11px] font-medium text-ocean-700">
              {SAFETY_META[level].label.replace(" to swim", "")}
            </span>
          </div>
        ))}
      </div>
      <span className="h-4 w-px bg-ocean-100" />
      <button
        type="button"
        onClick={onToggleHeatmap}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold transition-colors",
          heatmapVisible
            ? "bg-ocean-500 text-white"
            : "bg-white/70 text-ocean-600 ring-1 ring-ocean-100 hover:bg-white",
        )}
        aria-pressed={heatmapVisible}
      >
        <Layers className="h-3.5 w-3.5" />
        Heatmap
      </button>
    </div>
  );
}
