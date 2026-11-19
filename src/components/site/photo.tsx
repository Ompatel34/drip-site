"use client"

import { useState } from "react"
import Image from "next/image"
import { cn } from "cn"

import { getImage, unsplashLoader } from "@/lib/images"

/*
 * Square-cornered photo slot.
 * - Photo assigned: next/image hotlinks Unsplash at the width each screen needs.
 * - No photo, or it fails to load: a soft block in the product's colour with
 *   its name (the neutral placeholder).
 */
export function Photo({
  imageKey,
  alt,
  hex = "#D8D4CC",
  label,
  sizes,
  preload,
  className,
}: {
  imageKey: string
  /** Empty string for decorative images (e.g. a tile already labelled by text). */
  alt: string
  /** Swatch colour for the placeholder */
  hex?: string
  /** Text shown on the placeholder */
  label?: string
  sizes: string
  preload?: boolean
  className?: string
}) {
  const img = getImage(imageKey)
  const [failed, setFailed] = useState(false)
  const soft = `color-mix(in srgb, ${hex} 32%, #F7F6F3)`
  const showPhoto = img && !failed

  return (
    <div
      className={cn("relative w-full overflow-hidden rounded-none", className)}
      style={{ backgroundColor: showPhoto ? img.color : soft }}
    >
      {showPhoto ? (
        <Image
          loader={unsplashLoader}
          src={img.url}
          alt={alt}
          fill
          sizes={sizes}
          preload={preload}
          onError={() => setFailed(true)}
          className="object-cover"
        />
      ) : (
        <div
          role={alt ? "img" : undefined}
          aria-label={alt || undefined}
          className="absolute inset-0 flex items-end p-4"
          style={{ backgroundColor: soft }}
        >
          {label && (
            <span aria-hidden className="max-w-[16ch] text-sm leading-snug font-medium text-foreground/80">
              {label}
            </span>
          )}
        </div>
      )}
    </div>
  )
}

/** "Photo by [name] on Unsplash" with referral links, as Unsplash requires. */
export function PhotoCredit({ imageKey, className }: { imageKey: string; className?: string }) {
  const img = getImage(imageKey)
  if (!img) return null
  return (
    <p className={cn("text-sm text-muted-foreground", className)}>
      Photo by{" "}
      <a href={img.photographerUrl} className="underline underline-offset-4 hover:text-foreground" rel="noopener">
        {img.photographer}
      </a>{" "}
      on{" "}
      <a href={img.photoUrl} className="underline underline-offset-4 hover:text-foreground" rel="noopener">
        Unsplash
      </a>
    </p>
  )
}
