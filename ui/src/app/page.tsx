import { AppStage } from "@/components/layout/AppStage";
import { SimulationProvider } from "@/context/SimulationContext";

export default function Home() {
  return (
    <SimulationProvider>
      <main className="min-h-screen w-full">
        <AppStage />
      </main>
    </SimulationProvider>
  );
}
