"use client";

import { useSimulation } from "@/context/SimulationContext";
import { project } from "@/lib/geo";

import { BeachPin } from "./BeachPin";

/** Renders every beach as an interactive pin, wired to the simulation state. */
export function BeachPins() {
  const {
    result,
    scenario,
    selectedBeachId,
    hoveredBeachId,
    selectBeach,
    hoverBeach,
  } = useSimulation();

  return (
    <div className="absolute inset-0">
      {result.predictions.map((prediction, index) => {
        const { latitude, longitude, locationId, region } = prediction.beach;
        const focused =
          scenario.focusRegion === "island-wide" ||
          scenario.focusRegion === region;

        return (
          <BeachPin
            key={locationId}
            prediction={prediction}
            point={project(latitude, longitude)}
            index={index}
            selected={selectedBeachId === locationId}
            hovered={hoveredBeachId === locationId}
            dimmed={!focused}
            onSelect={() => selectBeach(locationId)}
            onHover={(hovering) => hoverBeach(hovering ? locationId : null)}
          />
        );
      })}
    </div>
  );
}
