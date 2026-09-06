import { NextResponse } from "next/server";

import { anniversaryData } from "@/lib/anniversary-data";
import {
  createSignedMediaUrl,
  isAllowedMediaPublicId,
  isCloudinaryConfigured,
  type MediaResourceType,
} from "@/lib/cloudinary";

/** Allow the signed-URL response to be cached briefly on the CDN. */
const CACHE_CONTROL = "public, max-age=300";

/**
 * Returns a signed delivery URL for an authenticated Cloudinary asset.
 *
 * Security model (layered):
 * 1. The handler runs server-side; the Cloudinary API secret never
 *    reaches the browser.
 * 2. The requested public ID must pass a structural check (no traversal,
 *    no absolute paths, no query fragments).
 * 3. The public ID must also be one of the IDs declared in
 *    `config/anniversaryData.ts` (gallery, timeline, music).
 * 4. The browser receives only a signed delivery URL; the media stays
 *    `authenticated` (never publicly enumerable).
 */
export async function GET(request: Request) {
  if (!isCloudinaryConfigured) {
    return NextResponse.json(
      { error: "Cloudinary is not configured." },
      { status: 503 },
    );
  }

  const { searchParams } = new URL(request.url);
  const publicId = searchParams.get("publicId");

  if (!publicId) {
    return NextResponse.json(
      { error: "Missing 'publicId' query param." },
      { status: 400 },
    );
  }

  if (!isAllowedMediaPublicId(publicId)) {
    return NextResponse.json({ error: "Invalid public ID." }, { status: 400 });
  }

  if (!allowedMediaPublicIds().has(publicId)) {
    return NextResponse.json(
      { error: "Public ID not allowed." },
      { status: 403 },
    );
  }

  const resourceType = resourceTypeFor(publicId);
  const url = await createSignedMediaUrl(publicId, resourceType);

  if (!url) {
    return NextResponse.json(
      { error: "Media not found or unavailable." },
      { status: 404 },
    );
  }

  return NextResponse.json(
    { url, resourceType },
    { headers: { "cache-control": CACHE_CONTROL } },
  );
}

/**
 * Maps a public ID to its Cloudinary resource type. Photos use
 * `image`; the anniversary song under `audio/` uses `video`
 * (Cloudinary treats MP3s as the video resource type).
 */
function resourceTypeFor(publicId: string): MediaResourceType {
  return publicId.startsWith("relationship/audio/") ? "video" : "image";
}

/**
 * Builds the set of media public IDs referenced by the configuration.
 * This is the only set of IDs this endpoint will ever sign.
 */
function allowedMediaPublicIds(): Set<string> {
  const ids = new Set<string>();

  for (const item of anniversaryData.gallery) {
    ids.add(item.publicId);
  }

  for (const milestone of anniversaryData.timeline) {
    if (milestone.imagePublicId) ids.add(milestone.imagePublicId);
  }

  if (anniversaryData.music.publicId) {
    ids.add(anniversaryData.music.publicId);
  }

  return ids;
}