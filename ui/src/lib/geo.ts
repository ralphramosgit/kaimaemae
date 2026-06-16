import { OAHU_BOUNDS } from "@/lib/constants";
import { clamp } from "@/lib/utils";

/** A point projected onto the 0..100 map coordinate space. */
export interface MapPoint {
  /** Horizontal position as a percentage of map width (0 left, 100 right). */
  x: number;
  /** Vertical position as a percentage of map height (0 top, 100 bottom). */
  y: number;
}

/**
 * Project a latitude/longitude onto the stylized map.
 * Longitude maps west to east across x; latitude maps north (top) to
 * south (bottom) down y so the orientation matches a north-up map.
 */
export function project(latitude: number, longitude: number): MapPoint {
  const { latMin, latMax, lonMin, lonMax } = OAHU_BOUNDS;
  const x = ((longitude - lonMin) / (lonMax - lonMin)) * 100;
  const y = ((latMax - latitude) / (latMax - latMin)) * 100;
  return { x: clamp(x, 0, 100), y: clamp(y, 0, 100) };
}
