"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

import ProtectedImage from "@/components/ProtectedImage";
import type { GalleryItem } from "@/types/anniversary";

interface PhotoGalleryProps {
  items: GalleryItem[];
}

type Direction = 1 | -1;

const variants = {
  enter: (direction: Direction) => ({
    x: direction > 0 ? 80 : -80,
    opacity: 0,
    scale: 0.98,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
  },
  exit: (direction: Direction) => ({
    x: direction > 0 ? -80 : 80,
    opacity: 0,
    scale: 0.98,
  }),
};

/**
 * Swipeable, mobile-first photo gallery.
 *
 * Touch and mouse drags advance between photos and snap back otherwise.
 * Arrow buttons and arrow keys work on desktop; dots show position and
 * allow jumping. Each photo loads through the private-bucket signed URL
 * and next/image.
 */
export default function PhotoGallery({ items }: PhotoGalleryProps) {
  const [[index, direction], setState] = useState<[number, Direction]>([0, 1]);
  const reduceMotion = useReducedMotion();
  const total = items.length;

  const goTo = useCallback(
    (next: number) => {
      const clamped = ((next % total) + total) % total;
      const dir: Direction = next > index ? 1 : -1;
      setState([clamped, dir]);
    },
    [total, index],
  );

  const next = useCallback(() => goTo(index + 1), [goTo, index]);
  const prev = useCallback(() => goTo(index - 1), [goTo, index]);

  useEffect(() => {
    const onKeydown = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") next();
      else if (event.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKeydown);
    return () => window.removeEventListener("keydown", onKeydown);
  }, [next, prev]);

  if (total === 0) return null;

  const item = items[index];
  const handleDragEnd = (
    _: MouseEvent | TouchEvent | PointerEvent,
    info: { offset: { x: number }; velocity: { x: number } },
  ) => {
    const swipe = Math.abs(info.offset.x) > 56 || Math.abs(info.velocity.x) > 400;
    if (!swipe) return;
    if (info.offset.x < 0) next();
    else prev();
  };

  return (
    <div className="mx-auto w-full max-w-lg">
      <div className="relative">
        <AnimatePresence custom={direction} initial={false} mode="popLayout">
          <motion.div
            key={index}
            custom={direction}
            variants={reduceMotion ? undefined : variants}
            initial={reduceMotion ? false : "enter"}
            animate={reduceMotion ? undefined : "center"}
            exit={reduceMotion ? undefined : "exit"}
            transition={{ type: "spring", stiffness: 380, damping: 32 }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.6}
            dragDirectionLock
            onDragEnd={handleDragEnd}
            className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-accent/5 shadow-lg ring-1 ring-accent/10 sm:aspect-[3/4]"
          >
            <ProtectedImage
              publicId={item.publicId}
              alt={item.caption ?? "Memory"}
              aspectClassName="h-full w-full"
              sizes="(max-width: 640px) 100vw, 640px"
              rounded={false}
            />
          </motion.div>
        </AnimatePresence>

        <GalleryButton
          direction="prev"
          onClick={prev}
          label="Previous photo"
          disabled={total === 1}
        />
        <GalleryButton
          direction="next"
          onClick={next}
          label="Next photo"
          disabled={total === 1}
        />
      </div>

      <div className="mt-4 flex flex-col items-center gap-3">
        {item.caption ? (
          <p className="text-center font-serif text-lg text-foreground">
            {item.caption}
          </p>
        ) : null}

        <div className="flex items-center justify-center gap-2">
          {items.map((photo, dotIndex) => (
            <button
              key={`${photo.publicId}-${dotIndex}`}
              type="button"
              aria-label={`Go to photo ${dotIndex + 1}`}
              aria-current={dotIndex === index ? "true" : undefined}
              onClick={() => goTo(dotIndex)}
              className="flex h-8 w-8 items-center justify-center rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <span
                className={`block h-2 rounded-full transition-all duration-300 ${
                  dotIndex === index
                    ? "w-6 bg-accent"
                    : "w-2 bg-accent/30 hover:bg-accent/50"
                }`}
              />
            </button>
          ))}
        </div>

        <p className="text-xs text-muted">
          {index + 1} / {total} · swipe or use arrows
        </p>
      </div>
    </div>
  );
}

function GalleryButton({
  direction,
  onClick,
  label,
  disabled,
}: {
  direction: "prev" | "next";
  onClick: () => void;
  label: string;
  disabled?: boolean;
}) {
  const Icon = direction === "prev" ? ChevronLeft : ChevronRight;
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className={`absolute top-1/2 z-10 -translate-y-1/2 rounded-full bg-background/70 p-2 text-foreground shadow-md backdrop-blur transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 disabled:opacity-0 ${
        direction === "prev" ? "left-3" : "right-3"
      }`}
    >
      <Icon className="h-5 w-5" />
    </button>
  );
}