"use client";

import { useState } from "react";
import { ListOrdered } from "lucide-react";

import { Panel, PanelHeader } from "@/components/ui/Panel";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { useSimulation } from "@/context/SimulationContext";

import { BeachSafetyList } from "./BeachSafetyList";

type Tab = "unsafe" | "safe";

const TAB_OPTIONS = [
  { value: "unsafe" as const, label: "Most unsafe" },
  { value: "safe" as const, label: "Safest" },
];

/**
 * Ranked beach lists. Toggles between the ten highest-risk and ten safest
 * beaches under the active scenario.
 */
export function SafetyListPanel() {
  const { result } = useSimulation();
  const [tab, setTab] = useState<Tab>("unsafe");

  const predictions = tab === "unsafe" ? result.mostUnsafe : result.mostSafe;

  return (
    <Panel
      className="flex w-[340px] max-w-[calc(100vw-2rem)] flex-col"
      delay={0.25}
    >
      <PanelHeader
        icon={<ListOrdered className="h-5 w-5" />}
        title="Beach safety ranking"
        subtitle="Top ten beaches by predicted water safety"
      />
      <div className="px-4 pt-3">
        <SegmentedControl
          options={TAB_OPTIONS}
          value={tab}
          onChange={setTab}
          layoutId="safety-list-tab"
          size="sm"
          fluid
        />
      </div>
      <div className="scroll-island max-h-[40vh] overflow-y-auto px-3 py-2">
        <BeachSafetyList predictions={predictions} />
      </div>
    </Panel>
  );
}
