import Link from "next/link"
import { Star } from "lucide-react"
import { cn } from "cn"

import { averageRating, formatPrice, type Product } from "@/lib/products"
import { DELIVERY_OPTIONS, FREE_DELIVERY_THRESHOLD, RETURNS_DAYS } from "@/lib/store"

const nf = new Intl.NumberFormat("en-IE")

/* ------------------------------------------------------------------ */

export function Stars({ rating, className }: { rating: number; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-0.5", className)} aria-hidden>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={cn("size-4", i <= Math.round(rating) ? "fill-foreground text-foreground" : "text-[#85878B]")}
          strokeWidth={1.5}
        />
      ))}
    </span>
  )
}

export function RatingSummary({ product }: { product: Product }) {
  const avg = averageRating(product)
  if (!product.reviews.length) return null
  return (
    <a href="#reviews" className="inline-flex min-h-11 items-center gap-2 text-[15px] hover:underline hover:underline-offset-4">
      <Stars rating={avg} />
      <span>
        {avg.toFixed(1)} out of 5
        <span className="text-muted-foreground"> · {product.reviews.length} sample reviews</span>
      </span>
    </a>
  )
}

/* ------------------------------------------------------------------ */
/* Sustainability: the moss accent is allowed here                     */

export function SustainabilityPanel({ product }: { product: Product }) {
  const s = product.sustainability
  const rows: [string, string][] = [
    ["Material", `${product.composition}`],
    ["Material source", s.materialSource],
    ["Recycled content", `${s.recycledPercent}% recycled fibre`],
    ["Made in", `Partner factory in ${s.factoryCountry}`],
    ["Water use (estimate)", `${nf.format(s.waterLitres)} litres per item`],
    ["Carbon footprint (estimate)", `${s.co2Kg.toFixed(1)} kg CO2e per item`],
    ["End of life", s.endOfLife],
  ]
  return (
    <section aria-labelledby="sustainability-h" className="border-t-2 border-moss bg-background pt-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 id="sustainability-h" className="text-2xl text-moss">
          Sustainability
        </h2>
        <span className="label-caps inline-flex h-6 items-center border border-moss px-2 text-moss">Sample data</span>
      </div>
      <p className="measure mt-2 text-[15px] text-muted-foreground">
        Fictional figures for this prototype, shown the way a real product page would show them.
      </p>
      <dl className="mt-6 divide-y divide-border border-y border-border">
        {rows.map(([k, v]) => (
          <div key={k} className="grid gap-1 py-3 sm:grid-cols-[200px_1fr] sm:gap-4">
            <dt className="text-[15px] font-semibold">{k}</dt>
            <dd className="text-[15px] text-muted-foreground">{v}</dd>
          </div>
        ))}
      </dl>
      <Link href="/materials" className="mt-4 inline-flex min-h-11 items-center text-[15px] font-medium text-moss underline underline-offset-4">
        How Drip makes clothes
      </Link>
    </section>
  )
}

/* ------------------------------------------------------------------ */

export function DeliverySummary() {
  const { standard, express } = DELIVERY_OPTIONS
  return (
    <ul className="space-y-1 text-[15px] text-muted-foreground">
      <li>
        <span className="font-semibold text-foreground">Standard:</span> {standard.days},{" "}
        {formatPrice(standard.cost)}, free over {formatPrice(FREE_DELIVERY_THRESHOLD)}
      </li>
      <li>
        <span className="font-semibold text-foreground">Express:</span> {express.days}, {formatPrice(express.cost)}
      </li>
      <li>
        <span className="font-semibold text-foreground">Returns:</span> free within {RETURNS_DAYS} days.{" "}
        <Link href="/returns" className="text-foreground underline underline-offset-4">
          Returns policy
        </Link>
      </li>
    </ul>
  )
}

/* ------------------------------------------------------------------ */

export function Reviews({ product }: { product: Product }) {
  const avg = averageRating(product)
  return (
    <section id="reviews" aria-labelledby="reviews-h" className="scroll-mt-36 border-t border-border pt-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 id="reviews-h" className="text-2xl">
          Sample reviews
        </h2>
        <span className="label-caps inline-flex h-6 items-center border border-foreground px-2">Sample</span>
      </div>
      <p className="mt-2 text-[15px] text-muted-foreground">
        These reviews are fictional and written for this prototype.
      </p>
      <p className="mt-4 flex items-center gap-3 text-base">
        <Stars rating={avg} />
        <span className="font-semibold">{avg.toFixed(1)} out of 5</span>
        <span className="text-muted-foreground">({product.reviews.length} reviews)</span>
      </p>
      <ul className="mt-6 divide-y divide-border border-y border-border">
        {product.reviews.map((r) => (
          <li key={r.author + r.title} className="py-5">
            <div className="flex items-center gap-2">
              <Stars rating={r.rating} />
              <span className="sr-only">{r.rating} out of 5 stars</span>
            </div>
            <h3 className="mt-2 text-base">{r.title}</h3>
            <p className="measure mt-1 text-base text-muted-foreground">{r.body}</p>
            <p className="mt-2 text-sm text-muted-foreground">{r.author}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}
