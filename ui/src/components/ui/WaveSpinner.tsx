import { cn } from "@/lib/utils";

interface WaveSpinnerProps {
  className?: string;
  /** Bar color utility class, e.g. "bg-ocean-400". */
  barClassName?: string;
}

const BAR_HEIGHTS = ["h-3", "h-5", "h-4", "h-6"];

/** Animated bar wave used as an inline loading indicator. */
export function WaveSpinner({ className, barClassName }: WaveSpinnerProps) {
  return (
    <div
      className={cn("flex items-end gap-1", className)}
      role="status"
      aria-label="Loading"
    >
      {BAR_HEIGHTS.map((height, index) => (
        <span
          key={index}
          className={cn(
            "w-1.5 rounded-full bg-ocean-400 animate-float",
            height,
            barClassName,
          )}
          style={{
            animationDelay: `${index * 0.14}s`,
            animationDuration: "1s",
          }}
        />
      ))}
    </div>
  );
}
