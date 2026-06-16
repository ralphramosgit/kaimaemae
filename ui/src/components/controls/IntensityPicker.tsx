"use client";

import {
  CloudDrizzle,
  CloudLightning,
  CloudRain,
  CloudRainWind,
  Sun,
  type LucideIcon,
} from "lucide-react";

import { INTENSITY_ORDER, INTENSITY_PRESETS } from "@/lib/constants";
import type { StormIntensity } from "@/lib/types";
import { cn } from "@/lib/utils";

const INTENSITY_ICONS: Record<StormIntensity, LucideIcon> = {
  dry: Sun,
  light: CloudDrizzle,
  moderate: CloudRain,
  heavy: CloudRainWind,
  storm: CloudLightning,
};

interface IntensityPickerProps {
  value: StormIntensity | "custom";
  onSelect: (intensity: StormIntensity) => void;
}

/** Preset storm intensity chooser. Highlights the active preset. */
export function IntensityPicker({ value, onSelect }: IntensityPickerProps) {
  return (
    <div>
      <div className="grid grid-cols-5 gap-1.5">
        {INTENSITY_ORDER.map((intensity) => {
          const Icon = INTENSITY_ICONS[intensity];
          const active = value === intensity;
          return (
            <button
              key={intensity}
              type="button"
              onClick={() => onSelect(intensity)}
              className={cn(
                "flex flex-col items-center gap-1 rounded-xl px-1 py-2 text-[11px] font-semibold transition-all active:scale-95",
                active
                  ? "bg-ocean-500 text-white shadow-panel-sm"
                  : "bg-white/60 text-ocean-600 ring-1 ring-ocean-100 hover:bg-white",
              )}
              aria-pressed={active}
            >
              <Icon className="h-4 w-4" />
              {INTENSITY_PRESETS[intensity].label.split(" ")[0]}
            </button>
          );
        })}
      </div>
      <p className="mt-2 text-xs leading-snug text-ocean-600/80">
        {value === "custom"
          ? "Custom rainfall pattern."
          : INTENSITY_PRESETS[value].description}
      </p>
    </div>
  );
}
