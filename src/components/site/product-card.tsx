import Link from "next/link"
import { cn } from "cn"

import { Badge } from "@/components/ui/badge"
import { Photo } from "@/components/site/photo"
import { WishlistButton } from "@/components/site/wishlist-button"
import {
  badgeLabels,
  currentPrice,
  formatPrice,
  isOnSale,
  type Product,
} from "@/lib/products"

export function Price({ product, className }: { product: Product; className?: string }) {
  const cls = className ?? "text-base font-semibold"
  if (!isOnSale(product)) return <p className={cls}>{formatPrice(product.price)}</p>
  return (
    <p className={cls}>
      <span className="text-sale">
        <span className="sr-only">Sale price </span>
        {formatPrice(currentPrice(product))}
      </span>{" "}
      <s className="ml-1 text-sm font-normal text-muted-foreground">
        <span className="sr-only">was </span>
        {formatPrice(product.price)}
      </s>
    </p>
  )
}

/** Up to `max` badges, most important first: Sale, Low stock, New, Bestseller. */
export function ProductBadges({ product, max = 2, className }: { product: Product; max?: number; className?: string }) {
  const list: { key: string; label: string; variant: "sale" | "default" | "solid" }[] = []
  if (isOnSale(product)) list.push({ key: "sale", label: "Sale", variant: "sale" })
  if (product.badges.includes("low-stock")) list.push({ key: "low", label: badgeLabels["low-stock"], variant: "default" })
  if (product.badges.includes("new")) list.push({ key: "new", label: badgeLabels.new, variant: "default" })
  if (product.badges.includes("bestseller")) list.push({ key: "best", label: badgeLabels.bestseller, variant: "solid" })
  if (!list.length) return null
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {list.slice(0, max).map((b) => (
        <Badge key={b.key} variant={b.variant}>
          {b.label}
        </Badge>
      ))}
    </div>
  )
}

export function Swatches({ product }: { product: Product }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="sr-only">Colours: {product.colours.map((c) => c.name).join(", ")}</span>
      {product.colours.map((c) => (
        <span
          key={c.name}
          aria-hidden
          title={c.name}
          className="size-3.5 border border-[#BDBAB3]"
          style={{ backgroundColor: c.hex }}
        />
      ))}
    </div>
  )
}

/*
 * Flat product card: 4:5 image edge to edge, 0px corners, no shadow,
 * plain-text name, swatches and price underneath, heart to save.
 */
export function ProductCard({ product, sizes }: { product: Product; sizes?: string }) {
  return (
    <article className="group relative">
      <Link href={`/product/${product.id}`} className="block">
        <div className="relative">
          <Photo
            imageKey={`product:${product.id}`}
            alt={`${product.name} in ${product.colours[0].name.toLowerCase()}`}
            hex={product.colours[0].hex}
            label={product.name}
            sizes={sizes ?? "(min-width: 1320px) 310px, (min-width: 1024px) 24vw, 50vw"}
            className="aspect-[4/5]"
          />
          <ProductBadges product={product} className="absolute top-3 left-3 max-w-[calc(100%-4rem)]" />
        </div>

        <div className="mt-3 flex flex-col gap-2">
          <h3 className="font-sans text-[15px] leading-snug font-normal tracking-normal group-hover:underline group-hover:underline-offset-4 md:text-base">
            {product.name}
          </h3>
          <Swatches product={product} />
          <Price product={product} />
        </div>
      </Link>

      <WishlistButton productId={product.id} productName={product.name} className="absolute top-0 right-0" />
    </article>
  )
}

export function ProductGrid({ products }: { products: Product[] }) {
  return (
    <ul className="grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4 lg:gap-x-6 lg:gap-y-12">
      {products.map((p) => (
        <li key={p.id} className="min-w-0">
          <ProductCard product={p} />
        </li>
      ))}
    </ul>
  )
}
