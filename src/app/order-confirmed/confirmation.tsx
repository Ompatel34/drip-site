"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { CheckCircle2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { OrderTotals } from "@/components/site/order-totals"
import { Photo } from "@/components/site/photo"
import { useCart } from "@/components/site/store-provider"
import { addWorkingDays, loadOrder, type Order } from "@/lib/checkout"
import { formatPrice, getProduct } from "@/lib/products"
import { DELIVERY_OPTIONS } from "@/lib/store"

const dayFmt = new Intl.DateTimeFormat("en-IE", { weekday: "long", day: "numeric", month: "long" })

export function Confirmation() {
  const { ready, clear } = useCart()
  const [order, setOrder] = useState<Order | null | undefined>(undefined)

  // Read the order saved by checkout, then empty the bag (once).
  useEffect(() => {
    if (!ready) return
    // eslint-disable-next-line react-hooks/set-state-in-effect -- read once from sessionStorage after mount
    setOrder(loadOrder())
    clear()
  }, [ready, clear])

  if (order === undefined) return <div className="min-h-[40vh]" aria-busy="true" />

  if (!order) {
    return (
      <div className="border border-border bg-surface px-6 py-12 text-center">
        <p className="text-lg font-semibold">We can&apos;t find a recent order</p>
        <p className="mt-2 text-muted-foreground">Orders are only kept in this browser tab, and this is a prototype store.</p>
        <Button asChild className="mt-6">
          <Link href="/shop">Go to the shop</Link>
        </Button>
      </div>
    )
  }

  const placed = new Date(order.placedAt)
  const [a, b] = order.method === "standard" ? [2, 4] : [1, 2]
  const firstName = order.name.split(" ")[0]

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
      <div className="min-w-0 lg:col-span-7">
        <div className="flex items-start gap-3">
          <CheckCircle2 aria-hidden className="mt-1 size-7 shrink-0 text-success" strokeWidth={1.75} />
          <div>
            <p className="label-caps text-success">Order confirmed</p>
            <h2 className="mt-1 text-[28px] leading-tight lg:text-[32px]">Thank you, {firstName}</h2>
          </div>
        </div>

        <dl className="mt-6 grid gap-4 border-y border-border py-5 sm:grid-cols-2">
          <div>
            <dt className="text-[15px] text-muted-foreground">Order number</dt>
            <dd className="text-xl font-semibold tracking-wide">{order.number}</dd>
          </div>
          <div>
            <dt className="text-[15px] text-muted-foreground">Estimated delivery</dt>
            <dd className="text-base font-semibold">
              {dayFmt.format(addWorkingDays(placed, a))} to {dayFmt.format(addWorkingDays(placed, b))}
            </dd>
          </div>
        </dl>

        <p role="note" className="mt-6 border border-border bg-surface px-4 py-3 text-[15px]">
          <span className="font-semibold">This is a prototype order.</span> No payment was taken, nothing will be
          shipped and no email has been sent. In a real store, a confirmation would go to {order.email}.
        </p>

        <section aria-labelledby="deliver-h" className="mt-8">
          <h3 id="deliver-h" className="text-base">
            Delivering to
          </h3>
          <address className="mt-2 text-base text-muted-foreground not-italic">
            {order.name}
            {order.address.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </address>
          <p className="mt-3 text-[15px]">
            <span className="font-semibold">{DELIVERY_OPTIONS[order.method].label}</span>{" "}
            <span className="text-muted-foreground">({DELIVERY_OPTIONS[order.method].days})</span>
          </p>
        </section>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Button asChild>
            <Link href="/shop">Continue shopping</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/returns">Returns policy</Link>
          </Button>
        </div>
      </div>

      <aside aria-labelledby="oc-summary-h" className="min-w-0 lg:col-span-5">
        <div className="border border-border bg-surface p-6">
          <h2 id="oc-summary-h" className="text-xl">
            Order summary
          </h2>
          <ul className="mt-4 divide-y divide-border border-y border-border">
            {order.items.map((i) => {
              const p = getProduct(i.productId)
              const hex = p?.colours.find((c) => c.name === i.colour)?.hex ?? p?.colours[0].hex
              return (
                <li key={`${i.productId}|${i.colour}|${i.size}`} className="flex gap-3 py-3">
                  <Photo imageKey={`product:${i.productId}`} alt="" hex={hex} sizes="56px" className="aspect-[4/5] w-14 shrink-0" />
                  <div className="min-w-0 flex-1 text-[15px]">
                    <p className="font-medium">{i.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {i.colour} · {i.size} · Qty {i.qty}
                    </p>
                  </div>
                  <p className="shrink-0 text-[15px] font-semibold">{formatPrice(i.lineTotal)}</p>
                </li>
              )
            })}
          </ul>
          <div className="mt-4">
            <OrderTotals
              subtotal={order.subtotal}
              delivery={order.delivery}
              total={order.total}
              deliveryLabel={DELIVERY_OPTIONS[order.method].label}
            />
          </div>
        </div>
      </aside>
    </div>
  )
}
