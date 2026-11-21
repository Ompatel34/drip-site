"use client"

import Link from "next/link"
import { Minus, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { BenefitsStrip } from "@/components/site/benefits-strip"
import { OrderTotals } from "@/components/site/order-totals"
import { Photo } from "@/components/site/photo"
import { useCart, useWishlist } from "@/components/site/store-provider"
import { maxBuyback } from "@/lib/buyback"
import { cartDetails } from "@/lib/cart"
import { formatPrice } from "@/lib/products"
import { DELIVERY_OPTIONS } from "@/lib/store"

const MAX_QTY = 10

export function CartView() {
  const { ready, lines, setQty, removeItem } = useCart()
  const wishlist = useWishlist()

  if (!ready) return <div className="min-h-[40vh]" aria-busy="true" />

  const { items, count, subtotal, delivery, total } = cartDetails(lines)

  if (items.length === 0) {
    return (
      <>
        <div className="border border-border bg-surface px-6 py-12 text-center">
          <p className="text-lg font-semibold">Your bag is empty</p>
          <p className="mt-2 text-muted-foreground">Items you add will appear here.</p>
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild>
              <Link href="/shop">Start shopping</Link>
            </Button>
            {wishlist.count > 0 && (
              <Button asChild variant="outline">
                <Link href="/wishlist">View favourites ({wishlist.count})</Link>
              </Button>
            )}
          </div>
        </div>
        <BenefitsStrip compact className="mt-10" />
      </>
    )
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
        {/* Items */}
        <section aria-labelledby="items-h" className="min-w-0 lg:col-span-8">
          <h2 id="items-h" className="sr-only">
            Items in your bag
          </h2>
          <p className="mb-4 text-[15px] text-muted-foreground">
            {count} {count === 1 ? "item" : "items"}
          </p>
          <ul className="divide-y divide-border border-y border-border">
            {items.map((item) => {
              const { product: p } = item
              return (
                <li key={item.key} className="flex gap-4 py-6 sm:gap-6">
                  <Link href={`/product/${p.id}`} className="w-24 shrink-0 sm:w-32" tabIndex={-1} aria-hidden>
                    <Photo
                      imageKey={`product:${p.id}`}
                      alt=""
                      hex={item.hex}
                      sizes="128px"
                      className="aspect-[4/5]"
                    />
                  </Link>

                  <div className="flex min-w-0 flex-1 flex-col gap-3">
                    <div className="flex flex-wrap justify-between gap-x-4 gap-y-1">
                      <div className="min-w-0">
                        <Link href={`/product/${p.id}`} className="text-base font-semibold hover:underline hover:underline-offset-4">
                          {p.name}
                        </Link>
                        <p className="text-[15px] text-muted-foreground">
                          {item.colour} · Size {item.size}
                        </p>
                        <p className="text-[15px]">
                          {item.wasPrice !== undefined ? (
                            <>
                              <span className="text-sale">
                                <span className="sr-only">Sale price </span>
                                {formatPrice(item.unitPrice)}
                              </span>{" "}
                              <s className="text-sm text-muted-foreground">
                                <span className="sr-only">was </span>
                                {formatPrice(item.wasPrice)}
                              </s>
                            </>
                          ) : (
                            formatPrice(item.unitPrice)
                          )}{" "}
                          <span className="text-muted-foreground">each</span>
                        </p>
                        <p className="text-[15px] text-muted-foreground">
                          Buy-back value up to {formatPrice(maxBuyback(item.unitPrice))}
                          {item.qty > 1 && " each"}
                        </p>
                      </div>
                      <p className="text-base font-semibold">{formatPrice(item.lineTotal)}</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                      {/* Quantity stepper */}
                      <div className="inline-flex items-center border border-input" role="group" aria-label={`Quantity for ${p.name}`}>
                        <button
                          type="button"
                          className="inline-flex size-12 items-center justify-center hover:bg-surface disabled:opacity-40"
                          onClick={() => setQty(item.key, item.qty - 1)}
                          disabled={item.qty <= 1}
                          aria-label={`Decrease quantity of ${p.name}`}
                        >
                          <Minus aria-hidden className="size-4" />
                        </button>
                        <span className="w-10 text-center text-base font-semibold" aria-live="polite">
                          <span className="sr-only">Quantity </span>
                          {item.qty}
                        </span>
                        <button
                          type="button"
                          className="inline-flex size-12 items-center justify-center hover:bg-surface disabled:opacity-40"
                          onClick={() => setQty(item.key, item.qty + 1)}
                          disabled={item.qty >= MAX_QTY}
                          aria-label={`Increase quantity of ${p.name}`}
                        >
                          <Plus aria-hidden className="size-4" />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeItem(item.key)}
                        className="inline-flex min-h-12 items-center text-[15px] font-medium underline underline-offset-4"
                      >
                        Remove<span className="sr-only"> {p.name}</span>
                      </button>
                      {!wishlist.has(p.id) && (
                        <button
                          type="button"
                          onClick={() => {
                            wishlist.toggle(p.id)
                            removeItem(item.key)
                          }}
                          className="inline-flex min-h-12 items-center text-[15px] font-medium underline underline-offset-4"
                        >
                          Move to favourites<span className="sr-only">: {p.name}</span>
                        </button>
                      )}
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>
          <Link href="/shop" className="mt-6 inline-flex min-h-12 items-center text-base font-medium underline underline-offset-4">
            Continue shopping
          </Link>
        </section>

        {/* Summary */}
        <aside aria-labelledby="summary-h" className="min-w-0 lg:col-span-4">
          <div className="border border-border bg-surface p-6 lg:sticky lg:top-[136px]">
            <h2 id="summary-h" className="text-xl">
              Order summary
            </h2>
            <div className="mt-4">
              <OrderTotals
                subtotal={subtotal}
                delivery={delivery}
                total={total}
                deliveryLabel={DELIVERY_OPTIONS.standard.label}
                showFreeDeliveryHint
              />
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              You can choose express delivery at checkout.
            </p>
            <Button asChild size="block" className="mt-6">
              <Link href="/checkout">Go to checkout</Link>
            </Button>
            <p className="mt-3 text-sm text-muted-foreground">
              Prototype store: no payment is taken and no real order is placed.
            </p>
          </div>
        </aside>
      </div>

      <BenefitsStrip compact className="mt-12" />
    </>
  )
}
