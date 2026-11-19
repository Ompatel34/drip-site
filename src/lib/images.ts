import { imageData, type UnsplashImage } from "@/lib/image-data"

/*
 * Image keys:
 *   product:<product-id>   one per product
 *   category:<slug>        women, men, unisex, accessories (homepage tiles)
 *   story:fabric           How Drip makes clothes
 *   story:workshop         About
 */
export const getImage = (key: string): UnsplashImage | undefined => imageData[key]

export const allImages = () => Object.entries(imageData).map(([key, img]) => ({ key, ...img }))

/**
 * next/image loader for Unsplash: asks images.unsplash.com for the exact width
 * the browser needs (Unsplash serves and resizes its own images).
 */
export function unsplashLoader({ src, width, quality }: { src: string; width: number; quality?: number }) {
  const url = new URL(src)
  url.searchParams.set("w", String(width))
  url.searchParams.set("q", String(quality ?? 70))
  url.searchParams.set("auto", "format")
  url.searchParams.set("fit", "max")
  return url.toString()
}
