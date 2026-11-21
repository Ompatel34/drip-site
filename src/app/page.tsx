import Link from "next/link"

import { Button } from "@/components/ui/button"
import ClothingRailHero from "@/components/ui/product-rail-gallery"
import { BenefitsStrip } from "@/components/site/benefits-strip"
import { NewsletterForm } from "@/components/site/newsletter-form"
import { Photo } from "@/components/site/photo"
import { ProductGrid } from "@/components/site/product-card"
import { SectionHeading } from "@/components/site/section-heading"
import { HowDripMakesClothes } from "@/components/site/sustainability"
import { bestsellers, departments, newArrivals } from "@/lib/products"
import { railItems } from "@/lib/rail"

const categoryTones: Record<string, string> = {
  women: "#DDD5C8",
  men: "#CDD0D4",
  unisex: "#E2DFD8",
  accessories: "#D2CBC0",
}

/* Homepage order (from the brief): clothing rail hero, benefits strip,
   featured categories, How Drip makes clothes, new arrivals, bestsellers,
   newsletter. */
export default function Home() {
  return (
    <>
      {/* 1. Clothing rail hero, directly under the navigation */}
      <div className="page-container">
        <ClothingRailHero
          items={railItems()}
          headingAs="h1"
          eyebrow="Traceable materials"
          heading="Made from organic and recycled fibres"
          caption="Every piece lists its fibre, recycled content and factory country. Brush the rail and select one to look closer."
          hanger="wood"
          autoplay
          interval={3500}
          action={
            <Button asChild>
              <Link href="/shop">Shop all</Link>
            </Button>
          }
        />
      </div>

      {/* 2. Benefits strip */}
      <div className="page-container">
        <BenefitsStrip compact />
      </div>

      {/* 3. Featured categories */}
      <section aria-labelledby="categories" className="section-y">
        <div className="page-container">
          <SectionHeading id="categories" eyebrow="Shop by category" title="Find your fit" />
          <ul className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
            {departments.map((c) => (
              <li key={c.slug} className="min-w-0">
                <Link href={`/shop?dept=${c.slug}`} className="group block">
                  <Photo
                    imageKey={`category:${c.slug}`}
                    alt=""
                    hex={categoryTones[c.slug]}
                    label={c.name}
                    sizes="(min-width: 1320px) 310px, (min-width: 1024px) 24vw, 50vw"
                    className="aspect-[4/5]"
                  />
                  <p className="mt-3 text-base font-semibold group-hover:underline group-hover:underline-offset-4">
                    {c.name}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 4. How Drip makes clothes: high on the page, right after categories */}
      <HowDripMakesClothes />

      {/* 5. New arrivals */}
      <section aria-labelledby="new-in" className="section-y">
        <div className="page-container">
          <SectionHeading
            id="new-in"
            eyebrow="Just landed"
            title="New arrivals"
            link={{ label: "View all", href: "/shop?badge=new" }}
          />
          <ProductGrid products={newArrivals(8)} />
        </div>
      </section>

      {/* 6. Bestsellers */}
      <section aria-labelledby="bestsellers" className="pb-20 lg:pb-28">
        <div className="page-container">
          <SectionHeading
            id="bestsellers"
            eyebrow="Most loved"
            title="Bestsellers"
            link={{ label: "View all", href: "/shop?badge=bestseller" }}
          />
          <ProductGrid products={bestsellers(4)} />
        </div>
      </section>

      {/* 7. Newsletter */}
      <section aria-labelledby="newsletter-heading" className="border-t border-border bg-surface">
        <div className="page-container section-y grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-6">
          <div className="lg:col-span-5">
            <h2 id="newsletter-heading" className="text-[28px] lg:text-4xl">
              Hear about new drops first
            </h2>
            <p className="measure mt-3 text-base text-muted-foreground">
              One short email a week about new pieces and Pre-loved finds. No spam, unsubscribe any time.
            </p>
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <NewsletterForm />
          </div>
        </div>
      </section>
    </>
  )
}
