"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { INTENSITY_PRESETS } from "@/lib/constants";
import { generateForecast } from "@/lib/forecast";
import { runSimulation } from "@/lib/simulation";
import type {
  BeachPrediction,
  ForecastDay,
  RainfallScenario,
  Region,
  SimulationResult,
  StormIntensity,
} from "@/lib/types";
import { clamp } from "@/lib/utils";

interface SimulationContextValue {
  scenario: RainfallScenario;
  result: SimulationResult;
  /** Increments each time a fresh run is committed; drives panel re-animation. */
  runId: number;
  selectedBeachId: string | null;
  selectedPrediction: BeachPrediction | null;
  selectedForecast: ForecastDay[] | null;
  hoveredBeachId: string | null;
  setIntensity: (intensity: StormIntensity) => void;
  setMonth: (month: number) => void;
  setFocusRegion: (region: Region | "island-wide") => void;
  setRainfallDay: (dayIndex: number, millimeters: number) => void;
  selectBeach: (beachId: string | null) => void;
  hoverBeach: (beachId: string | null) => void;
  resetScenario: () => void;
  rerun: () => void;
}

const DEFAULT_SCENARIO: RainfallScenario = {
  rainfall7day: [...INTENSITY_PRESETS.moderate.pattern],
  month: 2,
  focusRegion: "island-wide",
  intensity: "moderate",
};

const SimulationContext = createContext<SimulationContextValue | null>(null);

export function SimulationProvider({ children }: { children: ReactNode }) {
  const [scenario, setScenario] = useState<RainfallScenario>(DEFAULT_SCENARIO);
  const [selectedBeachId, setSelectedBeachId] = useState<string | null>(null);
  const [hoveredBeachId, setHoveredBeachId] = useState<string | null>(null);
  const [runId, setRunId] = useState(0);

  const result = useMemo(() => runSimulation(scenario), [scenario]);

  const setIntensity = useCallback((intensity: StormIntensity) => {
    setScenario((prev) => ({
      ...prev,
      intensity,
      rainfall7day: [...INTENSITY_PRESETS[intensity].pattern],
    }));
    setRunId((id) => id + 1);
  }, []);

  const setMonth = useCallback((month: number) => {
    setScenario((prev) => ({ ...prev, month: clamp(month, 1, 12) }));
    setRunId((id) => id + 1);
  }, []);

  const setFocusRegion = useCallback((focusRegion: Region | "island-wide") => {
    setScenario((prev) => ({ ...prev, focusRegion }));
    setRunId((id) => id + 1);
  }, []);

  const setRainfallDay = useCallback(
    (dayIndex: number, millimeters: number) => {
      setScenario((prev) => {
        const next = [...prev.rainfall7day];
        next[dayIndex] = clamp(Math.round(millimeters), 0, 120);
        return { ...prev, rainfall7day: next, intensity: "custom" };
      });
      setRunId((id) => id + 1);
    },
    [],
  );

  const selectBeach = useCallback((beachId: string | null) => {
    setSelectedBeachId(beachId);
  }, []);

  const hoverBeach = useCallback((beachId: string | null) => {
    setHoveredBeachId(beachId);
  }, []);

  const resetScenario = useCallback(() => {
    setScenario(DEFAULT_SCENARIO);
    setSelectedBeachId(null);
    setRunId((id) => id + 1);
  }, []);

  const rerun = useCallback(() => {
    setSelectedBeachId(null);
    setRunId((id) => id + 1);
  }, []);

  const selectedPrediction = useMemo(
    () =>
      selectedBeachId
        ? (result.predictions.find(
            (prediction) => prediction.beach.locationId === selectedBeachId,
          ) ?? null)
        : null,
    [result.predictions, selectedBeachId],
  );

  const selectedForecast = useMemo(
    () =>
      selectedPrediction
        ? generateForecast(selectedPrediction.beach, scenario)
        : null,
    [selectedPrediction, scenario],
  );

  const value = useMemo<SimulationContextValue>(
    () => ({
      scenario,
      result,
      runId,
      selectedBeachId,
      selectedPrediction,
      selectedForecast,
      hoveredBeachId,
      setIntensity,
      setMonth,
      setFocusRegion,
      setRainfallDay,
      selectBeach,
      hoverBeach,
      resetScenario,
      rerun,
    }),
    [
      scenario,
      result,
      runId,
      selectedBeachId,
      selectedPrediction,
      selectedForecast,
      hoveredBeachId,
      setIntensity,
      setMonth,
      setFocusRegion,
      setRainfallDay,
      selectBeach,
      hoverBeach,
      resetScenario,
      rerun,
    ],
  );

  return (
    <SimulationContext.Provider value={value}>
      {children}
    </SimulationContext.Provider>
  );
}

/** Access the simulation state. Must be used inside SimulationProvider. */
export function useSimulation(): SimulationContextValue {
  const context = useContext(SimulationContext);
  if (!context) {
    throw new Error("useSimulation must be used within a SimulationProvider");
  }
  return context;
}
