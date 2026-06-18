"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

import { BackgroundShader } from "@/components/ui/background-shader";

const BUBBLES = [
  { left: "18%", size: 10, delay: 0 },
  { left: "32%", size: 6, delay: 0.6 },
  { left: "54%", size: 14, delay: 0.3 },
  { left: "68%", size: 8, delay: 0.9 },
  { left: "82%", size: 6, delay: 0.45 },
];

// Three concentric ocean-ripple rings that emanate when check + wave converge
const RIPPLE_RINGS = [
  { color: "#bae6fd", borderWidth: 3,   delay: 0,    maxScale: 4.4 },
  { color: "#38bdf8", borderWidth: 2.5, delay: 0.14, maxScale: 4.0 },
  { color: "#0ea5e9", borderWidth: 2,   delay: 0.28, maxScale: 3.6 },
];

// Phase 1 "elements" : checkmark draws from above, wave rises from below
// Phase 2 "merging"  : both converge, ocean ripples radiate outward
// Phase 3 "logo"     : KaiChecks logo springs out of the ripple centre
type Phase = "elements" | "merging" | "logo";

export function LoadingScreen() {
  const [phase, setPhase] = useState<Phase>("elements");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("merging"), 1350);
    const t2 = setTimeout(() => setPhase("logo"), 1900);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  return (
    <div className="relative flex h-screen w-full flex-col items-center justify-center overflow-hidden">
      <BackgroundShader />

      {/* Rising bubbles */}
      {BUBBLES.map((bubble, i) => (
        <motion.span
          key={i}
          className="absolute bottom-[30%] rounded-full bg-white/50"
          style={{ left: bubble.left, width: bubble.size, height: bubble.size }}
          initial={{ y: 0, opacity: 0 }}
          animate={{ y: -120, opacity: [0, 0.8, 0] }}
          transition={{
            duration: 2.4,
            delay: bubble.delay,
            repeat: Infinity,
            ease: "easeOut",
          }}
        />
      ))}

      <div className="relative z-10 flex flex-col items-center text-center">
        {/* 160 × 160 animation stage */}
        <div className="relative flex h-40 w-40 items-center justify-center">

          {/* Shared SVG glow filter definitions */}
          <svg width={0} height={0} className="absolute overflow-visible">
            <defs>
              <filter id="kc-glow-white" x="-60%" y="-60%" width="220%" height="220%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <filter id="kc-glow-cyan" x="-60%" y="-60%" width="220%" height="220%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
          </svg>

          {/* ── Checkmark ── draws from above, exits down toward centre */}
          <AnimatePresence>
            {phase === "elements" && (
              <motion.div
                key="check"
                className="absolute"
                initial={{ y: -64, opacity: 0, scale: 0.5 }}
                animate={{ y: -28, opacity: 1, scale: 1 }}
                exit={{
                  y: 5,
                  scale: 0.05,
                  opacity: 0,
                  transition: { duration: 0.42, ease: "easeIn" },
                }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                <svg viewBox="0 0 52 42" width={56} height={44} fill="none">
                  <motion.path
                    d="M 6 24 L 20 36 L 46 8"
                    stroke="white"
                    strokeWidth={5.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    filter="url(#kc-glow-white)"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 0.65, ease: "easeInOut", delay: 0.1 }}
                  />
                </svg>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Ocean wave ── rises from below, exits up toward centre */}
          <AnimatePresence>
            {phase === "elements" && (
              <motion.div
                key="wave"
                className="absolute"
                initial={{ y: 66, opacity: 0, scale: 0.5 }}
                animate={{ y: 28, opacity: 1, scale: 1 }}
                exit={{
                  y: -5,
                  scale: 0.05,
                  opacity: 0,
                  transition: { duration: 0.42, ease: "easeIn" },
                }}
                transition={{ duration: 0.5, ease: "easeOut", delay: 0.15 }}
              >
                {/* Lateral sway while visible */}
                <motion.div
                  animate={{ x: [0, -6, 6, -6, 0] }}
                  transition={{ duration: 1.8, ease: "easeInOut", repeat: Infinity, delay: 0.5 }}
                >
                  <svg viewBox="0 0 68 40" width={68} height={40} fill="none">
                    <motion.path
                      d="M 0 20 C 8 9, 17 9, 26 20 C 35 31, 44 31, 52 20 C 57 14, 62 12, 68 20"
                      stroke="#7dd3fc"
                      strokeWidth={4.5}
                      strokeLinecap="round"
                      filter="url(#kc-glow-cyan)"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 1 }}
                      transition={{ duration: 0.75, ease: "easeInOut", delay: 0.3 }}
                    />
                    <motion.path
                      d="M 0 30 C 8 19, 17 19, 26 30 C 35 41, 44 41, 52 30 C 57 24, 62 22, 68 30"
                      stroke="#bae6fd"
                      strokeWidth={3}
                      strokeLinecap="round"
                      strokeOpacity={0.6}
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 1 }}
                      transition={{ duration: 0.75, ease: "easeInOut", delay: 0.5 }}
                    />
                  </svg>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Ocean ripple rings ── radiate outward when check + wave converge */}
          <AnimatePresence>
            {phase === "merging" && (
              <>
                {RIPPLE_RINGS.map((ring, i) => (
                  <motion.div
                    key={`ring-${i}`}
                    className="absolute rounded-full"
                    style={{
                      width: 56,
                      height: 56,
                      border: `${ring.borderWidth}px solid ${ring.color}`,
                      boxShadow: `0 0 8px 2px ${ring.color}55`,
                    }}
                    initial={{ scale: 0.3, opacity: 0.85 }}
                    animate={{ scale: ring.maxScale, opacity: 0 }}
                    transition={{ duration: 0.7, ease: "easeOut", delay: ring.delay }}
                  />
                ))}
              </>
            )}
          </AnimatePresence>

          {/* ── Logo ── springs out from the ripple centre */}
          <AnimatePresence>
            {phase === "logo" && (
              <motion.div
                key="logo"
                className="overflow-hidden rounded-3xl bg-white shadow-2xl"
                initial={{ scale: 0.08, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 310, damping: 22 }}
              >
                <motion.div
                  animate={{ y: [0, -6, 0], scale: [1, 1.04, 1] }}
                  transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Image
                    src="/kaichecks-logo.png"
                    alt="KaiChecks"
                    width={112}
                    height={112}
                    className="block"
                    priority
                  />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <motion.h1
          className="mt-5 text-3xl font-bold tracking-tight text-white"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.1 }}
        >
          KaiChecks
        </motion.h1>
        <motion.p
          className="mt-1 text-sm font-medium text-white/70"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.25 }}
        >
          Oahu beach water safety simulator
        </motion.p>

        <div className="mt-7 h-1.5 w-56 overflow-hidden rounded-full bg-white/20">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-sky-300 to-cyan-300"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 2.4, ease: "easeInOut", delay: 0.2 }}
          />
        </div>
        <motion.span
          className="mt-3 text-xs font-medium uppercase tracking-[0.2em] text-white/60"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Charting the coastline
        </motion.span>
      </div>
    </div>
  );
}
