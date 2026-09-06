"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

interface SectionProps {
  children: ReactNode;
  className?: string;
  id?: string;
}

/**
 * A scroll-revealed page section. Fades IN and slides up slightly when
 * it enters the viewport. Disabled under prefers-reduced-motion so
 * content never vanishes and reappears for those users.
 */
export default function Section({ children, className = "", id }: SectionProps) {
  const reduceMotion = useReducedMotion();

  return (
    <section
      id={id}
      className={`w-full px-6 py-16 sm:px-8 sm:py-24 ${className}`}
    >
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 24 }}
        whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {children}
      </motion.div>
    </section>
  );
}