import Link from "next/link"
import { cn } from "cn"

import { Button } from "@/components/ui/button"
import { BONUS_PCT, BUYBACK_MONTHS, buybackValues, MAX_RATE, PROMISE_LINE } from "@/lib/buyback"
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

const EXAMPLE_PRICE = 30

/**
 * Homepage feature: the Buy-back promise, Drip's main difference.
 * Dark band so first-time visitors see it straight after the hero.
 */
export function BuybackFeature() {
  const years = BUYBACK_MONTHS / 12
  const steps = [
    { title: "Buy from Drip", body: "Every product page shows what we will pay you back." },
    { title: `Wear it for up to ${years} years`, body: "Keep it as long as you like within that time." },
    { title: "Sell it back to us", body: "Get a quote online or bring it to any store. We grade it and pay you in Drip credit." },
  ]
  const example = buybackValues(EXAMPLE_PRICE)

  return (
    <section aria-labelledby="buyback-feature-h" className="on-dark bg-primary text-primary-foreground">
      <div className="page-container section-y grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-6">
        <div className="min-w-0 lg:col-span-5">
          <p className="label-caps mb-4 text-primary-foreground/75">Only at Drip · Buy-back promise</p>
          <h2 id="buyback-feature-h" className="text-[32px] leading-[1.1] lg:text-5xl">
            We buy your clothes back
          </h2>
          <p className="measure mt-5 text-base text-primary-foreground/80 lg:text-lg">
            Sell anything you bought from us back to Drip within {years} years. We pay up to {MAX_RATE} of
            the price you paid, and {BONUS_PCT} more if you spend it on Pre-loved.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Button asChild variant="outline" className="border-primary-foreground">
              <Link href="/pre-loved#how-it-works">How buy-back works</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-primary-foreground/60 bg-transparent text-primary-foreground hover:bg-primary-hover"
            >
              <Link href="/wardrobe">Try a sample wardrobe</Link>
            </Button>
          </div>
        </div>

        <div className="min-w-0 lg:col-span-6 lg:col-start-7">
          <ol className="grid grid-cols-1 gap-6 sm:grid-cols-3 lg:gap-5">
            {steps.map((s, i) => (
              <li key={s.title} className="grid grid-cols-[2.25rem_1fr] border-t border-primary-foreground/30 pt-4 sm:block">
                <p className="font-heading text-[28px] leading-none font-semibold">{i + 1}</p>
                <div>
                  <p className="text-base font-semibold sm:mt-3">{s.title}</p>
                  <p className="mt-1 text-[15px] text-primary-foreground/75">{s.body}</p>
                </div>
              </li>
            ))}
          </ol>

          <div className="mt-8 border border-primary-foreground/30 p-5">
            <p className="text-base font-semibold">Example: a {formatPrice(EXAMPLE_PRICE)} jumper</p>
            <dl className="mt-3 grid grid-cols-3 gap-3">
              {example.map((v) => (
                <div key={v.grade}>
                  <dt className="text-sm text-primary-foreground/75">{v.label}</dt>
                  <dd className="font-heading text-2xl font-semibold">{formatPrice(v.value)}</dd>
                  <dd className="text-sm text-primary-foreground/75">{formatPrice(v.preloved)} on Pre-loved</dd>
                </div>
              ))}
            </dl>
            <p className="mt-4 text-sm text-primary-foreground/75">Sample values. Worn-out pieces earn no credit, but we still take them free.</p>
          </div>
        </div>
      </div>
    </section>
  )
}
