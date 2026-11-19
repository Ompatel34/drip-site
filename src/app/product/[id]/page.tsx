import type { Metadata } from "next"
import { Suspense } from "react"
import Link from "next/link"
import { notFound } from "next/navigation"

import { Badge } from "@/components/ui/badge"
import { Photo, PhotoCredit } from "@/components/site/photo"
import { Price, ProductBadges, ProductCard, ProductGrid } from "@/components/site/product-card"
import {
  DeliverySummary,
  RatingSummary,
  Reviews,
  SustainabilityPanel,
} from "@/components/site/product-details"
import { ProductPurchase } from "@/components/site/product-purchase"
import { ProductPurchaseFromUrl } from "@/components/site/product-purchase-url"
import { SectionHeading } from "@/components/site/section-heading"
import {
  categoryLabels,
  completeTheLook,
  departments,
  getProduct,
  products,
  youMayAlsoLike,
} from "@/lib/products"

type Props = { params: Promise<{ id: string }> }

export function generateStaticParams() {
  return products.map((p) => ({ id: p.id }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const product = getProduct(id)
  return product ? { title: `${product.name} | Drip`, description: product.description } : {}
}

function Accordion({ title, open, children }: { title: string; open?: boolean; children: React.ReactNode }) {
  return (
    <details className="group border-b border-border" open={open}>
      <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between text-base font-semibold [&::-webkit-details-marker]:hidden">
        {title}
        <span aria-hidden className="text-xl font-normal transition-transform group-open:rotate-45">
          +
        </span>
      </summary>
      <div className="pb-6">{children}</div>
    </details>
  )
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params
  const product = getProduct(id)
  if (!product) notFound()

  const dept = departments.find((d) => d.slug === product.department)!
  const look = completeTheLook(product)
  const related = youMayAlsoLike(product, 4)

  return (
    <>
      <div className="page-container pt-6 pb-16 lg:pt-8 lg:pb-24">
        <nav aria-label="Breadcrumb" className="mb-6 text-sm text-muted-foreground">
          <ol className="flex flex-wrap gap-2">
            <li>
              <Link href="/shop" className="hover:text-foreground hover:underline">Shop</Link>
            </li>
            <li aria-hidden>/</li>
            <li>
              <Link href={`/shop?dept=${dept.slug}`} className="hover:text-foreground hover:underline">{dept.name}</Link>
            </li>
            <li aria-hidden>/</li>
            <li>
              <Link href={`/shop?dept=${dept.slug}&category=${product.category}`} className="hover:text-foreground hover:underline">
                {categoryLabels[product.category]}
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li aria-current="page" className="text-foreground">{product.name}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-x-12 lg:gap-y-16">
          {/* Image */}
          <div className="min-w-0 lg:col-span-7">
            <Photo
              imageKey={`product:${product.id}`}
              alt={`${product.name} in ${product.colours[0].name.toLowerCase()}`}
              hex={product.colours[0].hex}
              label={product.name}
              sizes="(min-width: 1320px) 720px, (min-width: 1024px) 56vw, 100vw"
              preload
              className="aspect-[4/5]"
            />
            <PhotoCredit imageKey={`product:${product.id}`} className="mt-2" />
          </div>

          {/* Buy box */}
          <div className="min-w-0 lg:col-span-5 lg:col-start-8 lg:row-span-3 lg:row-start-1">
            <div className="lg:sticky lg:top-[136px]">
              <ProductBadges product={product} max={3} />
              <h1 className="mt-4 text-[28px] leading-tight lg:text-[32px]">{product.name}</h1>
              <div className="mt-2">
                <RatingSummary product={product} />
              </div>
              <Price product={product} className="mt-2 text-lg font-semibold" />
              <Badge variant="material" className="mt-4">
                {product.material}
              </Badge>

              <p className="measure mt-6 text-base text-muted-foreground">{product.description}</p>
              <p className="mt-3 text-[15px]">
                <span className="font-semibold">Fit:</span>{" "}
                <span className="text-muted-foreground">{product.fit}</span>
              </p>

              <div className="mt-8">
                {/* Static fallback first; then ?colour= from the URL (e.g. from the rail) preselects a colour */}
                <Suspense fallback={<ProductPurchase
                  productId={product.id}
                  productName={product.name}
                  colours={product.colours}
                  sizes={product.sizes}
                  soldOut={product.soldOut}
                />}>
                  <ProductPurchaseFromUrl
                  productId={product.id}
                  productName={product.name}
                  colours={product.colours}
                  sizes={product.sizes}
                  soldOut={product.soldOut}
                  />
                </Suspense>
              </div>

              <div className="mt-4 border-t border-border">
                <Accordion title="Delivery and returns" open>
                  <DeliverySummary />
                </Accordion>
                <Accordion title="Fabric and care">
                  <p className="text-[15px]">
                    <span className="font-semibold">Composition:</span>{" "}
                    <span className="text-muted-foreground">{product.composition}</span>
                  </p>
                  <p className="mt-2 text-[15px]">
                    <span className="font-semibold">Care:</span>{" "}
                    <span className="text-muted-foreground">{product.care}</span>
                  </p>
                </Accordion>
              </div>
            </div>
          </div>

          {/* Sustainability and reviews sit under the image on desktop */}
          <div className="min-w-0 lg:col-span-7 lg:col-start-1">
            <SustainabilityPanel product={product} />
          </div>
          <div className="min-w-0 lg:col-span-7 lg:col-start-1">
            <Reviews product={product} />
          </div>
        </div>
      </div>

      {look.length > 0 && (
        <section aria-labelledby="look-h" className="bg-surface">
          <div className="page-container section-y">
            <SectionHeading id="look-h" title="Complete the look" />
            <ul className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:gap-x-6">
              {look.map((p) => (
                <li key={p.id} className="min-w-0">
                  <ProductCard product={p} sizes="(min-width: 1320px) 420px, (min-width: 768px) 32vw, 50vw" />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {related.length > 0 && (
        <section aria-labelledby="related-h">
          <div className="page-container section-y">
            <SectionHeading
              id="related-h"
              title="You may also like"
              link={{ label: `More ${dept.name.toLowerCase()}`, href: `/shop?dept=${dept.slug}` }}
            />
            <ProductGrid products={related} />
          </div>
        </section>
      )}
    </>
  )
}
