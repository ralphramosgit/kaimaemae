import { cn } from "@/lib/utils";

const WAVE_PATH =
  "M0,64 C240,96 480,32 720,64 C960,96 1200,32 1440,64 C1680,96 1920,32 2160,64 C2400,96 2640,32 2880,64 L2880,120 L0,120 Z";

interface WaveLayerProps {
  fill: string;
  opacity: number;
  animationClass: string;
  className?: string;
  scaleY?: number;
}

/** One horizontally scrolling wave band. Duplicated tiles give a seamless loop. */
function WaveLayer({
  fill,
  opacity,
  animationClass,
  className,
  scaleY = 1,
}: WaveLayerProps) {
  return (
    <div className={cn("absolute inset-x-0", className)}>
      <svg
        className={cn("h-full w-[200%]", animationClass)}
        viewBox="0 0 2880 120"
        preserveAspectRatio="none"
        style={{ transform: `scaleY(${scaleY})` }}
        aria-hidden
      >
        <path d={WAVE_PATH} fill={fill} fillOpacity={opacity} />
      </svg>
    </div>
  );
}

/**
 * Three-layer animated ocean. Each band scrolls at a different speed to build
 * parallax depth behind the island. Purely decorative.
 */
export function WaveBackground({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden",
        className,
      )}
      aria-hidden
    >
      {/* Soft sky-to-ocean wash. */}
      <div className="absolute inset-0 bg-gradient-to-b from-sand-50 via-ocean-50 to-ocean-200" />

      {/* Sun-glow highlight near the horizon. */}
      <div className="absolute left-1/2 top-[18%] h-72 w-72 -translate-x-1/2 rounded-full bg-sand-100/60 blur-3xl" />

      <WaveLayer
        fill="#A2DBEF"
        opacity={0.55}
        animationClass="animate-wave-x-slow"
        className="bottom-[24%] h-40"
        scaleY={0.8}
      />
      <WaveLayer
        fill="#6FC4E4"
        opacity={0.6}
        animationClass="animate-wave-x"
        className="bottom-[10%] h-52"
      />
      <WaveLayer
        fill="#3FA8D4"
        opacity={0.7}
        animationClass="animate-wave-x-fast"
        className="bottom-0 h-56"
        scaleY={1.1}
      />

      {/* Deep water base. */}
      <div className="absolute inset-x-0 bottom-0 h-[10%] bg-ocean-500/70" />
    </div>
  );
}
