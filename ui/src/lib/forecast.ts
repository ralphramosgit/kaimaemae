import { BAV_THRESHOLD } from "@/lib/constants";
import {
  predictProbability,
  probabilityToEnterococcus,
  rainfallPressure,
  buildFeatures,
  safetyFromProbability,
} from "@/lib/simulation";
import type { Beach, ForecastDay, RainfallScenario } from "@/lib/types";
import { clamp, seededUnit } from "@/lib/utils";

/**
 * Build a seven-day forward water-quality forecast for one beach.
 *
 * The scenario establishes today's rainfall pressure. With no new rain assumed,
 * that pressure decays over the following days as runoff washes out, so the
 * unsafe probability relaxes toward the beach baseline. A small deterministic
 * wiggle keeps the curve from looking artificially smooth.
 */
export function generateForecast(
  beach: Beach,
  scenario: RainfallScenario,
): ForecastDay[] {
  const features = buildFeatures(scenario.rainfall7day, scenario.month);
  const todayPressure = rainfallPressure(features);
  const decay = 0.62;

  return Array.from({ length: 7 }, (_, dayOffset) => {
    const wiggle =
      (seededUnit(`${beach.locationId}-fc-${dayOffset}`) - 0.5) * 0.06;
    const decayedPressure = clamp(
      todayPressure * decay ** dayOffset + wiggle * dayOffset,
      0,
      1,
    );
    const probability = predictProbability(
      beach,
      decayedPressure,
      scenario.month,
    );

    return {
      dayOffset,
      label: dayOffset === 0 ? "Today" : `+${dayOffset}d`,
      unsafeProbability: probability,
      predictedEnterococcus: probabilityToEnterococcus(probability),
      safetyLevel: safetyFromProbability(probability),
    };
  });
}

/** Day index where the forecast first returns to a safe verdict, if any. */
export function firstSafeDay(forecast: ForecastDay[]): ForecastDay | null {
  return forecast.find((day) => day.safetyLevel === "safe") ?? null;
}

/** Convenience reference re-export for chart axis labeling. */
export const FORECAST_THRESHOLD = BAV_THRESHOLD;
