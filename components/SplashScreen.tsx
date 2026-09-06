"use client";

import { Heart } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

interface SplashScreenProps {
  personOne: string;
  personTwo: string;
  subtitle?: string;
  startLabel?: string;
  soundHint?: string;
  onStart: () => void;
}

const PARTICLES = [
  { top: "18%", left: "18%", size: 6, delay: 0, duration: 8 },
  { top: "70%", left: "14%", size: 8, delay: 1.5, duration: 9 },
  { top: "24%", left: "78%", size: 7, delay: 0.8, duration: 7.5 },
  { top: "76%", left: "82%", size: 6, delay: 2.2, duration: 8.5 },
  { top: "10%", left: "48%", size: 5, delay: 3, duration: 10 },
  { top: "60%", left: "52%", size: 7, delay: 1, duration: 9.5 },
  { top: "38%", left: "92%", size: 5, delay: 2.8, duration: 8 },
  { top: "86%", left: "40%", size: 6, delay: 4, duration: 9 },
];

/**
 * Full-screen opening experience. The heart tap:
 *   1. marks the experience as started,
 *   2. kicks off audio playback via `onStart` (same gesture -> passes
 *      mobile autoplay restrictions),
 *   3. then this overlay fades out revealing the main site.
 */
export default function SplashScreen({
  personOne,
  personTwo,
  subtitle = "Tap the heart to begin",
  startLabel = "Tap to begin our story",
  soundHint = "with sound on",
  onStart,
}: SplashScreenProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-10 bg-background px-6 text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.08 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        {reduceMotion
          ? null
          : PARTICLES.map((particle, index) => (
              <motion.span
                key={index}
                className="absolute rounded-full bg-accent-soft/40"
                style={{ width: particle.size, height: particle.size, top: particle.top, left: particle.left }}
                animate={{ y: [0, -60], opacity: [0.2, 0.9, 0.2] }}
                transition={{
                  duration: particle.duration,
                  delay: particle.delay,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            ))}
      </div>

      <p
        aria-hidden
        className="relative px-4 text-sm tracking-[0.3em] uppercase text-muted"
      >
        {personOne} &amp; {personTwo}
      </p>

      <motion.button
        type="button"
        onClick={onStart}
        aria-label={startLabel}
        className="group relative flex h-36 w-36 items-center justify-center rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4 focus-visible:ring-offset-background"
        whileTap={{ scale: 0.92 }}
      >
        <motion.span
          aria-hidden
          className="absolute inset-0 rounded-full border border-accent/30"
          animate={reduceMotion ? undefined : { scale: [1, 1.35], opacity: [0.8, 0] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeOut" }}
        />

        <motion.span
          aria-hidden
          className="absolute inset-6 rounded-full bg-gradient-to-br from-accent-soft to-accent shadow-xl shadow-accent/40"
          animate={reduceMotion ? undefined : { scale: [1, 1.06, 1] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        />

        <Heart
          aria-hidden
          className="relative h-14 w-14 text-background transition-transform duration-300 group-hover:scale-110"
          fill="currentColor"
        />
      </motion.button>

      <p className="relative font-serif text-2xl text-foreground">{subtitle}</p>
      <p aria-hidden className="relative text-xs tracking-wider text-muted">
        {soundHint}
      </p>
    </motion.div>
  );
}