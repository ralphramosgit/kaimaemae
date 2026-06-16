"use client";

import {
  Area,
  AreaChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  type DotProps,
} from "recharts";

import { SAFETY_META } from "@/lib/constants";
import type { ForecastDay, SafetyLevel } from "@/lib/types";

interface ForecastTimelineProps {
  forecast: ForecastDay[];
}

interface ChartDatum {
  label: string;
  probability: number;
  cfu: number;
  level: SafetyLevel;
}

interface ForecastDotProps extends DotProps {
  payload?: ChartDatum;
}

/** Colored marker per day, tinted by that day's safety verdict. */
function ForecastDot({ cx, cy, payload }: ForecastDotProps) {
  if (cx == null || cy == null || !payload) return null;
  return (
    <circle
      cx={cx}
      cy={cy}
      r={4}
      fill={SAFETY_META[payload.level].hex}
      stroke="#ffffff"
      strokeWidth={1.5}
    />
  );
}

function ForecastTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { payload: ChartDatum }[];
}) {
  if (!active || !payload?.length) return null;
  const datum = payload[0].payload;
  return (
    <div className="rounded-xl bg-ocean-800/95 px-3 py-2 text-xs text-white shadow-panel-sm">
      <div className="font-semibold">{datum.label}</div>
      <div className="text-ocean-100">
        {Math.round(datum.probability)}% unsafe
      </div>
      <div className="text-ocean-200">{datum.cfu} CFU / 100 mL</div>
    </div>
  );
}

/**
 * Seven-day forward water-quality outlook for one beach. Plots unsafe
 * probability with the action-level reference and per-day safety markers.
 */
export function ForecastTimeline({ forecast }: ForecastTimelineProps) {
  const data: ChartDatum[] = forecast.map((day) => ({
    label: day.label,
    probability: day.unsafeProbability * 100,
    cfu: day.predictedEnterococcus,
    level: day.safetyLevel,
  }));

  return (
    <div className="h-44 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 8, right: 12, bottom: 0, left: 0 }}
        >
          <defs>
            <linearGradient id="forecast-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3FA8D4" stopOpacity={0.45} />
              <stop offset="100%" stopColor="#3FA8D4" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="label"
            tickLine={false}
            axisLine={false}
            tick={{ fill: "#176C99", fontSize: 11 }}
          />
          <YAxis
            domain={[0, 100]}
            tickLine={false}
            axisLine={false}
            tick={{ fill: "#9FD7EE", fontSize: 10 }}
            tickFormatter={(value) => `${value}%`}
            width={38}
          />
          <ReferenceLine
            y={50}
            stroke="#DD5C3C"
            strokeDasharray="4 4"
            strokeWidth={1.5}
            label={{
              value: "Action level",
              position: "insideTopRight",
              fill: "#DD5C3C",
              fontSize: 10,
              fontWeight: 600,
            }}
          />
          <Tooltip
            content={<ForecastTooltip />}
            cursor={{ stroke: "#A2DBEF", strokeWidth: 1 }}
          />
          <Area
            type="monotone"
            dataKey="probability"
            stroke="#2389BC"
            strokeWidth={2.5}
            fill="url(#forecast-fill)"
            dot={<ForecastDot />}
            activeDot={{ r: 5 }}
            isAnimationActive
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
