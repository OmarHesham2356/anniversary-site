"use client";

import { useEffect, useState } from "react";

interface SignedUrlResponse {
  url?: string;
  error?: string;
}

const urlCache = new Map<string, Promise<string | null>>();

/**
 * Fetches (and caches) the signed delivery URL for a media public ID
 * from the server-side /api/media route. Cached per public ID for the
 * session, so each asset is signed once and reused.
 */
function fetchSignedUrl(publicId: string): Promise<string | null> {
  const cached = urlCache.get(publicId);
  if (cached) return cached;

  const promise = fetch(`/api/media?publicId=${encodeURIComponent(publicId)}`)
    .then(async (res) => {
      if (!res.ok) return null;
      const body = (await res.json()) as SignedUrlResponse;
      return body.url ?? null;
    })
    .catch(() => null);

  urlCache.set(publicId, promise);
  return promise;
}

/**
 * Resolves a config media public ID to a usable signed URL. Returns
 * null until the signed URL arrives (or if Cloudinary is unconfigured).
 */
export function useSignedMediaUrl(publicId?: string | null): string | null {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!publicId) return;

    let active = true;
    void fetchSignedUrl(publicId).then((resolved) => {
      if (active) setUrl(resolved);
    });

    return () => {
      active = false;
    };
  }, [publicId]);

  return url;
}