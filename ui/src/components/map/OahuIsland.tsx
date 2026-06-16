import {
  KOOLAU_RIDGE,
  OAHU_CENTROID,
  OAHU_ISLAND_PATH,
  WAIANAE_RIDGE,
} from "@/lib/island";
import { cn } from "@/lib/utils";

const { x: cx, y: cy } = OAHU_CENTROID;
const insetTransform = `translate(${cx} ${cy}) scale(0.955) translate(${-cx} ${-cy})`;

/**
 * Stylized, lightly three-dimensional rendering of Oahu.
 *
 * Layered SVG paths fake depth: an ocean shadow beneath the landmass, a sand
 * coast rim, a shaded vegetation interior, and the two mountain ridges. The
 * whole island bobs gently on the water.
 */
export function OahuIsland({ className }: { className?: string }) {
  return (
    <svg
      className={cn("h-full w-full animate-float-slow", className)}
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      aria-hidden
    >
      <defs>
        <linearGradient id="land-fill" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#C2DBB2" />
          <stop offset="48%" stopColor="#9FC588" />
          <stop offset="100%" stopColor="#5E9047" />
        </linearGradient>
        <linearGradient id="sand-rim" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#F5ECD9" />
          <stop offset="100%" stopColor="#E0C99B" />
        </linearGradient>
        <radialGradient id="land-sheen" cx="0.32" cy="0.28" r="0.8">
          <stop offset="0%" stopColor="#F0F6EC" stopOpacity="0.85" />
          <stop offset="55%" stopColor="#F0F6EC" stopOpacity="0" />
        </radialGradient>
        <filter id="island-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="1.6" />
        </filter>
      </defs>

      {/* Ocean shadow cast beneath the island for depth. */}
      <g transform="translate(1.4 2.6)" filter="url(#island-shadow)">
        <path d={OAHU_ISLAND_PATH} fill="#0C3B50" fillOpacity={0.28} />
      </g>

      {/* Sand coast rim. */}
      <path
        d={OAHU_ISLAND_PATH}
        fill="url(#sand-rim)"
        stroke="#D4B47A"
        strokeWidth={0.4}
      />

      {/* Vegetated land, inset so the sand rim shows as a beach ring. */}
      <g transform={insetTransform}>
        <path d={OAHU_ISLAND_PATH} fill="url(#land-fill)" />
        <path d={OAHU_ISLAND_PATH} fill="url(#land-sheen)" />

        {/* Mountain ridges. */}
        <path
          d={KOOLAU_RIDGE}
          fill="none"
          stroke="#497336"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeOpacity={0.55}
        />
        <path
          d={KOOLAU_RIDGE}
          fill="none"
          stroke="#DDEBD3"
          strokeWidth={0.5}
          strokeLinecap="round"
          strokeOpacity={0.7}
          transform="translate(-0.6 -0.6)"
        />
        <path
          d={WAIANAE_RIDGE}
          fill="none"
          stroke="#497336"
          strokeWidth={1.3}
          strokeLinecap="round"
          strokeOpacity={0.5}
        />
        <path
          d={WAIANAE_RIDGE}
          fill="none"
          stroke="#DDEBD3"
          strokeWidth={0.45}
          strokeLinecap="round"
          strokeOpacity={0.65}
          transform="translate(-0.6 -0.6)"
        />
      </g>
    </svg>
  );
}
