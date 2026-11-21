import type { Metadata } from "next"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Photo, PhotoCredit } from "@/components/site/photo"
import { BUYBACK_MONTHS, MAX_RATE } from "@/lib/buyback"
import { collection, factoryCountries, takeBack } from "@/lib/impact"
import { formatPrice } from "@/lib/products"
import { PRICE_MAX, PRICE_MIN } from "@/lib/store"

export const metadata: Metadata = {
  title: "About Drip | Drip",
  description: "About Drip, a fictional Irish high-street fashion brand, and this prototype store.",
}

export default function AboutPage() {
  const facts = [
    { k: "Products", v: `${collection.productCount} pieces for women, men and everyone` },
    { k: "Prices", v: `${formatPrice(PRICE_MIN)} to ${formatPrice(PRICE_MAX)}` },
    { k: "Made in", v: `${factoryCountries.length} countries, named on every product` },
    { k: "Buy-back", v: `Up to ${MAX_RATE} of the price back within ${BUYBACK_MONTHS / 12} years` },
    { k: "Take-back", v: `${takeBack.itemsReturned.toLocaleString("en-IE")} items returned in ${takeBack.year}` },
  ]

  return (
    <>
      <section className="border-b border-border">
        <div className="page-container grid grid-cols-1 items-center gap-10 py-12 lg:grid-cols-12 lg:gap-12 lg:py-16">
          <div className="min-w-0 lg:col-span-5">
            <nav aria-label="Breadcrumb" className="mb-6 text-sm text-muted-foreground">
              <ol className="flex gap-2">
                <li><Link href="/" className="hover:text-foreground hover:underline">Home</Link></li>
                <li aria-hidden>/</li>
                <li aria-current="page" className="text-foreground">About Drip</li>
              </ol>
            </nav>
            <p className="label-caps mb-4 text-muted-foreground">About</p>
            <h1 className="text-[36px] leading-[1.08] lg:text-[48px]">Everyday clothes, made to last</h1>
            <p className="measure mt-6 text-base text-muted-foreground lg:text-lg">
              Drip is a high-street fashion brand selling in Ireland. We make everyday clothing for
              women and men, unisex basics, a few accessories and a growing Pre-loved range.
            </p>
          </div>
          <div className="min-w-0 lg:col-span-7">
            <Photo
              imageKey="story:workshop"
              alt="A sewing machine stitching fabric in a workshop"
              hex="#D9D3C8"
              sizes="(min-width: 1320px) 740px, (min-width: 1024px) 56vw, 100vw"
              preload
              className="aspect-[4/3]"
            />
            <PhotoCredit imageKey="story:workshop" className="mt-2" />
          </div>
        </div>
      </section>

      <section aria-labelledby="what-h">
        <div className="page-container section-y grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-6">
          <div className="lg:col-span-5">
            <h2 id="what-h" className="text-[28px] lg:text-4xl">What we do</h2>
          </div>
          <div className="space-y-4 lg:col-span-6 lg:col-start-7">
            <p className="measure text-base">
              We design staples you can wear for years: well-cut trousers, good knitwear, shirts that
              keep their shape. Every product page tells you the fibre, where it comes from, where it
              was sewn and how to care for it.
            </p>
            <p className="measure text-base text-muted-foreground">
              When you have finished with something, sell it back to us with the Buy-back promise.
              Wearable pieces go to Pre-loved; the rest is recycled.
            </p>
            <dl className="mt-6 divide-y divide-border border-y border-border">
              {facts.map((f) => (
                <div key={f.k} className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-[140px_1fr] sm:gap-4">
                  <dt className="text-[15px] font-semibold">{f.k}</dt>
                  <dd className="text-[15px] text-muted-foreground">{f.v}</dd>
                </div>
              ))}
            </dl>
            <p className="text-sm text-muted-foreground">Figures are fictional sample data.</p>
            <div className="flex flex-col gap-3 pt-4 sm:flex-row">
              <Button asChild>
                <Link href="/materials">Our materials</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/pre-loved">How Pre-loved works</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="prototype-heading" className="bg-surface">
        <div className="page-container section-y grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-6">
          <h2 id="prototype-heading" className="text-[28px] lg:col-span-5 lg:text-4xl">
            About this prototype
          </h2>
          <div className="space-y-4 lg:col-span-6 lg:col-start-7">
            <p className="measure text-base">
              Drip is fictional and this website is a design prototype. The products, prices, reviews
              and sustainability figures are made up, and nothing can be bought: placing an order
              never takes a payment or ships anything.
            </p>
            <p className="measure text-base text-muted-foreground">
              Photos come from Unsplash and are credited to their photographers. The garments in them
              are not Drip products.
            </p>
            <Link href="/credits" className="inline-flex min-h-12 items-center text-base font-medium underline underline-offset-4">
              Photo credits
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
