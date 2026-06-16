"use client";

import { AnimatePresence, motion } from "framer-motion";

import { useSimulation } from "@/context/SimulationContext";
import { project } from "@/lib/geo";
import { SAFETY_META } from "@/lib/constants";

interface SafetyHeatmapProps {
  visible: boolean;
}

/**
 * Soft, blurred risk field layered over the island. Each beach emits a colored
 * glow sized and tinted by its predicted exceedance probability, giving an
 * at-a-glance read of where the water is unsafe.
 */
export function SafetyHeatmap({ visible }: SafetyHeatmapProps) {
  const { result } = useSimulation();

  return (
    <AnimatePresence>
      {visible ? (
        <motion.svg
          key="heatmap"
          className="pointer-events-none absolute inset-0 h-full w-full mix-blend-multiply"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          aria-hidden
        >
          <defs>
            <filter id="heat-blur" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="3.2" />
            </filter>
          </defs>
          <g filter="url(#heat-blur)">
            {result.predictions.map((prediction) => {
              const { latitude, longitude, locationId } = prediction.beach;
              const point = project(latitude, longitude);
              const radius = 4 + prediction.unsafeProbability * 7;
              const opacity = 0.12 + prediction.unsafeProbability * 0.55;
              return (
                <circle
                  key={locationId}
                  cx={point.x}
                  cy={point.y}
                  r={radius}
                  fill={SAFETY_META[prediction.safetyLevel].hex}
                  fillOpacity={opacity}
                />
              );
            })}
          </g>
        </motion.svg>
      ) : null}
    </AnimatePresence>
  );
}
