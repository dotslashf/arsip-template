"use client";

import { useEffect, useRef } from "react";
import { cn } from "~/utils";

interface ShinyBadgeProps {
  children: React.ReactNode;
  delay: number;
  isShining: boolean;
}
export default function ShinyBadge({
  children,
  delay,
  isShining,
}: ShinyBadgeProps) {
  const badgeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const badge = badgeRef.current;
    if (!badge) return;

    let start: number | null = null;
    let animationFrameId: number;

    const animate = (timestamp: number) => {
      if (!start) start = timestamp + delay * 1000; // Delay start by the specified amount
      const elapsed = timestamp - start;
      if (elapsed < 0) {
        animationFrameId = requestAnimationFrame(animate);
        return;
      }

      const progress = (elapsed % 1500) / 1500; // 1500ms for one full cycle
      const position = progress * 300 - 100; // Move from -100% to 200%

      badge.style.backgroundPosition = `${position}% 0, 0 0`;

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrameId);
  }, [delay]);

  return (
    <div
      ref={badgeRef}
      className={cn(
        "relative inline-flex select-none items-center overflow-hidden rounded-md border px-4 py-2 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        isShining
          ? "bg-[linear-gradient(45deg,transparent_25%,rgba(68,68,68,.2)_50%,transparent_75%,transparent_100%)] bg-[length:350%_350%,100%_100%] bg-no-repeat dark:bg-[linear-gradient(45deg,transparent_25%,rgba(216,216,216,.2)_50%,transparent_75%,transparent_100%)]"
          : "border-transparent bg-secondary/80 text-secondary-foreground/60",
      )}
    >
      {children}
    </div>
  );
}
