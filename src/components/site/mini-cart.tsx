"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Check } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet"
import { Photo } from "@/components/site/photo"
import { lineKey, useCart } from "@/components/site/store-provider"
import { currentPrice, formatPrice, getProduct } from "@/lib/products"
import { FREE_DELIVERY_THRESHOLD } from "@/lib/store"

/**
 * Slides in from the right whenever an item is added to the bag.
 * Layout: fixed header, then ONE scrolling body (added item, other items,
 * totals and buttons) so nothing gets squeezed into a nested scroll box.
 */
export function MiniCart() {
  const { lines, lastAdded, count } = useCart()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- open in response to an add
    if (lastAdded) setOpen(true)
  }, [lastAdded])

  const subtotal = lines.reduce((sum, l) => {
    const p = getProduct(l.productId)
    return p ? sum + currentPrice(p) * l.qty : sum
  }, 0)
  const toFree = Math.max(0, FREE_DELIVERY_THRESHOLD - subtotal)

  const addedKey = lastAdded ? lineKey(lastAdded.line) : null
  const addedLine = lines.find((l) => lineKey(l) === addedKey)
  const added = addedLine ? getProduct(addedLine.productId) : undefined
  const others = lines.filter((l) => lineKey(l) !== addedKey)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent side="right" className="gap-0 p-0">
        <div className="shrink-0 border-b border-border px-6 py-5 pr-16">
          <SheetTitle className="flex items-center gap-2 font-heading text-xl font-semibold">
            <Check aria-hidden className="size-5 text-success" strokeWidth={2} />
            Added to your bag
          </SheetTitle>
          <SheetDescription className="mt-1 text-[15px] text-muted-foreground">
            {count} {count === 1 ? "item" : "items"} in your bag
          </SheetDescription>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
          {added && addedLine && (
            <div className="flex gap-4 border-b border-border px-6 py-5">
              <Photo
                imageKey={`product:${added.id}`}
                alt=""
                hex={added.colours.find((c) => c.name === addedLine.colour)?.hex ?? added.colours[0].hex}
                sizes="96px"
                className="aspect-[4/5] w-24 shrink-0"
              />
              <div className="min-w-0 text-[15px]">
                <p className="font-semibold">{added.name}</p>
                <p className="text-muted-foreground">
                  {addedLine.colour} · Size {addedLine.size}
                </p>
                <p className="text-muted-foreground">Qty {addedLine.qty}</p>
                <p className="mt-1 font-semibold">{formatPrice(currentPrice(added) * addedLine.qty)}</p>
              </div>
            </div>
          )}

          {others.length > 0 && (
            <div className="border-b border-border px-6 py-5">
              <h3 className="text-base">Also in your bag</h3>
              <ul className="mt-3 space-y-3 text-[15px]">
                {others.map((l) => {
                  const p = getProduct(l.productId)
                  if (!p) return null
                  return (
                    <li key={lineKey(l)} className="flex justify-between gap-4">
                      <span className="min-w-0">
                        {p.name}
                        <span className="block text-sm text-muted-foreground">
                          {l.colour} · {l.size} · Qty {l.qty}
                        </span>
                      </span>
                      <span className="shrink-0 font-semibold">{formatPrice(currentPrice(p) * l.qty)}</span>
                    </li>
                  )
                })}
              </ul>
            </div>
          )}

          <div className="px-6 py-5">
            <p className="flex justify-between text-base font-semibold">
              <span>Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </p>
            <p className="mt-1 text-[15px]">
              {toFree > 0 ? (
                <span className="text-muted-foreground">
                  Spend {formatPrice(toFree)} more for free standard delivery.
                </span>
              ) : (
                <span className="font-medium text-success">You get free standard delivery.</span>
              )}
            </p>
            <div className="mt-4 flex flex-col gap-3">
              <Button asChild size="block">
                <Link href="/checkout" onClick={() => setOpen(false)}>Checkout</Link>
              </Button>
              <Button asChild size="block" variant="outline">
                <Link href="/cart" onClick={() => setOpen(false)}>View bag</Link>
              </Button>
              <SheetClose asChild>
                <Button variant="link" className="mx-auto">Continue shopping</Button>
              </SheetClose>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
