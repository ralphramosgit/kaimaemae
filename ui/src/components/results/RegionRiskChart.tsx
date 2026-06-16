"use client";

import { useMemo } from "react";
import {
  Bar,
  BarChart,
  Cell,
  LabelList,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

import { REGION_LABELS, REGION_ORDER, SAFETY_META } from "@/lib/constants";
import { safetyFromProbability } from "@/lib/simulation";
import type { SimulationResult } from "@/lib/types";

interface RegionRiskChartProps {
  result: SimulationResult;
}

/** Average predicted exceedance probability per coast, as horizontal bars. */
export function RegionRiskChart({ result }: RegionRiskChartProps) {
  const data = useMemo(() => {
    const totals = new Map<string, { sum: number; count: number }>();
    for (const prediction of result.predictions) {
      const entry = totals.get(prediction.beach.region) ?? { sum: 0, count: 0 };
      entry.sum += prediction.unsafeProbability;
      entry.count += 1;
      totals.set(prediction.beach.region, entry);
    }
    return REGION_ORDER.map((region) => {
      const entry = totals.get(region) ?? { sum: 0, count: 0 };
      const avg = entry.count ? entry.sum / entry.count : 0;
      return {
        region,
        label: REGION_LABELS[region],
        avg,
        percent: `${Math.round(avg * 100)}%`,
        color: SAFETY_META[safetyFromProbability(avg)].hex,
      };
    });
  }, [result.predictions]);

  return (
    <div className="h-36 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 4, right: 40, bottom: 4, left: 0 }}
          barCategoryGap={8}
        >
          <XAxis type="number" domain={[0, 1]} hide />
          <YAxis
            type="category"
            dataKey="label"
            width={86}
            tickLine={false}
            axisLine={false}
            tick={{ fill: "#176C99", fontSize: 11, fontWeight: 600 }}
          />
          <Bar dataKey="avg" radius={[0, 6, 6, 0]} isAnimationActive>
            {data.map((entry) => (
              <Cell key={entry.region} fill={entry.color} />
            ))}
            <LabelList
              dataKey="percent"
              position="right"
              fill="#11526F"
              fontSize={11}
              fontWeight={700}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
