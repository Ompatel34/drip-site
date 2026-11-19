import type { Metadata } from "next"
import Link from "next/link"

import { Badge } from "@/components/ui/badge"
import { Photo, PhotoCredit } from "@/components/site/photo"
import { commitments, HowDripMakesClothes, SampleDataLabel } from "@/components/site/sustainability"
import { fabrics, factoryCountries } from "@/lib/impact"

export const metadata: Metadata = {
  title: "Our materials | Drip",
  description: "The fibres Drip uses, where they come from, the factory countries and our take-back and repair figures (sample data).",
}

/* Moss accent is allowed on this page: it is the "How Drip makes clothes" content. */
export default function MaterialsPage() {
  return (
    <>
      <section className="border-b border-border">
        <div className="page-container grid grid-cols-1 items-center gap-10 py-12 lg:grid-cols-12 lg:gap-12 lg:py-16">
          <div className="min-w-0 lg:col-span-5">
            <nav aria-label="Breadcrumb" className="mb-6 text-sm text-muted-foreground">
              <ol className="flex gap-2">
                <li><Link href="/" className="hover:text-foreground hover:underline">Home</Link></li>
                <li aria-hidden>/</li>
                <li aria-current="page" className="text-foreground">Our materials</li>
              </ol>
            </nav>
            <p className="label-caps mb-4 text-moss">Materials guide</p>
            <h1 className="text-[36px] leading-[1.08] lg:text-[48px]">Our materials</h1>
            <p className="measure mt-6 text-base text-muted-foreground lg:text-lg">
              What each Drip fabric is made of, where the fibre comes from, how much of it is
              recycled and where it is sewn. All figures on this page are fictional sample data.
            </p>
          </div>
          <div className="min-w-0 lg:col-span-7">
            <Photo
              imageKey="story:fabric"
              alt="Hand-stitching a seam in pale fabric"
              hex="#DCD6CB"
              sizes="(min-width: 1320px) 740px, (min-width: 1024px) 56vw, 100vw"
              preload
              className="aspect-[4/3]"
            />
            <PhotoCredit imageKey="story:fabric" className="mt-2" />
          </div>
        </div>
      </section>

      <HowDripMakesClothes showLinks={false} />

      <section aria-labelledby="commit-h">
        <div className="page-container section-y">
          <h2 id="commit-h" className="text-[28px] lg:text-4xl">Four commitments</h2>
          <ol className="mt-10 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            {commitments().map((c, i) => (
              <li key={c.title} className="border-t-2 border-moss pt-6">
                <span className="font-heading text-sm font-semibold text-moss">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-3 text-xl">{c.title}</h3>
                <p className="measure mt-3 text-base text-muted-foreground">{c.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="materials" aria-labelledby="fabrics-h" className="scroll-mt-32 bg-surface">
        <div className="page-container section-y">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 id="fabrics-h" className="text-[28px] lg:text-4xl">Fabric by fabric</h2>
            <SampleDataLabel />
          </div>
          <ul className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {fabrics.map((f) => (
              <li key={f.composition + f.source} className="flex min-w-0 flex-col border border-border bg-background p-6">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="material">{f.label}</Badge>
                  <span className="text-sm text-muted-foreground">{f.recycledPercent}% recycled</span>
                </div>
                <h3 className="mt-4 text-base">{f.composition}</h3>
                <p className="mt-2 text-[15px] text-muted-foreground">
                  <span className="font-medium text-foreground">Source:</span> {f.source}
                </p>
                <p className="mt-2 text-[15px] text-muted-foreground">
                  <span className="font-medium text-foreground">Care:</span> {f.care}
                </p>
                <p className="mt-4 text-[15px]">
                  <span className="font-medium">Used in {f.products.length} {f.products.length === 1 ? "product" : "products"}:</span>{" "}
                  {f.products.slice(0, 3).map((p, i) => (
                    <span key={p.id}>
                      {i > 0 && ", "}
                      <Link href={`/product/${p.id}`} className="underline underline-offset-4">{p.name}</Link>
                    </span>
                  ))}
                  {f.products.length > 3 && <span className="text-muted-foreground"> and {f.products.length - 3} more</span>}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="factories-h">
        <div className="page-container section-y grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-6">
          <div className="lg:col-span-5">
            <h2 id="factories-h" className="text-[28px] lg:text-4xl">Where our clothes are made</h2>
            <p className="measure mt-4 text-base text-muted-foreground">
              We work with partner factories in {factoryCountries.length} countries. The country is
              listed on every product page. Sample data.
            </p>
          </div>
          <dl className="divide-y divide-border border-y border-border lg:col-span-6 lg:col-start-7">
            {factoryCountries.map((f) => (
              <div key={f.country} className="flex justify-between gap-4 py-3 text-base">
                <dt>{f.country}</dt>
                <dd className="text-muted-foreground">
                  {f.count} {f.count === 1 ? "product" : "products"}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
    </>
  )
}
