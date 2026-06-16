import { Database, Droplets, Radio } from "lucide-react";

import { REGION_LABELS } from "@/lib/constants";
import type { Beach } from "@/lib/types";
import { formatPercent } from "@/lib/utils";

/** Historical context facts for a beach, shown in the modal. */
export function BeachStats({ beach }: { beach: Beach }) {
  const facts = [
    {
      icon: <Database className="h-3.5 w-3.5" />,
      label: "Samples",
      value: beach.samples.toLocaleString(),
    },
    {
      icon: <Droplets className="h-3.5 w-3.5" />,
      label: "Historical exceedance",
      value: formatPercent(beach.exceedanceRate, 1),
    },
    {
      icon: <Radio className="h-3.5 w-3.5" />,
      label: "Rain station",
      value: beach.nearestStationId ?? "n/a",
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-2">
      {facts.map((fact) => (
        <div
          key={fact.label}
          className="rounded-xl bg-ocean-50/70 p-2.5 ring-1 ring-ocean-100"
        >
          <div className="flex items-center gap-1 text-[10px] font-medium uppercase tracking-wide text-ocean-500">
            {fact.icon}
            {fact.label}
          </div>
          <div className="mt-1 text-sm font-bold text-ocean-800">
            {fact.value}
          </div>
        </div>
      ))}
      <div className="col-span-3 text-center text-[11px] text-ocean-500/80">
        {REGION_LABELS[beach.region]} coast | {beach.latitude.toFixed(4)},{" "}
        {beach.longitude.toFixed(4)}
      </div>
    </div>
  );
}
