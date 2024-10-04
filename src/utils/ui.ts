import { twMerge } from "tailwind-merge";
import { type ClassValue, clsx } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getMedal(number: number) {
  switch (number) {
    case 1:
      return "🥇 ";
    case 2:
      return "🥈 ";
    case 3:
      return "🥉 ";
    default:
      return number;
  }
}

export function formatNumber(number: number) {
  return Intl.NumberFormat("en-US", {
    style: "decimal",
    useGrouping: true,
    notation: "compact",
    compactDisplay: "short",
  }).format(number);
}
