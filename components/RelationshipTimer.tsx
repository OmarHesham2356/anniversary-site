"use client";

import { useEffect, useState } from "react";

import { elapsedSince, padTwo, type TimeParts } from "@/lib/dates";

interface RelationshipTimerProps {
  startDate: string;
}

const PLACEHOLDER: TimeParts = { days: 0, hours: 0, minutes: 0, seconds: 0 };

function Unit({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex min-w-[64px] flex-col items-center gap-1">
      <span
        className="font-serif text-3xl tabular-nums text-foreground sm:text-4xl"
        aria-label={`${label}: ${value}`}
      >
        {value}
      </span>
      <span className="text-[0.65rem] tracking-[0.2em] uppercase text-muted">
        {label}
      </span>
    </div>
  );
}

/**
 * Live relationship timer. Reads the elapsed time from the configured
 * start date and ticks every second.
 *
 * Hydration-safe: renders zeroed placeholders initially (server and
 * first client render match), then fills real values in an effect so
 * there is no mismatch between SSR and the client.
 */
export default function RelationshipTimer({ startDate }: RelationshipTimerProps) {
  const [elapsed, setElapsed] = useState<TimeParts>(PLACEHOLDER);

  useEffect(() => {
    const update = () => setElapsed(elapsedSince(startDate, new Date()));

    // Immediate first tick (deferred so the lint rule allows it),
    // then keep ticking every second. Clearing both timers on
    // unmount prevents leaks.
    const tick = window.setTimeout(update, 0);
    const id = window.setInterval(update, 1000);

    return () => {
      window.clearTimeout(tick);
      window.clearInterval(id);
    };
  }, [startDate]);

  return (
    <div className="flex items-center gap-2 sm:gap-4" role="timer">
      <Unit value={String(elapsed.days)} label="Days" />
      <Separator />
      <Unit value={padTwo(elapsed.hours)} label="Hours" />
      <Separator />
      <Unit value={padTwo(elapsed.minutes)} label="Minutes" />
      <Separator />
      <Unit value={padTwo(elapsed.seconds)} label="Seconds" />
    </div>
  );
}

function Separator() {
  return (
    <span aria-hidden className="pb-6 text-xl text-accent-soft">
      :
    </span>
  );
}