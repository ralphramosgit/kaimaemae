import type { MapPoint } from "@/lib/geo";

/**
 * Stylized Oahu coastline anchor points in the 0..100 map coordinate space,
 * ordered clockwise from Kaena Point. These approximate the real island
 * silhouette so projected beach pins sit close to the coast.
 */
const OAHU_OUTLINE: MapPoint[] = [
  { x: 4, y: 33 }, // Kaena Point (north-west tip)
  { x: 13, y: 20 }, // Mokuleia coast
  { x: 26, y: 12 }, // Waialua and Haleiwa
  { x: 36, y: 9 }, // Waimea
  { x: 46, y: 6 }, // Sunset
  { x: 53, y: 11 }, // Kahuku point (north-east)
  { x: 56, y: 22 }, // Laie
  { x: 60, y: 33 }, // Punaluu and Kahana
  { x: 66, y: 44 }, // Kaaawa and Kualoa
  { x: 73, y: 52 }, // Kaneohe Bay
  { x: 83, y: 58 }, // Kailua
  { x: 90, y: 67 }, // Lanikai and Waimanalo
  { x: 95, y: 82 }, // Makapuu (east tip)
  { x: 89, y: 90 }, // Hanauma and Hawaii Kai
  { x: 79, y: 93 }, // Maunalua Bay
  { x: 69, y: 95 }, // Diamond Head and Waikiki
  { x: 59, y: 94 }, // Honolulu Harbor
  { x: 49, y: 92 }, // Pearl Harbor entrance
  { x: 39, y: 90 }, // Ewa
  { x: 30, y: 88 }, // Barbers Point (south-west)
  { x: 21, y: 78 }, // Kahe and Nanakuli
  { x: 14, y: 66 }, // Maili and Waianae
  { x: 8, y: 54 }, // Makaha
  { x: 5, y: 44 }, // Yokohama
];

/**
 * Convert a closed ring of points into a smooth SVG path using a
 * Catmull-Rom spline (wrapped to Bezier segments) so the coastline reads as
 * an organic landmass rather than a hard polygon.
 */
function catmullRomClosedPath(points: MapPoint[]): string {
  const n = points.length;
  if (n < 3) return "";
  let d = `M ${points[0].x.toFixed(2)} ${points[0].y.toFixed(2)}`;
  for (let i = 0; i < n; i += 1) {
    const p0 = points[(i - 1 + n) % n];
    const p1 = points[i];
    const p2 = points[(i + 1) % n];
    const p3 = points[(i + 2) % n];
    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${cp1x.toFixed(2)} ${cp1y.toFixed(2)}, ${cp2x.toFixed(2)} ${cp2y.toFixed(2)}, ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`;
  }
  return `${d} Z`;
}

/** Smooth Catmull-Rom path through an open list of points. */
function smoothOpenPath(points: MapPoint[]): string {
  if (points.length < 2) return "";
  let d = `M ${points[0].x.toFixed(2)} ${points[0].y.toFixed(2)}`;
  for (let i = 0; i < points.length - 1; i += 1) {
    const p0 = points[Math.max(0, i - 1)];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[Math.min(points.length - 1, i + 2)];
    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${cp1x.toFixed(2)} ${cp1y.toFixed(2)}, ${cp2x.toFixed(2)} ${cp2y.toFixed(2)}, ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`;
  }
  return d;
}

/** The smooth island coastline path. */
export const OAHU_ISLAND_PATH = catmullRomClosedPath(OAHU_OUTLINE);

/** Island centroid, used as the origin for the inset land scaling. */
export const OAHU_CENTROID: MapPoint = {
  x: OAHU_OUTLINE.reduce((sum, p) => sum + p.x, 0) / OAHU_OUTLINE.length,
  y: OAHU_OUTLINE.reduce((sum, p) => sum + p.y, 0) / OAHU_OUTLINE.length,
};

/** Koolau mountain range ridge line (windward side). */
export const KOOLAU_RIDGE = smoothOpenPath([
  { x: 49, y: 21 },
  { x: 55, y: 31 },
  { x: 61, y: 42 },
  { x: 68, y: 52 },
  { x: 76, y: 63 },
  { x: 84, y: 73 },
]);

/** Waianae mountain range ridge line (leeward side). */
export const WAIANAE_RIDGE = smoothOpenPath([
  { x: 9, y: 41 },
  { x: 13, y: 51 },
  { x: 19, y: 60 },
  { x: 26, y: 71 },
]);
