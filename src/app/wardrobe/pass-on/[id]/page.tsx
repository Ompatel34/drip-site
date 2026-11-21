import type { Metadata } from "next"
import { Suspense } from "react"
import Link from "next/link"
import { notFound } from "next/navigation"

import { Photo } from "@/components/site/photo"
import { formatPrice } from "@/lib/products"
import { getWardrobeItem, wardrobe } from "@/lib/wardrobe"
import { PassOnFlow } from "./pass-on-flow"

type Props = { params: Promise<{ id: string }> }

export const dynamicParams = false

export function generateStaticParams() {
  return wardrobe.map((w) => ({ id: w.productId }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const item = getWardrobeItem((await params).id)
  return { title: item ? `Pass it on: ${item.product.name} | Drip` : "Pass it on | Drip", robots: { index: false } }
}

export default async function PassOnPage({ params }: Props) {
  const item = getWardrobeItem((await params).id)
  if (!item) notFound()

  return (
    <div className="page-container pt-10 pb-20 lg:pt-14 lg:pb-28">
      <nav aria-label="Breadcrumb" className="mb-6 text-sm text-muted-foreground">
        <ol className="flex flex-wrap gap-2">
          <li>
            <Link href="/wardrobe" className="hover:text-foreground hover:underline">My Drip Wardrobe</Link>
          </li>
          <li aria-hidden>/</li>
          <li aria-current="page" className="text-foreground">Pass it on</li>
        </ol>
      </nav>

      <p className="label-caps mb-3 text-muted-foreground">Snap &amp; Quote · demo</p>
      <h1 className="text-[32px] leading-tight lg:text-[40px]">Pass it on</h1>

      <div className="mt-6 flex max-w-2xl items-center gap-4 border border-border p-4">
        <Photo imageKey={`product:${item.productId}`} alt="" hex={item.hex} sizes="72px" className="aspect-[4/5] w-[72px] shrink-0" />
        <div className="min-w-0 text-[15px]">
          <p className="text-base font-semibold">{item.product.name}</p>
          <p className="text-muted-foreground">
            {item.colour} · Size {item.size} · Paid {formatPrice(item.pricePaid)}
          </p>
          <p className="text-muted-foreground">
            {item.monthsLeft} {item.monthsLeft === 1 ? "month" : "months"} left to sell it back
          </p>
        </div>
      </div>

      <Suspense fallback={<div className="mt-10 min-h-[40vh]" aria-busy="true" />}>
        <PassOnFlow productId={item.productId} pricePaid={item.pricePaid} productName={item.product.name} />
      </Suspense>
    </div>
  )
}
