"use client";

import { useRef } from "react";

import { cn, clamp } from "@/lib/utils";

const MAX_MM = 120;
const DAY_LABELS = ["6d", "5d", "4d", "3d", "2d", "1d", "Now"];

interface DayBarProps {
  index: number;
  label: string;
  valueMm: number;
  isToday: boolean;
  onChange: (index: number, millimeters: number) => void;
}

/** One draggable rainfall column. Drag, click, or use arrow keys to set mm. */
function DayBar({ index, label, valueMm, isToday, onChange }: DayBarProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const ratio = clamp(valueMm / MAX_MM, 0, 1);

  const setFromClientY = (clientY: number) => {
    const el = trackRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const next = (1 - (clientY - rect.top) / rect.height) * MAX_MM;
    onChange(index, clamp(next, 0, MAX_MM));
  };

  return (
    <div className="flex flex-1 flex-col items-center gap-1">
      <span className="text-[10px] font-semibold tabular-nums text-ocean-700">
        {Math.round(valueMm)}
      </span>
      <div
        ref={trackRef}
        role="slider"
        tabIndex={0}
        aria-label={`Rainfall ${label}`}
        aria-valuemin={0}
        aria-valuemax={MAX_MM}
        aria-valuenow={Math.round(valueMm)}
        onPointerDown={(event) => {
          event.currentTarget.setPointerCapture(event.pointerId);
          setFromClientY(event.clientY);
        }}
        onPointerMove={(event) => {
          if (event.buttons === 1) setFromClientY(event.clientY);
        }}
        onKeyDown={(event) => {
          if (event.key === "ArrowUp" || event.key === "ArrowRight") {
            event.preventDefault();
            onChange(index, clamp(valueMm + 3, 0, MAX_MM));
          } else if (event.key === "ArrowDown" || event.key === "ArrowLeft") {
            event.preventDefault();
            onChange(index, clamp(valueMm - 3, 0, MAX_MM));
          }
        }}
        className={cn(
          "relative h-28 w-full cursor-ns-resize touch-none overflow-hidden rounded-lg bg-ocean-50 ring-1 ring-ocean-100 transition-shadow",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-ocean-400",
        )}
      >
        <div
          className="absolute inset-x-0 bottom-0 rounded-t-lg bg-gradient-to-t from-ocean-500 to-ocean-300"
          style={{ height: `${ratio * 100}%` }}
        />
      </div>
      <span
        className={cn(
          "text-[10px] font-medium",
          isToday ? "text-ocean-700" : "text-ocean-500/70",
        )}
      >
        {label}
      </span>
    </div>
  );
}

interface RainfallDayBarsProps {
  rainfall7day: number[];
  onChangeDay: (index: number, millimeters: number) => void;
}

/** Seven-day rainfall editor. Each column is a draggable daily total in mm. */
export function RainfallDayBars({
  rainfall7day,
  onChangeDay,
}: RainfallDayBarsProps) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between text-[11px] font-medium uppercase tracking-wide text-ocean-600/80">
        <span>Daily rainfall</span>
        <span>mm</span>
      </div>
      <div className="flex items-end gap-1.5">
        {rainfall7day.map((value, index) => (
          <DayBar
            key={index}
            index={index}
            label={DAY_LABELS[index]}
            valueMm={value}
            isToday={index === rainfall7day.length - 1}
            onChange={onChangeDay}
          />
        ))}
      </div>
    </div>
  );
}
