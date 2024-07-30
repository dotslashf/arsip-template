import { type ClassValue, clsx } from "clsx";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDateToHuman(date: Date, formatString = "PPP") {
  return format(date, formatString, { locale: id });
}
