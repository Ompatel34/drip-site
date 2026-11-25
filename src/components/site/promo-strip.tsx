import Link from "next/link"

import { formatPrice } from "@/lib/products"
import { FREE_DELIVERY_THRESHOLD, PROTOTYPE_NOTICE, RETURNS_DAYS } from "@/lib/store"

/** Slim banner at the very top of every page. */
export function PrototypeBanner() {
  return (
    <div role="note" className="border-b border-border bg-surface">
      <p className="page-container flex min-h-9 items-center justify-center py-1.5 text-center text-sm font-medium">
        {PROTOTYPE_NOTICE}
      </p>
    </div>
  )
}

export function PromoStrip() {
  return (
    <div className="on-dark bg-primary text-primary-foreground">
      <p className="page-container flex min-h-10 flex-wrap items-center justify-center gap-x-2 py-2 text-center text-sm">
        <span className="whitespace-nowrap">Free delivery over {formatPrice(FREE_DELIVERY_THRESHOLD)}</span>
        {/* Returns drop off on phones to make room for the buy-back link. */}
        <span className="hidden whitespace-nowrap sm:inline">
          <span aria-hidden className="mr-2">·</span>
          Free returns within {RETURNS_DAYS} days
        </span>
        {/* Hidden in A/B version A (?v=a), see buyback-ab.tsx */}
        <span className="buyback-ab w-full whitespace-nowrap sm:w-auto">
          <span aria-hidden className="mr-2 hidden sm:inline">·</span>
          <Link href="/pre-loved#how-it-works" className="underline underline-offset-4">
            We buy back what you buy
          </Link>
        </span>
      </p>
    </div>
  )
}
