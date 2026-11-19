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
      <p className="page-container flex min-h-10 items-center justify-center py-2 text-center text-sm">
        Free delivery over {formatPrice(FREE_DELIVERY_THRESHOLD)}
        <span aria-hidden className="mx-2">·</span>
        Free returns within {RETURNS_DAYS} days
      </p>
    </div>
  )
}
