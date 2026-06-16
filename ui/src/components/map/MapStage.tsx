"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Navigation } from "lucide-react";

import { WaveBackground } from "./WaveBackground";
import { OahuIsland } from "./OahuIsland";
import { SafetyHeatmap } from "./SafetyHeatmap";
import { BeachPins } from "./BeachPins";
import { MapLegend } from "./MapLegend";

/**
 * The central map stage: animated ocean, the Oahu landmass, an optional risk
 * heatmap, and all beach pins. The island, heatmap, and pins share one
 * projection box so every layer stays aligned.
 */
export function MapStage() {
  const [heatmapVisible, setHeatmapVisible] = useState(false);

  return (
    <div className="absolute inset-0 overflow-hidden">
      <WaveBackground />

      {/* Shared projection box. Aspect ratio matches the Oahu bounding box. */}
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="relative aspect-[13/10] w-full max-w-[min(78vw,1100px)]"
        >
          <OahuIsland />
          <SafetyHeatmap visible={heatmapVisible} />
          <BeachPins />

          {/* Island label. */}
          <div className="pointer-events-none absolute left-1/2 top-[40%] -translate-x-1/2 text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/60 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-ocean-700/80 backdrop-blur-sm">
              <Navigation className="h-3 w-3" />
              Oahu
            </span>
          </div>
        </motion.div>
      </div>

      {/* Legend pinned to the lower center of the stage. */}
      <div className="absolute bottom-5 left-1/2 z-20 -translate-x-1/2">
        <MapLegend
          heatmapVisible={heatmapVisible}
          onToggleHeatmap={() => setHeatmapVisible((value) => !value)}
        />
      </div>
    </div>
  );
}
