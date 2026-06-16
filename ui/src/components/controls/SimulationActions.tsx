"use client";

import { RotateCcw, Waves } from "lucide-react";

import { Button } from "@/components/ui/Button";

interface SimulationActionsProps {
  onRun: () => void;
  onReset: () => void;
}

/** Primary run and reset actions for the control panel. */
export function SimulationActions({ onRun, onReset }: SimulationActionsProps) {
  return (
    <div className="flex items-center gap-2">
      <Button
        onClick={onRun}
        className="flex-1"
        leadingIcon={<Waves className="h-4 w-4" />}
      >
        New simulation
      </Button>
      <Button
        variant="secondary"
        onClick={onReset}
        leadingIcon={<RotateCcw className="h-4 w-4" />}
      >
        Reset
      </Button>
    </div>
  );
}
