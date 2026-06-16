import {
  Activity,
  AlertTriangle,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react";

import { StatTile } from "@/components/ui/StatTile";
import type { SimulationResult } from "@/lib/types";
import { formatPercent } from "@/lib/utils";

/** Four headline metrics summarizing the active simulation. */
export function StatGrid({ result }: { result: SimulationResult }) {
  return (
    <div className="grid grid-cols-2 gap-2">
      <StatTile
        icon={<ShieldAlert className="h-3.5 w-3.5" />}
        label="Unsafe"
        value={result.unsafeCount}
        tone="coral"
        hint="beaches over the limit"
      />
      <StatTile
        icon={<AlertTriangle className="h-3.5 w-3.5" />}
        label="Caution"
        value={result.cautionCount}
        tone="caution"
        hint="near the threshold"
      />
      <StatTile
        icon={<ShieldCheck className="h-3.5 w-3.5" />}
        label="Safe"
        value={result.safeCount}
        tone="sage"
        hint="clear to swim"
      />
      <StatTile
        icon={<Activity className="h-3.5 w-3.5" />}
        label="Avg risk"
        value={formatPercent(result.averageProbability)}
        tone="ocean"
        hint="island-wide mean"
      />
    </div>
  );
}
