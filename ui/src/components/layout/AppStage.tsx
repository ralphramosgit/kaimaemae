"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { HeroSection } from "@/components/hero/HeroSection";
import { LoadingScreen } from "@/components/loading/LoadingScreen";
import type { AppPhase } from "@/lib/types";

import { DashboardLayout } from "./DashboardLayout";

const LOADING_MS = 2200;

const TRANSITION = { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const };

/**
 * Owns the top-level experience phase and crossfades between the loading
 * screen, the landing hero, and the simulator dashboard.
 */
export function AppStage() {
  const [phase, setPhase] = useState<AppPhase>("loading");

  useEffect(() => {
    if (phase !== "loading") return;
    const timer = setTimeout(() => setPhase("intro"), LOADING_MS);
    return () => clearTimeout(timer);
  }, [phase]);

  return (
    <AnimatePresence mode="wait">
      {phase === "loading" ? (
        <motion.div
          key="loading"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={TRANSITION}
        >
          <LoadingScreen />
        </motion.div>
      ) : null}

      {phase === "intro" ? (
        <motion.div
          key="intro"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={TRANSITION}
        >
          <HeroSection onEnter={() => setPhase("dashboard")} />
        </motion.div>
      ) : null}

      {phase === "dashboard" ? (
        <motion.div
          key="dashboard"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={TRANSITION}
        >
          <DashboardLayout onRestart={() => setPhase("intro")} />
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
