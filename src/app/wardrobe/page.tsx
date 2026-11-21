import type { Metadata } from "next"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { ContentPage } from "@/components/site/content-page"
import { Photo } from "@/components/site/photo"
import { BUYBACK_MONTHS, maxBuyback, PROMISE_LINE } from "@/lib/buyback"
import { formatPrice } from "@/lib/products"
import { formatDate, wardrobe } from "@/lib/wardrobe"

export const metadata: Metadata = { title: "My Drip Wardrobe | Drip", robots: { index: false } }

export default function WardrobePage() {
  return (
    <ContentPage
      title="My Drip Wardrobe"
      intro={
        <>
          Everything you have bought from Drip, and what we would pay to buy it back. {PROMISE_LINE}
        </>
      }
      wide
    >
      <p role="note" className="mb-8 border border-border bg-surface px-4 py-3 text-[15px]">
        <span className="font-semibold">Sample account, prototype only.</span> These purchases are made up to show how the
        wardrobe would work.
      </p>

      <ul className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
        {wardrobe.map((w) => (
          <li key={w.productId} className="flex min-w-0 flex-col">
            <Link href={`/product/${w.productId}`} className="group block">
              <Photo
                imageKey={`product:${w.productId}`}
                alt=""
                hex={w.hex}
                label={w.product.name}
                sizes="(min-width: 1320px) 310px, (min-width: 1024px) 24vw, (min-width: 640px) 50vw, 100vw"
                className="aspect-[4/5]"
              />
              <h2 className="mt-3 font-sans text-base font-normal tracking-normal group-hover:underline group-hover:underline-offset-4">
                {w.product.name}
              </h2>
            </Link>
            <p className="text-[15px] text-muted-foreground">
              {w.colour} · Size {w.size}
            </p>
            <dl className="mt-3 space-y-1 text-[15px]">
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">Price paid</dt>
                <dd>{formatPrice(w.pricePaid)}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">Bought</dt>
                <dd>{formatDate(w.purchased)}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">Buy-back window</dt>
                <dd>
                  {w.monthsLeft} {w.monthsLeft === 1 ? "month" : "months"} left
                </dd>
              </div>
            </dl>
            <p className="mt-3 text-base font-semibold">Worth today: up to {formatPrice(maxBuyback(w.pricePaid))}</p>
            <Button asChild variant="outline" className="mt-4">
              <Link href={`/wardrobe/pass-on/${w.productId}`}>
                Pass it on<span className="sr-only">: {w.product.name}</span>
              </Link>
            </Button>
          </li>
        ))}
      </ul>

      <p className="mt-12 max-w-[70ch] text-[15px] text-muted-foreground">
        The promise lasts {BUYBACK_MONTHS / 12} years from the date you bought each piece. No photos? Bring it to any Drip store
        and staff will grade it at the till.{" "}
        <Link href="/pre-loved#how-it-works" className="text-foreground underline underline-offset-4">
          How buy-back works
        </Link>
      </p>
    </ContentPage>
  )
}
