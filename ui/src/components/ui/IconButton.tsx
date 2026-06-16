import type { ButtonHTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/utils";

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  children: ReactNode;
  variant?: "solid" | "ghost";
}

/** Square icon-only button with an accessible label. */
export function IconButton({
  label,
  children,
  variant = "ghost",
  className,
  type = "button",
  ...props
}: IconButtonProps) {
  return (
    <button
      type={type}
      aria-label={label}
      title={label}
      className={cn(
        "inline-flex h-9 w-9 items-center justify-center rounded-full transition-all",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-ocean-300 active:scale-95",
        variant === "solid"
          ? "bg-ocean-500 text-white hover:bg-ocean-600"
          : "bg-white/70 text-ocean-600 ring-1 ring-ocean-100 hover:bg-white",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
