import Link from "next/link"
import { cn } from "cn"

import { buybackValues, PROMISE_LINE } from "@/lib/buyback"
import { formatPrice } from "@/lib/products"

/** "Like new €12 · Very good €9 · Good €6" */
export function BuybackValuesLine({ price, className }: { price: number; className?: string }) {
  const values = buybackValues(price)
  return (
    <p className={cn("text-[15px]", className)}>
      {values.map((v, i) => (
        <span key={v.grade} className="whitespace-nowrap">
          {i > 0 && <span aria-hidden className="mx-1.5 text-muted-foreground">·</span>}
          {v.label} <span className="font-semibold">{formatPrice(v.value)}</span>
        </span>
      ))}
    </p>
  )
}

/** Quiet bordered box under the price on product pages. Moss is used for the label only. */
export function BuybackBlock({ price, className }: { price: number; className?: string }) {
  return (
    <section aria-labelledby="buyback-h" className={cn("border border-border px-4 py-3", className)}>
      <h2 id="buyback-h" className="label-caps text-moss">
        Buy-back promise
      </h2>
      <BuybackValuesLine price={price} className="mt-1.5" />
      <p className="mt-1 text-[15px] text-muted-foreground">{PROMISE_LINE}</p>
      <Link
        href="/pre-loved#how-it-works"
        className="mt-1 inline-flex min-h-11 items-center text-[15px] font-medium underline underline-offset-4"
      >
        How it works
      </Link>
    </section>
  )
}
