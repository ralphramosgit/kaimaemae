"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface PanelProps {
  children: ReactNode;
  className?: string;
  variant?: "glass" | "tinted";
  /** Stagger delay in seconds for the entrance animation. */
  delay?: number;
  /** Disables the mount animation when the panel is inside another animator. */
  animate?: boolean;
}

/**
 * Frosted island-glass surface used by every dashboard panel and the modal.
 * Animates up into place on mount unless disabled.
 */
export function Panel({
  children,
  className,
  variant = "glass",
  delay = 0,
  animate = true,
}: PanelProps) {
  return (
    <motion.section
      initial={animate ? { opacity: 0, y: 18 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1], delay }}
      className={cn(
        "rounded-3xl shadow-panel",
        variant === "glass" ? "glass-panel" : "glass-panel-tinted",
        className,
      )}
    >
      {children}
    </motion.section>
  );
}

interface PanelHeaderProps {
  icon?: ReactNode;
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  className?: string;
}

/** Standard header row for a Panel: icon, title, optional subtitle and actions. */
export function PanelHeader({
  icon,
  title,
  subtitle,
  actions,
  className,
}: PanelHeaderProps) {
  return (
    <div
      className={cn(
        "flex items-start justify-between gap-3 border-b border-ocean-100/70 px-5 py-4",
        className,
      )}
    >
      <div className="flex items-start gap-3">
        {icon ? (
          <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-ocean-50 text-ocean-600 ring-1 ring-ocean-100">
            {icon}
          </span>
        ) : null}
        <div>
          <h2 className="text-sm font-semibold tracking-tight text-ocean-800">
            {title}
          </h2>
          {subtitle ? (
            <p className="mt-0.5 text-xs leading-snug text-ocean-600/80">
              {subtitle}
            </p>
          ) : null}
        </div>
      </div>
      {actions ? <div className="shrink-0">{actions}</div> : null}
    </div>
  );
}
