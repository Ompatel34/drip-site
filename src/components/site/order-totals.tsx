import { formatPrice } from "@/lib/products"
import { FREE_DELIVERY_THRESHOLD } from "@/lib/store"

/** Subtotal / delivery / total rows used by the cart, checkout and confirmation. */
export function OrderTotals({
  subtotal,
  delivery,
  total,
  deliveryLabel = "Delivery",
  showFreeDeliveryHint,
}: {
  subtotal: number
  delivery: number
  total: number
  deliveryLabel?: string
  showFreeDeliveryHint?: boolean
}) {
  const toFree = Math.max(0, FREE_DELIVERY_THRESHOLD - subtotal)
  return (
    <div>
      <dl className="space-y-2 text-base">
        <div className="flex justify-between gap-4">
          <dt>Subtotal</dt>
          <dd>{formatPrice(subtotal)}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt>{deliveryLabel}</dt>
          <dd>{delivery === 0 ? "Free" : formatPrice(delivery)}</dd>
        </div>
        <div className="flex justify-between gap-4 border-t border-border pt-3 text-lg font-semibold">
          <dt>Total</dt>
          <dd>{formatPrice(total)}</dd>
        </div>
      </dl>
      {showFreeDeliveryHint && (
        <p className="mt-3 text-[15px]">
          {toFree > 0 ? (
            <span className="text-muted-foreground">
              Spend {formatPrice(toFree)} more for free standard delivery.
            </span>
          ) : (
            <span className="font-medium text-success">You get free standard delivery.</span>
          )}
        </p>
      )}
    </div>
  )
}
