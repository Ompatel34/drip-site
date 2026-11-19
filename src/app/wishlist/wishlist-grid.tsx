"use client"

import Link from "next/link"

import { Button } from "@/components/ui/button"
import { ProductGrid } from "@/components/site/product-card"
import { useWishlist } from "@/components/site/store-provider"
import { products } from "@/lib/products"

export function WishlistGrid() {
  const { ready, ids } = useWishlist()
  if (!ready) return null
  const saved = products.filter((p) => ids.includes(p.id))

  if (saved.length === 0) {
    return (
      <div className="border border-border bg-surface px-6 py-12 text-center">
        <p className="text-lg font-semibold">You haven&apos;t saved anything yet</p>
        <p className="mt-2 text-muted-foreground">Tap the heart on any product to save it here.</p>
        <Button asChild className="mt-6">
          <Link href="/shop">Browse the shop</Link>
        </Button>
      </div>
    )
  }

  return (
    <>
      <p className="mb-6 text-[15px] text-muted-foreground">
        {saved.length} saved {saved.length === 1 ? "item" : "items"}
      </p>
      <ProductGrid products={saved} />
    </>
  )
}
