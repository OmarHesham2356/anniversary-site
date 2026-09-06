import type { AnniversaryData } from "@/types/anniversary";

import { anniversaryData } from "@/config/anniversaryData";

/**
 * PRIVATE data access.
 *
 * `config/anniversaryData.ts` is gitignored and holds your real content
 * (names, dates, captions, letter text). On a fresh clone, create it
 * from the example before building:
 *
 *   cp config/anniversaryData.example.ts config/anniversaryData.ts
 *
 * This is the same workflow as `.env.example` -> `.env.local`, and it
 * keeps personal content out of GitHub.
 */
export { anniversaryData };
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