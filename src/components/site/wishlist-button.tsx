"use client"

import { Heart } from "lucide-react"
import { cn } from "cn"

import { useWishlist } from "@/components/site/store-provider"

/** Heart toggle. `variant="overlay"` sits on a product image. */
export function WishlistButton({
  productId,
  productName,
  variant = "overlay",
  className,
}: {
  productId: string
  productName: string
  variant?: "overlay" | "outline"
  className?: string
}) {
  const { has, toggle } = useWishlist()
  const saved = has(productId)

  return (
    <button
      type="button"
      aria-pressed={saved}
      aria-label={saved ? `Remove ${productName} from favourites` : `Save ${productName} to favourites`}
      onClick={() => toggle(productId)}
      className={cn(
        "inline-flex size-12 shrink-0 items-center justify-center text-foreground transition-colors",
        variant === "overlay"
          ? "hover:bg-white/70"
          : "rounded-sm border border-foreground bg-background hover:bg-surface",
        className
      )}
    >
      <Heart
        aria-hidden
        className={cn("size-5", saved && "fill-foreground")}
        strokeWidth={1.75}
      />
    </button>
  )
}
