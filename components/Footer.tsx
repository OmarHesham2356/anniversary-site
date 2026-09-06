import { Heart } from "lucide-react";

interface FooterProps {
  personOne: string;
  personTwo: string;
  /** Optional one-liner under the couple names, e.g. "Made with love, for us." */
  line?: string;
}

export default function Footer({ personOne, personTwo, line }: FooterProps) {
  return (
    <footer className="px-6 pb-12 pt-8 text-center">
      <p className="flex items-center justify-center gap-2 text-sm text-muted">
        {personOne}
        <Heart aria-hidden className="h-3 w-3 text-accent-soft" fill="currentColor" />
        {personTwo}
      </p>
      {line ? (
        <p className="mt-1 text-xs tracking-wide text-muted">{line}</p>
      ) : null}
    </footer>
  );
}