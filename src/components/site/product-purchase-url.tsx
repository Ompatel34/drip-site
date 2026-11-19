"use client"

import { useSearchParams } from "next/navigation"

import { ProductPurchase } from "@/components/site/product-purchase"
import { findColour, type Swatch } from "@/lib/products"

type Props = {
  productId: string
  productName: string
  colours: Swatch[]
  sizes: string[]
  soldOut?: string[]
}

/** Reads ?colour= (e.g. ?colour=navy) and preselects that colour. */
export function ProductPurchaseFromUrl(props: Props) {
  const params = useSearchParams()
  const picked = findColour(props, params.get("colour"))
  return <ProductPurchase key={picked?.name ?? "default"} {...props} initialColour={picked?.name} />
}
