"use client";

import Image from "next/image";
import { useReducedMotion } from "framer-motion";
import { motion } from "framer-motion";

import { useSignedMediaUrl } from "@/lib/media-url";

interface ProtectedImageProps {
  /** Cloudinary public ID of an authenticated image, e.g. "relationship/photos/memory-01" */
  publicId: string;
  alt: string;
  aspectClassName?: string;
  sizes?: string;
  priority?: boolean;
  rounded?: boolean;
}

/**
 * Renders an image from the private Cloudinary account (authenticated
 * delivery type).
 *
 * Fetches a signed delivery URL from /api/media, shows a gentle
 * placeholder while it loads, then renders the optimized <Image>.
 * Fades in on load; fades out gracefully on failure.
 */
export default function ProtectedImage({
  publicId,
  alt,
  aspectClassName = "aspect-video",
  sizes = "(max-width: 640px) 100vw, 640px",
  priority = false,
  rounded = true,
}: ProtectedImageProps) {
  const url = useSignedMediaUrl(publicId);
  const reduceMotion = useReducedMotion();

  const frameClass = `${aspectClassName} relative w-full overflow-hidden bg-accent/5 ${
    rounded ? "rounded-xl" : ""
  }`;

  return (
    <div className={frameClass}>
      <Image
        src={url ?? "/placeholders/heart.svg"}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className={`object-cover ${
          url ? "opacity-100" : "opacity-0"
        } transition-opacity duration-500`}
      />
      {!url && !reduceMotion && (
        <motion.div
          aria-hidden
          className="absolute inset-0"
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="absolute inset-x-0 bottom-0 h-full bg-gradient-to-t from-accent/10 to-transparent" />
        </motion.div>
      )}
    </div>
  );
}