import type { Metadata } from "next"
import Link from "next/link"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Photo } from "@/components/site/photo"
import { SampleDataLabel } from "@/components/site/sustainability"
import { BONUS_PCT, BUYBACK_MONTHS, buybackValues, RATES_SUMMARY } from "@/lib/buyback"
import { nf, takeBack } from "@/lib/impact"
import { formatPrice, getProduct, type Product } from "@/lib/products"

export const metadata: Metadata = {
  title: "Pre-loved | Drip",
  description: "Send back Drip clothes you no longer wear. We check, clean and resell them, or recycle them.",
}

/* Placeholder listings: second-hand versions of catalogue items. Not for sale. */
type Listing = { id: string; size: string; condition: "Like new" | "Very good" | "Good"; percentOfNew: number }

const groups: { id: string; title: string; intro: string; listings: Listing[] }[] = [
  {
    id: "new-in",
    title: "New in",
    intro: "Checked and cleaned this week.",
    listings: [
      { id: "merino-crew-jumper", size: "M", condition: "Like new", percentOfNew: 55 },
      { id: "straight-jeans", size: "L", condition: "Very good", percentOfNew: 45 },
      { id: "linen-wrap-dress", size: "S", condition: "Very good", percentOfNew: 50 },
    ],
  },
  {
    id: "bestsellers",
    title: "Bestsellers",
    intro: "The pieces people ask for most.",
    listings: [
      { id: "wool-blend-coat", size: "M", condition: "Very good", percentOfNew: 50 },
      { id: "classic-hoodie", size: "XL", condition: "Good", percentOfNew: 40 },
      { id: "oxford-shirt", size: "M", condition: "Like new", percentOfNew: 55 },
    ],
  },
  {
    id: "last-chance",
    title: "Last chance",
    intro: "Listed for over 30 days, now with a further 20% off.",
    listings: [
      { id: "denim-trucker-jacket", size: "S", condition: "Good", percentOfNew: 32 },
      { id: "wide-leg-trousers", size: "XS", condition: "Very good", percentOfNew: 36 },
    ],
  },
]

const steps = [
  {
    title: "Sell it back",
    body: `Within ${BUYBACK_MONTHS / 12} years of buying, sell any Drip piece back. Get a quote in My Drip Wardrobe, or bring it to any store. No photos or app needed.`,
  },
  {
    title: "We grade it",
    body: `Staff check it at our hub in ${takeBack.hub} or at the till: like new, very good, good or worn out. If the grade changes from your estimate, we tell you why.`,
  },
  {
    title: "You get credit",
    body: `We pay a share of the price you paid: ${RATES_SUMMARY}. Spend it on Pre-loved and you get ${BONUS_PCT} extra. Worn-out pieces earn no credit, but we still take them free.`,
  },
  {
    title: "Resold or recycled",
    body: `Wearable pieces are listed here at 30-55% of the new price. The rest is shredded into insulation felt or re-spun into yarn.`,
  },
]

function ListingCard({ listing, product }: { listing: Listing; product: Product }) {
  const price = Math.max(10, Math.round((product.price * listing.percentOfNew) / 100))
  return (
    <article className="min-w-0">
      <div className="relative">
        <Photo
          imageKey={`product:${product.id}`}
          alt={`Pre-loved ${product.name}`}
          hex={product.colours[0].hex}
          label={product.name}
          sizes="(min-width: 1320px) 310px, (min-width: 1024px) 24vw, 50vw"
          className="aspect-[4/5]"
        />
        <Badge variant="solid" className="absolute top-3 left-3">
          Pre-loved
        </Badge>
      </div>
      <h3 className="mt-3 font-sans text-[15px] leading-snug font-normal tracking-normal md:text-base">
        {product.name}
      </h3>
      <p className="mt-1 text-[15px] text-muted-foreground">
        Size {listing.size} · {listing.condition}
      </p>
      <p className="mt-1 text-base font-semibold">
        {formatPrice(price)}{" "}
        <s className="ml-1 text-sm font-normal text-muted-foreground">
          <span className="sr-only">new price </span>
          {formatPrice(product.price)} new
        </s>
      </p>
      <p className="mt-2 text-sm text-muted-foreground">
        Placeholder listing.{" "}
        <Link href={`/product/${product.id}`} className="text-foreground underline underline-offset-4">
          See it new
        </Link>
      </p>
    </article>
  )
}

