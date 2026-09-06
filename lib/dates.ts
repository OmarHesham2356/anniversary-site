const DAY_MS = 86_400_000;
const HOUR_MS = 3_600_000;
const MINUTE_MS = 60_000;

export interface TimeParts {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

/**
 * Returns the elapsed time since a given ISO date, broken into
 * days/hours/minutes/seconds.
 */
export function elapsedSince(startDateIso: string, now: Date): TimeParts {
  const start = new Date(startDateIso).getTime();
  const current = now.getTime();
  const diff = Math.max(0, current - start);

  return {
    days: Math.floor(diff / DAY_MS),
    hours: Math.floor((diff % DAY_MS) / HOUR_MS),
    minutes: Math.floor((diff % HOUR_MS) / MINUTE_MS),
    seconds: Math.floor((diff % MINUTE_MS) / 1000),
  };
}

/**
 * Formats an ISO date as a human-friendly date, e.g. "February 14, 2020".
 */
export function formatDate(isoDate: string): string {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return isoDate;

  return new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

/** Pads a number to two digits, e.g. 5 -> "05". */
export function padTwo(value: number): string {
  return String(value).padStart(2, "0");
}