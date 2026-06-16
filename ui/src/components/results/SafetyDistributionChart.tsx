"use client";

import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";

import { SAFETY_META } from "@/lib/constants";
import type { SimulationResult } from "@/lib/types";

interface SafetyDistributionChartProps {
  result: SimulationResult;
}

/** Donut chart of the safe / caution / unsafe beach split with a centered total. */
export function SafetyDistributionChart({
  result,
}: SafetyDistributionChartProps) {
  const total =
    result.safeCount + result.cautionCount + result.unsafeCount || 1;
  const data = [
    {
      key: "safe",
      label: "Safe",
      value: result.safeCount,
      color: SAFETY_META.safe.hex,
    },
    {
      key: "caution",
      label: "Caution",
      value: result.cautionCount,
      color: SAFETY_META.caution.hex,
    },
    {
      key: "unsafe",
      label: "Unsafe",
      value: result.unsafeCount,
      color: SAFETY_META.unsafe.hex,
    },
  ];

  return (
    <div className="flex items-center gap-4">
      <div className="relative h-32 w-32 shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="label"
              innerRadius={42}
              outerRadius={62}
              paddingAngle={2}
              startAngle={90}
              endAngle={-270}
              stroke="none"
              isAnimationActive
            >
              {data.map((entry) => (
                <Cell key={entry.key} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold leading-none text-ocean-800">
            {total}
          </span>
          <span className="text-[10px] font-medium uppercase tracking-wide text-ocean-500">
            beaches
          </span>
        </div>
      </div>

      <ul className="flex-1 space-y-1.5">
        {data.map((entry) => (
          <li key={entry.key} className="flex items-center gap-2 text-sm">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="flex-1 text-ocean-700">{entry.label}</span>
            <span className="font-semibold tabular-nums text-ocean-800">
              {entry.value}
            </span>
            <span className="w-10 text-right text-xs tabular-nums text-ocean-500">
              {Math.round((entry.value / total) * 100)}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
