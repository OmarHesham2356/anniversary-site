import type { AnniversaryData } from "@/types/anniversary";

import { anniversaryData as exampleData } from "@/config/anniversaryData.example";

/**
 * PRIVATE data access.
 *
 * `config/anniversaryData.ts` is gitignored and holds your real content
 * (names, dates, captions, letter text), so a fresh clone — like a Vercel
 * build sourced from GitHub — never receives it and the build must still
 * succeed. Content is resolved in priority order:
 *
 *  1. `ANNIVERSARY_DATA_JSON` env var (secret — set it in Vercel/CI).
 *     The whole config serialized as JSON; never commit it.
 *  2. `config/anniversaryData.ts` on disk (your local private file).
 *  3. `config/anniversaryData.example.ts` (committed placeholder) so the
 *     app never crashes on a fresh clone.
 *
 * The `.env.local`-style workflow still works as before: with the real
 * file present locally, it is used automatically.
 */

/**
 * Loads the private config from `ANNIVERSARY_DATA_JSON` (Vercel/CI).
 * Returns null when unset or unparseable.
 */
function dataFromEnv(): AnniversaryData | null {
  const raw = process.env.ANNIVERSARY_DATA_JSON;
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AnniversaryData;
  } catch (error) {
    console.error(
      "[anniversary-data] ANNIVERSARY_DATA_JSON is not valid JSON; ignoring it.",
      error,
    );
    return null;
  }
}

/**
 * Loads the local gitignored config via dynamic import so a missing file
 * (fresh clone / Vercel) is caught at runtime instead of failing the
 * build or type-check.
 */
async function dataFromLocalFile(): Promise<AnniversaryData | null> {
  try {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore -- module exists only where the private config was set up.
    const mod = await import("@/config/anniversaryData");
    return (
      (mod as { anniversaryData?: AnniversaryData } | undefined)
        ?.anniversaryData ?? null
    );
  } catch {
    return null;
  }
}

export const anniversaryData: AnniversaryData =
  dataFromEnv() ?? (await dataFromLocalFile()) ?? exampleData;

export type { AnniversaryData };

/**
 * Validates a config object in development, warning about common
 * mistakes (empty names, missing captions, unparseable dates) so errors
 * surface while editing config/anniversaryData.ts instead of at runtime.
 */
export function validateAnniversaryData(config: AnniversaryData): void {
  if (process.env.NODE_ENV !== "development") return;

  const warnings: string[] = [];

  if (!config.couple.personOne.trim()) {
    warnings.push("couple.personOne is empty");
  }
  if (!config.couple.personTwo.trim()) {
    warnings.push("couple.personTwo is empty");
  }

  if (Number.isNaN(Date.parse(config.relationship.startDate))) {
    warnings.push(
      `relationship.startDate "${config.relationship.startDate}" is not a valid date`,
    );
  }

  config.timeline.forEach((milestone, index) => {
    if (!milestone.title.trim()) {
      warnings.push(`timeline[${index}].title is empty`);
    }
    if (Number.isNaN(Date.parse(milestone.date))) {
      warnings.push(
        `timeline[${index}].date "${milestone.date}" is not a valid date`,
      );
    }
  });

  config.gallery.forEach((item, index) => {
    if (!item.publicId.trim()) {
      warnings.push(`gallery[${index}].publicId is empty`);
    }
    if (item.publicId.trim() === "YOUR_CLOUDINARY_PUBLIC_ID") {
      warnings.push(
        `gallery[${index}].publicId still uses the template placeholder — replace it with a real Cloudinary public ID`,
      );
    }
  });

  config.timeline.forEach((milestone, index) => {
    if (milestone.imagePublicId?.trim() === "YOUR_CLOUDINARY_PUBLIC_ID") {
      warnings.push(
        `timeline[${index}].imagePublicId still uses the template placeholder — replace it or remove it`,
      );
    }
  });

  if (!config.music.publicId.trim()) {
    warnings.push("music.publicId is empty");
  }
  if (!config.letter.greeting.trim()) {
    warnings.push("letter.greeting is empty");
  }

  if (warnings.length > 0) {
    console.warn("[anniversary-data] config issues:", warnings);
  }
}