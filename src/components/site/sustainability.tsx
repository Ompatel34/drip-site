import Link from "next/link"

import { BONUS_PCT, BUYBACK_MONTHS, MAX_RATE } from "@/lib/buyback"
import { collection, factoryCountries, nf, repairs, takeBack, targets } from "@/lib/impact"

/*
 * Moss accent is allowed here: this is the "How Drip makes clothes" section
 * and the sustainability block. No leaf icons, no gradients, no vague claims:
 * every statement names a material, percentage, country or figure.
 */

/** "Sample data" label. Moss only inside the sustainability sections; use tone="ink" elsewhere. */
export function SampleDataLabel({ onDark, tone = "moss" }: { onDark?: boolean; tone?: "moss" | "ink" }) {
  return (
    <span
      className={
        onDark
          ? "label-caps inline-flex h-6 items-center border border-white/80 px-2 text-white"
          : tone === "ink"
            ? "label-caps inline-flex h-6 items-center border border-foreground px-2 text-foreground"
            : "label-caps inline-flex h-6 items-center border border-moss px-2 text-moss"
      }
    >
      Sample data
    </span>
  )
}

const stats = () => [
  {
    figure: `${collection.avgRecycledPercent}%`,
    label: `average recycled fibre across our ${collection.productCount} products`,
    note: `Target: ${targets.recycledPercentBy2028}% by 2028`,
  },
  {
    figure: `${factoryCountries.length} countries`,
    label: "where our partner factories are, named on every product page",
    note: factoryCountries.slice(0, 3).map((f) => f.country).join(", ") + " and more",
  },
  {
    figure: `${nf.format(collection.avgWaterLitres)} L`,
    label: `estimated water per item on average, with ${collection.avgCo2Kg} kg CO2e`,
    note: `Target: ${targets.co2ReductionPercentBy2030}% less CO2e per item by 2030`,
  },
  {
    figure: nf.format(takeBack.itemsReturned),
    label: `items taken back in ${takeBack.year}`,
    note: `${takeBack.resoldPercent}% resold in Pre-loved, ${takeBack.recycledPercent + takeBack.respunPercent}% recycled`,
  },
]

/** Homepage section, and the top of /materials. */
export function HowDripMakesClothes({ headingLevel = "h2", showLinks = true }: { headingLevel?: "h1" | "h2"; showLinks?: boolean }) {
  const H = headingLevel
  return (
    <section aria-labelledby="how-heading" className="bg-surface">
      <div className="page-container section-y">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="label-caps mb-3 text-moss">Our approach</p>
            <H id="how-heading" className="text-[28px] lg:text-4xl">
              How Drip makes clothes
            </H>
          </div>
          <SampleDataLabel />
        </div>
        <p className="measure mt-4 text-base text-muted-foreground lg:text-lg">
          We publish the fibre, its source, the factory country and estimated water and carbon for
          every piece. These are fictional figures for this prototype.
        </p>

        <ul className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:mt-12 lg:grid-cols-4 lg:gap-6">
          {stats().map((s) => (
            <li key={s.label} className="border-t-2 border-moss pt-5">
              <p className="font-heading text-[32px] leading-none font-semibold tracking-[-0.01em] text-moss lg:text-4xl">
                {s.figure}
              </p>
              <p className="mt-3 text-base">{s.label}</p>
              <p className="mt-1 text-[15px] text-muted-foreground">{s.note}</p>
            </li>
          ))}
        </ul>

        {showLinks && (
          <div className="mt-10 flex flex-wrap gap-x-8 gap-y-2">
            <Link href="/materials" className="inline-flex min-h-12 items-center text-base font-medium text-moss underline underline-offset-4 hover:decoration-2">
              Read about our materials
            </Link>
            <Link href="/pre-loved" className="inline-flex min-h-12 items-center text-base font-medium text-moss underline underline-offset-4 hover:decoration-2">
              How Pre-loved works
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}

/** Four commitments, each tied to a figure. Used on /materials. */
export const commitments = () => [
  {
    title: "Traceable materials",
    body: `All ${collection.productCount} products list their fibre composition, where the fibre comes from and the factory country.`,
  },
  {
    title: "More recycled fibre",
    body: `${collection.productsWithRecycled} of ${collection.productCount} products contain recycled fibre today. We aim for ${targets.recycledPercentBy2028}% recycled fibre on average by 2028.`,
  },
  {
    title: "Free repairs",
    body: `Seams, zips and buttons are repaired free for ${repairs.freeRepairMonths} months after purchase. We made ${nf.format(repairs.repairsDone)} repairs in ${repairs.year}.`,
  },
  {
    title: "Buy-back and Pre-loved",
    body: `Sell any Drip piece back within ${BUYBACK_MONTHS / 12} years for up to ${MAX_RATE} of what you paid, ${BONUS_PCT} more on Pre-loved. ${takeBack.resoldPercent}% of what came back in ${takeBack.year} was resold; the rest was recycled.`,
  },
]
