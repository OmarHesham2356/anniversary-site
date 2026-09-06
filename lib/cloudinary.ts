import "server-only";

import { v2 as cloudinary } from "cloudinary";

/**
 * Private Cloudinary configuration for personal anniversary media.
 *
 * Personal assets use the `authenticated` delivery type, NOT the default
 * public `upload` type. Authenticated assets (and their derived versions)
 * can only be fetched with a valid signed delivery URL, so the media never
 * becomes publicly enumerable.
 *
 * This module is guarded by `server-only` — it can never be imported from
 * a Client Component, and the API secret never reaches the browser.
 */
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

/** True when all Cloudinary credentials are present. */
export const isCloudinaryConfigured = Boolean(
  process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET,
);

export type MediaResourceType = "image" | "video";

/**
 * Caches the Cloudinary version of each asset so the signed URL stays
 * stable across requests without re-querying the Admin API each time.
 */
const resourceVersionCache = new Map<string, string>();

/**
 * Resolves the current version of an authenticated asset. Authenticated
 * delivery URLs must reference a concrete version (or include a file
 * extension); a bare `/authenticated/<publicId>` URL returns 404, so the
 * version is looked up from the account before signing.
 */
async function resolveResourceVersion(
  publicId: string,
  resourceType: MediaResourceType,
): Promise<string | null> {
  const cached = resourceVersionCache.get(publicId);
  if (cached) return cached;

  try {
    const resource = await cloudinary.api.resource(publicId, {
      resource_type: resourceType,
      type: "authenticated",
    });
    const version = String(resource.version);
    resourceVersionCache.set(publicId, version);
    return version;
  } catch (error) {
    console.error("[media] failed to resolve version for", publicId, error);
    return null;
  }
}

/**
 * Creates a signed delivery URL for an authenticated asset.
 *
 * Cloudinary signs the URL server-side (the `s--...--` token embedded in
 * the path) so the API secret is never shared with the browser. Uses the
 * official Cloudinary SDK — no hand-rolled signing algorithm.
 *
 * Returns null on any failure so callers can fall back gracefully.
 */
export async function createSignedMediaUrl(
  publicId: string,
  resourceType: MediaResourceType,
): Promise<string | null> {
  if (!isCloudinaryConfigured) return null;

  const version = await resolveResourceVersion(publicId, resourceType);
  if (version === null) return null;

  try {
    return cloudinary.url(publicId, {
      resource_type: resourceType,
      type: "authenticated",
      version,
      sign_url: true,
    });
  } catch (error) {
    console.error("[media] failed to sign delivery URL for", publicId, error);
    return null;
  }
}

/**
 * Validates that a requested public ID is safe to sign:
 * - must not attempt path traversal (`..`)
 * - must not be an absolute path, contain backslashes, or query fragments
 * - must only contain safe public-ID characters
 *
 * This is a structural guard only. The real authorization gate is the
 * whitelist of public IDs declared in `config/anniversaryData.ts`
 * (enforced in the /api/media route), so regardless of folder/layout the
 * only assets this endpoint will ever sign are the personal ones listed
 * in the private config.
 */
export function isAllowedMediaPublicId(publicId: string): boolean {
  if (
    typeof publicId !== "string" ||
    publicId.length === 0 ||
    publicId.length > 255
  ) {
    return false;
  }

  if (publicId.startsWith("/") || publicId.includes("\\")) return false;
  if (publicId.includes("..")) return false;
  if (publicId.includes("?") || publicId.includes("#")) return false;

  return true;
}