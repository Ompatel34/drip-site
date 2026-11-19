import { Clock, RotateCcw, Truck } from "lucide-react"
import { cn } from "cn"

import { formatPrice } from "@/lib/products"
import { DELIVERY_OPTIONS, FREE_DELIVERY_THRESHOLD, RETURNS_DAYS } from "@/lib/store"

const benefits = [
  { icon: Truck, title: `Free delivery over ${formatPrice(FREE_DELIVERY_THRESHOLD)}`, body: "To any address in Ireland" },
  { icon: RotateCcw, title: "Free returns", body: `Within ${RETURNS_DAYS} days of delivery` },
  { icon: Clock, title: "Standard delivery", body: DELIVERY_OPTIONS.standard.days },
]

/** Used on the homepage and the cart. */
export function BenefitsStrip({ className, compact }: { className?: string; compact?: boolean }) {
  return (
    <ul
      aria-label="Delivery and returns"
      className={cn(
        "grid gap-px bg-border sm:grid-cols-3",
        compact ? "border border-border" : "border-y border-border",
        className
      )}
    >
      {benefits.map(({ icon: Icon, title, body }) => (
        <li key={title} className="flex items-center gap-4 bg-background px-4 py-5 sm:justify-center lg:py-6">
          <Icon aria-hidden className="size-6 shrink-0" strokeWidth={1.5} />
          <div>
            <p className="text-base font-semibold">{title}</p>
            <p className="text-sm text-muted-foreground">{body}</p>
          </div>
        </li>
      ))}
    </ul>
  )
}
