"use client";

import { type ExclusiveBadgeType } from "@prisma/client";
import { Award, Heart, type LucideIcon, UserPen, Zap } from "lucide-react";
import React, { useEffect, useRef } from "react";
import { cn } from "~/utils";

interface ShinyBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  delay: number;
  type: ExclusiveBadgeType;
}

const ExclusiveShinyBadge: React.FC<ShinyBadgeProps> = ({
  children,
  className,
  delay,
  type,
  ...props
}) => {
  const badgeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const badge = badgeRef.current;
    if (!badge) return;

    let start: number | null = null;
    let animationFrameId: number;

    const animate = (timestamp: number) => {
      if (!start) start = timestamp + delay * 1000;
      const elapsed = timestamp - start;
      if (elapsed < 0) {
        animationFrameId = requestAnimationFrame(animate);
        return;
      }

      const progress = (elapsed % 1500) / 1500;
      const position = progress * 300 - 100;

      badge.style.backgroundPosition = `${position}% 0, 0 0`;

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrameId);
  }, [delay, type]);

  const getBadgeStyles = (): {
    containerClass: string;
    badgeClass: string;
    icon: LucideIcon;
  } => {
    switch (type) {
      case "Admin":
        return {
          containerClass:
            "before:bg-[linear-gradient(90deg,#C0C0C0,#38BDF8,#3b82f6,#38BDF8,#C0C0C0)]",
          badgeClass:
            "border-[#38BDF8] text-sky-100 bg-[linear-gradient(45deg,transparent_25%,rgba(225,225,225,0.45)_50%,rgba(56,189,248,0.5)_75%,transparent_100%),linear-gradient(to_right,#38BDF8,#3b82f6)]",
          icon: UserPen,
        };
      case "SuperAdmin":
        return {
          containerClass:
            "before:bg-[linear-gradient(90deg,#1e40af,#1e40af,#312e81,#1e40af,#1e40af)]",
          badgeClass:
            "border-[#1e40af] text-indigo-100 bg-[linear-gradient(45deg,transparent_25%,rgba(225,225,225,0.45)_50%,rgba(30,64,175,0.5)_75%,transparent_100%),linear-gradient(to_right,#1e40af,#312e81)]",
          icon: Zap,
        };
      case "Donatur":
        return {
          containerClass:
            "before:bg-[linear-gradient(90deg,#FFD700,#FFA500,#B8860B,#FFA500,#FFD700)]",
          badgeClass:
            "animate-gold-shine bg-[linear-gradient(45deg,transparent_25%,rgba(255,215,0,0.8)_50%,rgba(255,140,0,0.65)_75%,transparent_100%),linear-gradient(to_right,#FFD700,#FFA500)] bg-[length:350%_350%,100%_100%] bg-no-repeat border-[#FFD700] text-[#8B4513]",
          icon: Award,
        };
      case "Supporter":
        return {
          containerClass:
            "before:bg-[linear-gradient(90deg,#FF1493,#FF69B4,#FF4500,#FF69B4,#FF1493)]",
          badgeClass:
            "animate-gold-shine bg-[linear-gradient(45deg,transparent_25%,rgba(255,20,147,0.8)_50%,rgba(190,24,93,0.6)_75%,transparent_100%),linear-gradient(to_right,#FF1493,#FF69B4)] bg-[length:350%_350%,100%_100%] bg-no-repeat border-[#FF1493] text-rose-200",
          icon: Heart,
        };
    }
  };

  const { containerClass, badgeClass, icon: Icon } = getBadgeStyles();

  return (
    <div
      className={cn(
        "group relative inline-flex cursor-pointer items-center justify-center rounded-md bg-[length:150%] text-sm font-medium transition-colors",
        "[background-clip:padding-box,border-box,border-box] [background-origin:border-box]",
        "[border:calc(0*1rem)_solid_transparent]",
        "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
        "disabled:pointer-events-none disabled:opacity-50",
        "before:absolute before:left-1/2 before:z-0 before:h-3/5 before:w-full",
        "before:-translate-x-1/2",
        "before:bg-[length:200%] before:[filter:blur(calc(0.8*1rem))]",
        "dark:bg-[linear-gradient(#121213,#121213),linear-gradient(#121213_50%,rgba(18,18,19,0.6)_80%,rgba(18,18,19,0)),linear-gradient(90deg,#FF1493,#FF69B4,#FF4500,#FF69B4,#FF1493)]",
        "bg-[linear-gradient(#fff,#fff),linear-gradient(#fff_50%,rgba(255,255,255,0.6)_80%,rgba(0,0,0,0)),linear-gradient(90deg,#FF1493,#FF69B4,#FF4500,#FF69B4,#FF1493)]",
        containerClass,
        className,
      )}
      {...props}
    >
      <div
        ref={badgeRef}
        className={cn(
          "relative inline-flex select-none items-center overflow-hidden rounded-sm border px-2 py-1 text-xs font-bold leading-tight transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
          "bg-[length:350%_350%,100%_100%] bg-no-repeat",
          badgeClass,
        )}
      >
        <Icon className="mr-1 h-3 w-3" />
        {children}
      </div>
    </div>
  );
};

export default ExclusiveShinyBadge;
