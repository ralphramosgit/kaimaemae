"use client";

import { Droplet } from "lucide-react";

import { ProbabilityBar } from "@/components/ui/ProbabilityBar";
import { SafetyBadge } from "@/components/ui/SafetyBadge";
import { BAV_THRESHOLD, SAFETY_META } from "@/lib/constants";
import type { BeachPrediction } from "@/lib/types";
import { formatPercent } from "@/lib/utils";

/** Prominent safety verdict block for the beach modal header. */
export function SafetyVerdict({ prediction }: { prediction: BeachPrediction }) {
  const { unsafeProbability, predictedEnterococcus, safetyLevel } = prediction;
  const meta = SAFETY_META[safetyLevel];
  const overLimit = predictedEnterococcus > BAV_THRESHOLD;

  return (
    <div
      className="rounded-2xl p-4 ring-1"
      style={{
        backgroundColor: `${meta.hex}14`,
        borderColor: `${meta.hex}55`,
      }}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-wide text-ocean-500">
            Predicted verdict
          </span>
          <div className="mt-1.5">
            <SafetyBadge level={safetyLevel} />
          </div>
        </div>
        <div className="text-right">
          <div
            className="text-3xl font-bold leading-none"
            style={{ color: meta.hex }}
          >
            {formatPercent(unsafeProbability)}
          </div>
          <span className="text-[11px] text-ocean-500">unsafe probability</span>
        </div>
      </div>

      <div className="mt-3">
        <ProbabilityBar probability={unsafeProbability} level={safetyLevel} />
      </div>

      <div className="mt-3 flex items-center gap-2 text-sm">
        <Droplet className="h-4 w-4 text-ocean-500" />
        <span className="font-semibold text-ocean-800">
          {predictedEnterococcus} CFU / 100 mL
        </span>
        <span
          className="ml-auto rounded-full px-2 py-0.5 text-[11px] font-semibold"
          style={{
            backgroundColor: overLimit ? "#FBE0D8" : "#DDEBD3",
            color: overLimit ? "#C2462A" : "#497336",
          }}
        >
          {overLimit ? "Over" : "Under"} limit of {BAV_THRESHOLD}
        </span>
      </div>
    </div>
  );
}
