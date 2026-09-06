"use client";

import { motion, useReducedMotion } from "framer-motion";

import ProtectedImage from "@/components/ProtectedImage";
import { formatDate } from "@/lib/dates";
import type { TimelineMilestone } from "@/types/anniversary";

interface MemoryTimelineProps {
  items: TimelineMilestone[];
}

/**
 * Vertical, mobile-first memory timeline.
 *
 * A single soft line runs down the left (center on desktop). Each
 * milestone fades in and slides from the opposite side as it scrolls
 * into view. A glowing dot marks the point on the line.
 */
export default function MemoryTimeline({ items }: MemoryTimelineProps) {
  const reduceMotion = useReducedMotion();

  return (
    <div className="relative mx-auto max-w-2xl">
      <div
        aria-hidden
        className="absolute left-4 top-0 h-full w-px bg-accent/20 sm:left-1/2 sm:-translate-x-1/2"
      />

      <ol className="flex flex-col gap-10">
        {items.map((item, index) => (
          <TimelineRow
            key={`${item.date}-${index}`}
            item={item}
            index={index}
            reduceMotion={Boolean(reduceMotion)}
          />
        ))}
      </ol>
    </div>
  );
}

function TimelineRow({
  item,
  index,
  reduceMotion,
}: {
  item: TimelineMilestone;
  index: number;
  reduceMotion: boolean;
}) {
  const fromLeft = index % 2 === 0;

  return (
    <li className="relative">
      {/* Dot on the line */}
      <span
        aria-hidden
        className="absolute left-4 top-2 z-10 h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-accent shadow-[0_0_0_4px_var(--background),0_0_12px_var(--accent)] sm:left-1/2"
      />

      <motion.div
        initial={reduceMotion ? false : { opacity: 0, x: fromLeft ? -24 : 24 }}
        whileInView={reduceMotion ? undefined : { opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={`pl-10 sm:pl-0 sm:w-[calc(50%-2.5rem)] ${
          fromLeft ? "sm:mr-auto" : "sm:ml-auto"
        }`}
      >
        <article className="flex flex-col gap-3 rounded-2xl bg-surface p-5 shadow-sm ring-1 ring-accent/10">
          <time
            dateTime={item.date}
            className="text-xs tracking-[0.2em] uppercase text-accent"
          >
            {formatDate(item.date)}
          </time>

          <h3 className="font-serif text-2xl leading-snug text-foreground">
            {item.title}
          </h3>

          {item.imagePublicId ? (
            <ProtectedImage
              publicId={item.imagePublicId}
              alt={`${item.title} — ${item.description}`}
              sizes="(max-width: 640px) 100vw, 640px"
            />
          ) : null}

          <p className="text-sm leading-relaxed text-muted">{item.description}</p>
        </article>
      </motion.div>
    </li>
  );
}