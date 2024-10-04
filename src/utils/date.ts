import { format, formatDistance, parse } from "date-fns";
import { format as formatTz, toZonedTime } from "date-fns-tz";
import { id } from "date-fns/locale";
import { TIMEZONE } from "../lib/constant";

export function formatDateToHuman(date: Date, formatString = "PPP") {
  return format(date, formatString, { locale: id });
}

export function formatDateDistance(date: Date) {
  return formatDistance(date, new Date(), { locale: id, addSuffix: true });
}

export function parseDate(date: string) {
  return parse(date, "d MMMM yyyy", new Date(), { locale: id });
}

export function getJakartaDate(date: Date = new Date()): Date {
  return toZonedTime(date, TIMEZONE);
}

export function getJakartaDateString(date: Date = new Date()): string {
  return formatTz(getJakartaDate(date), "yyyy-MM-dd", { timeZone: TIMEZONE });
}
