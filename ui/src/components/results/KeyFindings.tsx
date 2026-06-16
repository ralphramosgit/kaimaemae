import {
  AlertTriangle,
  Info,
  ShieldAlert,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";

import type { Finding } from "@/lib/insights";
import { cn } from "@/lib/utils";

const TONE_CONFIG: Record<Finding["tone"], { icon: LucideIcon; chip: string }> =
  {
    safe: { icon: ShieldCheck, chip: "bg-sage-100 text-sage-600" },
    caution: { icon: AlertTriangle, chip: "bg-caution-100 text-caution-500" },
    unsafe: { icon: ShieldAlert, chip: "bg-coral-100 text-coral-600" },
    neutral: { icon: Info, chip: "bg-ocean-50 text-ocean-600" },
  };

/** Renders the generated findings as a compact, icon-led list. */
export function KeyFindings({ findings }: { findings: Finding[] }) {
  return (
    <ul className="space-y-2">
      {findings.map((finding) => {
        const config = TONE_CONFIG[finding.tone];
        const Icon = config.icon;
        return (
          <li key={finding.id} className="flex gap-2.5">
            <span
              className={cn(
                "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg",
                config.chip,
              )}
            >
              <Icon className="h-3.5 w-3.5" />
            </span>
            <div>
              <p className="text-sm font-semibold leading-snug text-ocean-800">
                {finding.title}
              </p>
              <p className="text-xs leading-snug text-ocean-600/85">
                {finding.detail}
              </p>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
