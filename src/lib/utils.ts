import { type ClassValue, clsx } from "clsx";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function trimContent(text: string) {
  return `${text.slice(0, 255)}...`;
}

export function formatDateToHuman(date: Date, formatString = "PPP") {
  return format(date, formatString, { locale: id });
}