export default function PreLovedPage() {
  return (
    <>
      <section className="border-b border-border">
        <div className="page-container py-12 lg:py-16">
          <nav aria-label="Breadcrumb" className="mb-6 text-sm text-muted-foreground">
            <ol className="flex gap-2">
              <li><Link href="/" className="hover:text-foreground hover:underline">Home</Link></li>
              <li aria-hidden>/</li>
              <li aria-current="page" className="text-foreground">Pre-loved</li>
            </ol>
          </nav>
          <p className="label-caps mb-4 text-muted-foreground">Buy-back and resale</p>
          <h1 className="text-[36px] leading-[1.08] lg:text-[48px]">Pre-loved</h1>
          <p className="measure mt-6 text-base text-muted-foreground lg:text-lg">
            Every Drip piece comes with the Buy-back promise: sell it back to us within {BUYBACK_MONTHS / 12} years.
            We clean and resell what can be worn again, and recycle the rest. Listings on this page are
            placeholders in this prototype.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild>
              <a href="#how-it-works">How buy-back works</a>
            </Button>
            <Button asChild variant="outline">
              <a href="#listings">Browse listings</a>
            </Button>
          </div>
        </div>
      </section>

      <section id="how-it-works" aria-labelledby="how-h" className="scroll-mt-32">
        <div className="page-container section-y">
          <h2 id="how-h" className="text-[28px] lg:text-4xl">How buy-back works</h2>
          <ol className="mt-10 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            {steps.map((s, i) => (
              <li key={s.title} className="border-t-2 border-foreground pt-6">
                <span className="font-heading text-sm font-semibold">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-3 text-xl">{s.title}</h3>
                <p className="measure mt-3 text-base text-muted-foreground">{s.body}</p>
              </li>
            ))}
          </ol>
          <p className="measure mt-10 text-base">
            <span className="font-semibold">Example:</span> a {formatPrice(30)} jumper earns{" "}
            {buybackValues(30).map((v) => formatPrice(v.value)).join(" / ")} by grade, or{" "}
            {buybackValues(30).map((v) => formatPrice(v.preloved)).join(" / ")} if you spend it on Pre-loved.{" "}
            <Link href="/wardrobe" className="underline underline-offset-4">See My Drip Wardrobe</Link>
          </p>

          <div className="mt-12 grid grid-cols-1 gap-8 border border-border bg-surface p-6 lg:grid-cols-12 lg:p-8">
            <div className="lg:col-span-5">
              <div className="flex flex-wrap items-center gap-3">
                <h3 className="text-xl">Take-back in {takeBack.year}</h3>
                <SampleDataLabel tone="ink" />
              </div>
              <p className="mt-2 text-[15px] text-muted-foreground">Fictional figures for this prototype.</p>
            </div>
            <dl className="grid grid-cols-2 gap-6 lg:col-span-7 lg:grid-cols-4">
              {[
                [nf.format(takeBack.itemsReturned), "items returned"],
                [`${takeBack.resoldPercent}%`, "resold in Pre-loved"],
                [`${takeBack.recycledPercent}%`, "made into insulation felt"],
                [`${takeBack.respunPercent}%`, "re-spun into new yarn"],
              ].map(([fig, label]) => (
                <div key={label}>
                  <dt className="sr-only">{label}</dt>
                  <dd>
                    <span className="block font-heading text-[28px] leading-none font-semibold">{fig}</span>
                    <span className="mt-2 block text-[15px] text-muted-foreground">{label}</span>
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="mt-10 max-w-3xl">
            <h3 className="text-xl">What we accept</h3>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-base text-muted-foreground">
              <li>Any Drip clothing or accessory, in any condition.</li>
              <li>Up to 10 items per parcel with the free returns label.</li>
              <li>Please wash items before sending. We can&apos;t accept underwear for hygiene reasons.</li>
            </ul>
          </div>
        </div>
      </section>

      <section id="listings" aria-labelledby="listings-h" className="scroll-mt-32 bg-surface">
        <div className="page-container section-y">
          <h2 id="listings-h" className="text-[28px] lg:text-4xl">Listings</h2>
          <p className="measure mt-3 text-base text-muted-foreground">
            Example listings to show how Pre-loved would look. They can&apos;t be bought.
          </p>
          {groups.map((g) => (
            <section key={g.id} id={g.id} aria-labelledby={`${g.id}-h`} className="mt-12 scroll-mt-32">
              <h3 id={`${g.id}-h`} className="text-2xl">{g.title}</h3>
              <p className="mt-1 text-[15px] text-muted-foreground">{g.intro}</p>
              <ul className="mt-6 grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4 lg:gap-x-6">
                {g.listings.map((l) => {
                  const product = getProduct(l.id)
                  return product ? (
                    <li key={l.id} className="min-w-0">
                      <ListingCard listing={l} product={product} />
                    </li>
                  ) : null
                })}
              </ul>
            </section>
          ))}
        </div>
      </section>
    </>
  )
}
