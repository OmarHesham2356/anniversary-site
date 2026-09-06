"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Heart } from "lucide-react";

import type { LetterConfig } from "@/types/anniversary";

interface LoveEnvelopeProps {
  letter: LetterConfig;
  /** Hint shown under the sealed envelope, e.g. "Tap to open" */
  tapToOpen?: string;
}

/**
 * Interactive digital love letter.
 *
 * A sealed envelope that, when tapped, cradles the paper as it rises
 * out and expands into a readable letter. Paragraphs stagger in one by
 * one. Uses only Framer Motion — no extra dependencies.
 */
export default function LoveEnvelope({
  letter,
  tapToOpen = "Tap to open",
}: LoveEnvelopeProps) {
  const [open, setOpen] = useState(false);
  const reduceMotion = useReducedMotion();

  return (
    <div className="mx-auto w-full max-w-md">
      <AnimatePresence mode="wait" initial={false}>
        {!open ? (
          <motion.button
            key="envelope"
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Open the letter"
            className="group relative block w-full cursor-pointer select-none rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4 focus-visible:ring-offset-background"
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.98 }}
            exit={reduceMotion ? undefined : { opacity: 0, scale: 0.92, y: 10 }}
            transition={{ type: "spring", stiffness: 300, damping: 22 }}
          >
            <EnvelopeSealed />
            <p className="mt-6 text-center text-xs tracking-[0.25em] uppercase text-muted">
              {tapToOpen}
            </p>
          </motion.button>
        ) : (
          <motion.div
            key="letter"
            initial={reduceMotion ? false : { opacity: 0, y: 40, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 220, damping: 24 }}
            className="relative"
          >
            <LetterPaper letter={letter} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/** Draws the closed envelope with layered paper shapes. */
function EnvelopeSealed() {
  return (
    <div
      aria-hidden
      className="relative mx-auto aspect-[8/5] w-full overflow-hidden rounded-2xl shadow-xl ring-1 ring-accent/10"
    >
      {/* Back of envelope */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent-soft to-accent" />

      {/* Letter paper peeking behind the flap */}
      <div className="absolute inset-x-[8%] bottom-[6%] top-[14%] rounded-sm bg-surface shadow-md" />

      {/* Envelope front bottom (pocket) */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-x-0 bottom-0 h-[58%] bg-gradient-to-b from-accent-soft to-accent"
          style={{
            clipPath:
              "polygon(0 0, 15% 38%, 50% 66%, 85% 38%, 100% 0, 100% 100%, 0 100%)",
          }}
        />
      </div>

      {/* Flap */}
      <div
        className="absolute inset-x-0 top-0 h-[60%] origin-top bg-gradient-to-b from-accent to-accent-soft transition-transform duration-500 ease-out group-hover:-rotate-[3deg]"
        style={{ clipPath: "polygon(0 0, 100% 0, 84% 62%, 50% 92%, 16% 62%)" }}
      />

      {/* Seal */}
      <div className="absolute left-1/2 top-[54%] flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-gradient-to-br from-accent to-accent-soft shadow-lg ring-2 ring-background/30">
        <Heart className="h-5 w-5 text-background" fill="currentColor" />
      </div>
    </div>
  );
}

function LetterPaper({ letter }: { letter: LetterConfig }) {
  const reduceMotion = useReducedMotion();

  return (
    <article className="overflow-hidden rounded-2xl bg-surface p-6 shadow-xl ring-1 ring-accent/10 sm:p-8">
      <div className="flow-root">
        <div className="flex flex-col gap-4 sm:gap-5">
          <motion.h3
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: reduceMotion ? 0 : 0.2, duration: 0.5 }}
            className="font-serif text-2xl text-accent sm:text-3xl"
          >
            {letter.greeting},
          </motion.h3>

          {letter.paragraphs.map((paragraph, index) => (
            <motion.p
              key={index}
              initial={reduceMotion ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: reduceMotion ? 0 : 0.35 + index * 0.22,
                duration: 0.5,
                ease: "easeOut",
              }}
              className="text-[0.95rem] leading-relaxed text-foreground/90 sm:text-base"
            >
              {paragraph}
            </motion.p>
          ))}

          {letter.signature ? (
            <motion.p
              initial={reduceMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: reduceMotion ? 0 : 0.35 + letter.paragraphs.length * 0.22 + 0.15 }}
              className="mt-2 font-serif text-lg italic text-accent"
            >
              {letter.signature}
            </motion.p>
          ) : null}
        </div>
      </div>
    </article>
  );
}