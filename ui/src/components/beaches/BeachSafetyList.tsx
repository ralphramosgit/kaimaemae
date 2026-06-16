"use client";

import { useSimulation } from "@/context/SimulationContext";
import type { BeachPrediction } from "@/lib/types";

import { BeachListItem } from "./BeachListItem";

interface BeachSafetyListProps {
  predictions: BeachPrediction[];
}

/** Ordered list of beach rows wired to map selection and hover. */
export function BeachSafetyList({ predictions }: BeachSafetyListProps) {
  const { hoveredBeachId, selectBeach, hoverBeach } = useSimulation();

  return (
    <ul className="space-y-0.5">
      {predictions.map((prediction, index) => (
        <BeachListItem
          key={prediction.beach.locationId}
          prediction={prediction}
          rank={index + 1}
          isHovered={hoveredBeachId === prediction.beach.locationId}
          onSelect={() => selectBeach(prediction.beach.locationId)}
          onHover={(hovering) =>
            hoverBeach(hovering ? prediction.beach.locationId : null)
          }
        />
      ))}
    </ul>
  );
}
