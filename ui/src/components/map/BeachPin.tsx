"use client";

import { motion } from "framer-motion";
import { Umbrella } from "lucide-react";

import type { MapPoint } from "@/lib/geo";
import type { BeachPrediction, SafetyLevel } from "@/lib/types";
import { cn, formatPercent } from "@/lib/utils";

const PIN_STYLES: Record<
  SafetyLevel,
  { ring: string; fill: string; icon: string; glow: string }
> = {
  safe: {
    ring: "ring-sage-500/60",
    fill: "bg-sage-100",
    icon: "text-sage-600",
    glow: "bg-sage-400",
  },
  caution: {
    ring: "ring-caution-400/70",
    fill: "bg-caution-100",
    icon: "text-caution-500",
    glow: "bg-caution-400",
  },
  unsafe: {
    ring: "ring-coral-500/70",
    fill: "bg-coral-100",
    icon: "text-coral-600",
    glow: "bg-coral-500",
  },
};

interface BeachPinProps {
  prediction: BeachPrediction;
  point: MapPoint;
  index: number;
  selected: boolean;
  hovered: boolean;
  dimmed: boolean;
  onSelect: () => void;
  onHover: (hovering: boolean) => void;
}

/** A single interactive beach marker on the map. */
export function BeachPin({
  prediction,
  point,
  index,
  selected,
  hovered,
  dimmed,
  onSelect,
  onHover,
}: BeachPinProps) {
  const style = PIN_STYLES[prediction.safetyLevel];
  const active = selected || hovered;
  // Risky beaches read a touch larger so they draw the eye.
  const scale = 0.9 + prediction.unsafeProbability * 0.5;

  return (
    <motion.button
      type="button"
      className="absolute -translate-x-1/2 -translate-y-1/2 focus:outline-none"
      style={{
        left: `${point.x}%`,
        top: `${point.y}%`,
        zIndex: active ? 30 : 10,
      }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: dimmed ? 0.35 : 1,
        scale: active ? scale * 1.25 : scale,
      }}
      transition={{
        opacity: { duration: 0.3 },
        scale: {
          type: "spring",
          stiffness: 380,
          damping: 22,
          delay: index * 0.012,
        },
      }}
      whileHover={{ scale: scale * 1.3 }}
      whileTap={{ scale: scale * 1.1 }}
      onClick={onSelect}
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
      aria-label={`${prediction.beach.name}, ${formatPercent(
        prediction.unsafeProbability,
      )} unsafe probability`}
    >
      {/* Pulsing ripple for unsafe beaches. */}
      {prediction.safetyLevel === "unsafe" ? (
        <span
          className={cn(
            "absolute inset-0 rounded-full animate-ripple",
            style.glow,
          )}
          aria-hidden
        />
      ) : null}

      <span
        className={cn(
          "relative flex h-7 w-7 items-center justify-center rounded-full ring-2 shadow-pin transition-shadow",
          style.fill,
          style.ring,
          active && "ring-4",
        )}
      >
        <Umbrella className={cn("h-3.5 w-3.5", style.icon)} />
      </span>

      {/* Hover and selection label. */}
      {active ? (
        <motion.span
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="pointer-events-none absolute left-1/2 top-full mt-1.5 -translate-x-1/2 whitespace-nowrap rounded-lg bg-ocean-800/90 px-2 py-1 text-[11px] font-semibold text-white shadow-panel-sm"
        >
          {prediction.beach.name}
          <span className="ml-1 font-normal text-ocean-100">
            {formatPercent(prediction.unsafeProbability)}
          </span>
        </motion.span>
      ) : null}
    </motion.button>
  );
}
