import { REGION_LABELS, SAFETY_META } from "@/lib/constants";
import { firstSafeDay } from "@/lib/forecast";
import type {
  BeachPrediction,
  ForecastDay,
  RainfallScenario,
  Region,
  SimulationResult,
} from "@/lib/types";
import { MONTHS } from "@/lib/constants";
import { formatPercent } from "@/lib/utils";

/**
 * Deterministic narrative generators.
 *
 * These stand in for the future model-grounded LLM summary. They are written
 * from the same numbers the panels show so the language always matches the
 * data, and they carry no runtime randomness.
 */

/** A short, human-readable storm descriptor for the active scenario. */
function scenarioPhrase(
  scenario: RainfallScenario,
  result: SimulationResult,
): string {
  const total = result.features.rain7day;
  const month = MONTHS[scenario.month - 1];
  if (total <= 1) return `a dry week in ${month}`;
  if (total < 20) return `light showers in ${month}`;
  if (total < 60) return `a moderately wet stretch in ${month}`;
  if (total < 120) return `heavy rainfall in ${month}`;
  return `an intense storm system in ${month}`;
}

/** One-paragraph summary for a single beach detail view. */
export function summarizeBeach(
  prediction: BeachPrediction,
  forecast: ForecastDay[],
  scenario: RainfallScenario,
): string {
  const { beach, unsafeProbability, predictedEnterococcus, safetyLevel } =
    prediction;
  const verdict = SAFETY_META[safetyLevel].label.toLowerCase();
  const month = MONTHS[scenario.month - 1];
  const recovery = firstSafeDay(forecast);

  const lead =
    safetyLevel === "unsafe"
      ? `Under the simulated rainfall, ${beach.name} is predicted to be ${verdict} for swimming.`
      : safetyLevel === "caution"
        ? `${beach.name} sits near the safety threshold under this scenario, so use caution.`
        : `${beach.name} is predicted to stay ${verdict} under this scenario.`;

  const numbers = `The model estimates a ${formatPercent(
    unsafeProbability,
  )} chance of exceeding the action level, with enterococcus around ${predictedEnterococcus} CFU per 100 mL.`;

  const history = `Historically, ${formatPercent(
    beach.exceedanceRate,
  )} of ${beach.samples.toLocaleString()} samples here exceeded the standard.`;

  const recoveryNote =
    safetyLevel === "safe"
      ? `Conditions look favorable through the ${month} outlook.`
      : recovery
        ? `Water quality is projected to return to safe levels around ${recovery.label === "Today" ? "today" : recovery.label}.`
        : `Levels stay elevated across the seven-day outlook, so monitor before entering the water.`;

  return `${lead} ${numbers} ${history} ${recoveryNote}`;
}

export interface Finding {
  id: string;
  title: string;
  detail: string;
  tone: "safe" | "caution" | "unsafe" | "neutral";
}

/** Generate the bullet findings shown in the results panel. */
export function generateFindings(
  result: SimulationResult,
  scenario: RainfallScenario,
): Finding[] {
  const findings: Finding[] = [];
  const total = result.predictions.length;
  const phrase = scenarioPhrase(scenario, result);

  findings.push({
    id: "overview",
    title: `${result.unsafeCount} of ${total} beaches flagged unsafe`,
    detail: `Across ${phrase}, the model flags ${result.unsafeCount} unsafe and ${result.cautionCount} caution locations island-wide.`,
    tone: result.unsafeCount > total * 0.3 ? "unsafe" : "neutral",
  });

  const worst = result.mostUnsafe[0];
  if (worst) {
    findings.push({
      id: "worst",
      title: `${worst.beach.name} shows the highest risk`,
      detail: `Predicted ${formatPercent(
        worst.unsafeProbability,
      )} exceedance probability, about ${worst.predictedEnterococcus} CFU per 100 mL.`,
      tone: "unsafe",
    });
  }

  // Which region is most affected by the scenario.
  const regionTotals = new Map<Region, { sum: number; count: number }>();
  for (const prediction of result.predictions) {
    const entry = regionTotals.get(prediction.beach.region) ?? {
      sum: 0,
      count: 0,
    };
    entry.sum += prediction.unsafeProbability;
    entry.count += 1;
    regionTotals.set(prediction.beach.region, entry);
  }
  let topRegion: Region | null = null;
  let topAvg = -1;
  for (const [region, { sum, count }] of regionTotals) {
    const avg = sum / count;
    if (avg > topAvg) {
      topAvg = avg;
      topRegion = region;
    }
  }
  if (topRegion) {
    findings.push({
      id: "region",
      title: `${REGION_LABELS[topRegion]} is most affected`,
      detail: `This coast carries the highest average exceedance probability at ${formatPercent(
        topAvg,
      )} under the current rainfall.`,
      tone: topAvg >= 0.5 ? "unsafe" : topAvg >= 0.25 ? "caution" : "neutral",
    });
  }

  const safest = result.mostSafe[0];
  if (safest) {
    findings.push({
      id: "safest",
      title: `${safest.beach.name} remains the safest bet`,
      detail: `Lowest predicted risk at ${formatPercent(
        safest.unsafeProbability,
      )} exceedance probability.`,
      tone: "safe",
    });
  }

  return findings;
}

/** Short headline used by the results panel summary banner. */
export function summarizeIsland(
  result: SimulationResult,
  scenario: RainfallScenario,
): string {
  const phrase = scenarioPhrase(scenario, result);
  return `Under ${phrase}, average island exceedance probability is ${formatPercent(
    result.averageProbability,
  )}. ${result.safeCount} beaches stay safe, ${result.cautionCount} warrant caution, and ${result.unsafeCount} are unsafe.`;
}
