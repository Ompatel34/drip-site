"use client"

import { useState } from "react"
import Link from "next/link"
import { Check } from "lucide-react"
import { cn } from "cn"

import { Button } from "@/components/ui/button"
import { useCart } from "@/components/site/store-provider"
import { WishlistButton } from "@/components/site/wishlist-button"
import type { Swatch } from "@/lib/products"

export function ProductPurchase({
  productId,
  productName,
  colours,
  sizes,
  soldOut = [],
  initialColour,
}: {
  productId: string
  productName: string
  colours: Swatch[]
  sizes: string[]
  soldOut?: string[]
  /** Colour name to start with (e.g. from ?colour= in the URL) */
  initialColour?: string
}) {
  const { addItem } = useCart()
  const available = sizes.filter((s) => !soldOut.includes(s))
  const [colour, setColour] = useState(
    colours.some((c) => c.name === initialColour) ? initialColour! : colours[0].name
  )
  const [size, setSize] = useState<string | null>(sizes.length === 1 && available.length === 1 ? sizes[0] : null)
  const [error, setError] = useState(false)
  const [added, setAdded] = useState(false)

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        if (!size) {
          setError(true)
          setAdded(false)
          return
        }
        setError(false)
        addItem({ productId, colour, size })
        setAdded(true)
      }}
      className="flex flex-col gap-8"
    >
      <fieldset>
        <legend className="mb-3 text-[15px]">
          <span className="font-semibold">Colour:</span> {colour}
        </legend>
        <div className="flex flex-wrap gap-2">
          {colours.map((c) => (
            <label key={c.name} className="relative cursor-pointer">
              <input
                type="radio"
                name="colour"
                value={c.name}
                checked={colour === c.name}
                onChange={() => {
                  setColour(c.name)
                  setAdded(false)
                }}
                className="peer sr-only"
              />
              <span className="block size-12 border border-border p-1 peer-checked:border-2 peer-checked:border-foreground peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ring">
                <span
                  className="block size-full border border-[#BDBAB3]"
                  style={{ backgroundColor: c.hex }}
                />
              </span>
              <span className="sr-only">{c.name}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset aria-describedby={error ? "size-error" : undefined}>
        <legend className="mb-3 flex w-full justify-between text-[15px]">
          <span>
            <span className="font-semibold">Size:</span> {size ?? "Select a size"}
          </span>
          <Link href="/size-guide" className="text-sm underline underline-offset-4">
            Size guide
          </Link>
        </legend>
        <div className="flex flex-wrap gap-2">
          {sizes.map((s) => {
            const out = soldOut.includes(s)
            return (
              <label key={s} className={out ? "cursor-not-allowed" : "cursor-pointer"}>
                <input
                  type="radio"
                  name="size"
                  value={s}
                  disabled={out}
                  checked={size === s}
                  onChange={() => {
                    setSize(s)
                    setError(false)
                    setAdded(false)
                  }}
                  className="peer sr-only"
                />
                <span
                  className={cn(
                    "inline-flex h-12 min-w-12 items-center justify-center rounded-sm border px-4 text-[15px] font-medium transition-colors",
                    "peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ring",
                    out
                      ? "border-border bg-surface text-muted-foreground line-through"
                      : "border-input hover:border-foreground peer-checked:border-foreground peer-checked:bg-foreground peer-checked:text-background",
                    error && !out && "border-sale"
                  )}
                >
                  {s}
                  {out && <span className="sr-only"> (sold out)</span>}
                </span>
              </label>
            )
          })}
        </div>
        {error && (
          <p id="size-error" className="mt-2 text-sm font-medium text-sale">
            Please choose a size.
          </p>
        )}
      </fieldset>

      <div className="flex gap-3">
        <Button type="submit" size="block" className="flex-1">
          Add to bag
        </Button>
        <WishlistButton productId={productId} productName={productName} variant="outline" />
      </div>

      <p role="status" className="-mt-4 min-h-6 text-sm">
        {added && (
          <span className="inline-flex items-start gap-2 font-medium text-success">
            <Check aria-hidden className="mt-0.5 size-4 shrink-0" />
            <span>
              Added to your bag: {colour}, size {size}.
            </span>
          </span>
        )}
      </p>
    </form>
  )
}
