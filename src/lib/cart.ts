import { currentPrice, getProduct, type Product } from "@/lib/products"
import { deliveryCost, type DeliveryMethod } from "@/lib/store"

export type CartLineInput = { productId: string; colour: string; size: string; qty: number }

export type CartItem = {
  key: string
  productId: string
  colour: string
  size: string
  qty: number
  product: Product
  hex: string
  unitPrice: number
  wasPrice?: number
  lineTotal: number
}

export const lineKeyOf = (l: Pick<CartLineInput, "productId" | "colour" | "size">) =>
  `${l.productId}|${l.colour}|${l.size}`

/** Join saved cart lines with product data. Lines for unknown products are dropped. */
export function cartDetails(lines: CartLineInput[], method: DeliveryMethod = "standard") {
  const items: CartItem[] = []
  for (const l of lines) {
    const product = getProduct(l.productId)
    if (!product) continue
    const unitPrice = currentPrice(product)
    items.push({
      key: lineKeyOf(l),
      productId: l.productId,
      colour: l.colour,
      size: l.size,
      qty: l.qty,
      product,
      hex: product.colours.find((c) => c.name === l.colour)?.hex ?? product.colours[0].hex,
      unitPrice,
      wasPrice: product.salePrice !== undefined ? product.price : undefined,
      lineTotal: unitPrice * l.qty,
    })
  }
  const subtotal = Math.round(items.reduce((n, i) => n + i.lineTotal, 0) * 100) / 100
  const delivery = items.length ? deliveryCost(subtotal, method) : 0
  return {
    items,
    count: items.reduce((n, i) => n + i.qty, 0),
    subtotal,
    delivery,
    total: Math.round((subtotal + delivery) * 100) / 100,
  }
}
