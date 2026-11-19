"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { cn } from "cn"

import { Button } from "@/components/ui/button"
import { OrderTotals } from "@/components/site/order-totals"
import { Photo } from "@/components/site/photo"
import { useCart } from "@/components/site/store-provider"
import { cartDetails } from "@/lib/cart"
import {
  addWorkingDays,
  COUNTIES,
  emptyCheckout,
  formatEircode,
  makeOrderNumber,
  saveOrder,
  validateAll,
  validateField,
  type CheckoutValues,
  type FieldName,
} from "@/lib/checkout"
import { formatPrice } from "@/lib/products"
import { DELIVERY_OPTIONS, deliveryCost, FREE_DELIVERY_THRESHOLD, type DeliveryMethod } from "@/lib/store"

const LABELS: Record<FieldName, string> = {
  email: "Email address",
  phone: "Phone number (optional)",
  firstName: "First name",
  lastName: "Last name",
  address1: "Address line 1",
  address2: "Address line 2 (optional)",
  town: "Town or city",
  county: "County",
  eircode: "Eircode",
}

const inputClass = (invalid: boolean) =>
  cn(
    "h-12 w-full rounded-sm border bg-background px-4 text-base text-foreground placeholder:text-muted-foreground",
    "focus-visible:border-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
    invalid ? "border-sale" : "border-input"
  )

const dayFmt = new Intl.DateTimeFormat("en-IE", { weekday: "short", day: "numeric", month: "short" })

export function CheckoutForm() {
  const router = useRouter()
  const { ready, lines } = useCart()
  const [values, setValues] = useState<CheckoutValues>(emptyCheckout)
  const [errors, setErrors] = useState<Partial<Record<FieldName, string>>>({})
  const [submitted, setSubmitted] = useState(false)
  const [placing, setPlacing] = useState(false)
  const summaryRef = useRef<HTMLDivElement>(null)
  const [failedAttempts, setFailedAttempts] = useState(0)

  // After a failed submit, move focus to the error summary so keyboard and
  // screen reader users land on the list of problems.
  useEffect(() => {
    if (failedAttempts > 0) summaryRef.current?.focus()
  }, [failedAttempts])

  if (!ready) return <div className="min-h-[40vh]" aria-busy="true" />

  const { items, subtotal, delivery, total } = cartDetails(lines, values.method)

  if (items.length === 0 && !placing) {
    return (
      <div className="border border-border bg-surface px-6 py-12 text-center">
        <p className="text-lg font-semibold">Your bag is empty</p>
        <p className="mt-2 text-muted-foreground">Add something to your bag before checking out.</p>
        <Button asChild className="mt-6">
          <Link href="/shop">Start shopping</Link>
        </Button>
      </div>
    )
  }

  const update = (name: FieldName, value: string) => {
    setValues((v) => ({ ...v, [name]: value }))
    // After the first submit, re-check as the person types so errors clear.
    if (submitted) setErrors((e) => ({ ...e, [name]: validateField(name, value) }))
  }

  const blur = (name: FieldName) => {
    let value = values[name]
    if (name === "eircode" && value) {
      value = formatEircode(value)
      setValues((v) => ({ ...v, eircode: value }))
    }
    if (submitted || value) setErrors((e) => ({ ...e, [name]: validateField(name, value) }))
  }

  const field = (name: FieldName, opts: { autoComplete: string; type?: string; inputMode?: "email" | "tel" | "text"; hint?: string; className?: string }) => {
    const id = `co-${name}`
    const err = errors[name]
    const hintId = opts.hint ? `${id}-hint` : undefined
    const errId = err ? `${id}-error` : undefined
    return (
      <div className={cn("flex flex-col gap-1.5", opts.className)}>
        <label htmlFor={id} className="text-[15px] font-medium">
          {LABELS[name]}
        </label>
        {opts.hint && (
          <p id={hintId} className="text-sm text-muted-foreground">
            {opts.hint}
          </p>
        )}
        <input
          id={id}
          name={name}
          type={opts.type ?? "text"}
          inputMode={opts.inputMode}
          autoComplete={opts.autoComplete}
          value={values[name]}
          onChange={(e) => update(name, e.target.value)}
          onBlur={() => blur(name)}
          aria-invalid={err ? true : undefined}
          aria-describedby={[hintId, errId].filter(Boolean).join(" ") || undefined}
          className={inputClass(Boolean(err))}
        />
        {err && (
          <p id={errId} className="text-sm font-medium text-sale">
            {err}
          </p>
        )}
      </div>
    )
  }

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    const v = { ...values, eircode: formatEircode(values.eircode) }
    setValues(v)
    const errs = validateAll(v)
    setErrors(errs)
    if (Object.keys(errs).length) {
      setFailedAttempts((n) => n + 1)
      return
    }

    setPlacing(true)
    const { items: its, subtotal: sub, delivery: del, total: tot } = cartDetails(lines, v.method)
    saveOrder({
      number: makeOrderNumber(),
      placedAt: new Date().toISOString(),
      items: its.map((i) => ({
        name: i.product.name,
        productId: i.productId,
        colour: i.colour,
        size: i.size,
        qty: i.qty,
        unitPrice: i.unitPrice,
        lineTotal: i.lineTotal,
      })),
      subtotal: sub,
      delivery: del,
      total: tot,
      method: v.method,
      name: `${v.firstName.trim()} ${v.lastName.trim()}`,
      email: v.email.trim(),
      address: [v.address1, v.address2, v.town, `Co. ${v.county}`, v.eircode, "Ireland"].map((s) => s.trim()).filter(Boolean),
    })
    router.push("/order-confirmed")
  }

  const errorList = (Object.keys(errors) as FieldName[]).filter((k) => errors[k])
  const today = new Date()
  const eta = (m: DeliveryMethod) => {
    const [a, b] = m === "standard" ? [2, 4] : [1, 2]
    return `${dayFmt.format(addWorkingDays(today, a))} – ${dayFmt.format(addWorkingDays(today, b))}`
  }

  return (
    <form noValidate onSubmit={onSubmit} className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
      <div className="min-w-0 lg:col-span-7">
        {submitted && errorList.length > 0 && (
          <div
            ref={summaryRef}
            tabIndex={-1}
            role="alert"
            aria-labelledby="error-summary-h"
            className="mb-8 border-2 border-sale p-5"
          >
            <h2 id="error-summary-h" className="text-lg text-sale">
              Please fix {errorList.length === 1 ? "1 problem" : `${errorList.length} problems`}
            </h2>
            <ul className="mt-2 space-y-1">
              {errorList.map((k) => (
                <li key={k}>
                  <a href={`#co-${k}`} className="text-[15px] font-medium text-sale underline underline-offset-4">
                    {errors[k]}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        <fieldset className="border-t border-border pt-6">
          <legend className="float-left w-full font-heading text-2xl font-semibold">1. Contact details</legend>
          <div className="clear-both grid gap-5 pt-5 sm:grid-cols-2">
            {field("email", { autoComplete: "email", type: "email", inputMode: "email", hint: "For your order updates.", className: "sm:col-span-2" })}
            {field("phone", { autoComplete: "tel", type: "tel", inputMode: "tel", hint: "Only used by the courier.", className: "sm:col-span-2" })}
          </div>
        </fieldset>

        <fieldset className="mt-10 border-t border-border pt-6">
          <legend className="float-left w-full font-heading text-2xl font-semibold">2. Delivery address</legend>
          <div className="clear-both grid gap-5 pt-5 sm:grid-cols-2">
            {field("firstName", { autoComplete: "given-name" })}
            {field("lastName", { autoComplete: "family-name" })}
            {field("address1", { autoComplete: "address-line1", className: "sm:col-span-2" })}
            {field("address2", { autoComplete: "address-line2", className: "sm:col-span-2" })}
            {field("town", { autoComplete: "address-level2" })}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="co-county" className="text-[15px] font-medium">
                {LABELS.county}
              </label>
              <select
                id="co-county"
                name="county"
                autoComplete="address-level1"
                value={values.county}
                onChange={(e) => {
                  update("county", e.target.value)
                  if (submitted || e.target.value) setErrors((er) => ({ ...er, county: validateField("county", e.target.value) }))
                }}
                aria-invalid={errors.county ? true : undefined}
                aria-describedby={errors.county ? "co-county-error" : undefined}
                className={inputClass(Boolean(errors.county))}
              >
                <option value="">Choose a county</option>
                {COUNTIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              {errors.county && (
                <p id="co-county-error" className="text-sm font-medium text-sale">
                  {errors.county}
                </p>
              )}
            </div>
            {field("eircode", { autoComplete: "postal-code", hint: "7 characters, for example D02 X285.", className: "sm:col-span-1" })}
            <div className="flex flex-col gap-1.5">
              <span className="text-[15px] font-medium">Country</span>
              <p className="flex h-12 items-center text-base">Ireland</p>
            </div>
          </div>
        </fieldset>

        <fieldset className="mt-10 border-t border-border pt-6">
          <legend className="float-left w-full font-heading text-2xl font-semibold">3. Delivery method</legend>
          <div className="clear-both grid gap-3 pt-5">
            {(Object.keys(DELIVERY_OPTIONS) as DeliveryMethod[]).map((m) => {
              const opt = DELIVERY_OPTIONS[m]
              const cost = deliveryCost(subtotal, m)
              return (
                <label key={m} className="cursor-pointer">
                  <input
                    type="radio"
                    name="method"
                    value={m}
                    checked={values.method === m}
                    onChange={() => setValues((v) => ({ ...v, method: m }))}
                    className="peer sr-only"
                  />
                  <span className="flex min-h-16 items-center justify-between gap-4 rounded-sm border border-input px-4 py-3 peer-checked:border-2 peer-checked:border-foreground peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ring">
                    <span className="flex items-center gap-3">
                      <span aria-hidden className="grid size-5 shrink-0 place-items-center rounded-full border-2 border-foreground">
                        {values.method === m && <span className="size-2.5 rounded-full bg-foreground" />}
                      </span>
                      <span>
                        <span className="block text-base font-semibold">{opt.label}</span>
                        <span className="block text-[15px] text-muted-foreground">
                          {opt.days} · arrives {eta(m)}
                        </span>
                      </span>
                    </span>
                    <span className="shrink-0 text-base font-semibold">{cost === 0 ? "Free" : formatPrice(cost)}</span>
                  </span>
                </label>
              )
            })}
            {subtotal < FREE_DELIVERY_THRESHOLD && (
              <p className="text-[15px] text-muted-foreground">
                Standard delivery is free on orders over {formatPrice(FREE_DELIVERY_THRESHOLD)}.
              </p>
            )}
          </div>
        </fieldset>

        <div className="mt-10 border-t border-border pt-6">
          <h2 className="font-heading text-2xl">4. Place your order</h2>
          <p className="measure mt-2 text-base text-muted-foreground">
            This is a prototype store. There is no payment step: no card details are asked for, nothing is charged and no real order is created.
          </p>
          <Button type="submit" size="block" className="mt-6" disabled={placing}>
            {placing ? "Placing order…" : "Place order (prototype)"}
          </Button>
        </div>
      </div>

      {/* Order summary */}
      <aside aria-labelledby="co-summary-h" className="min-w-0 lg:col-span-5">
        <div className="border border-border bg-surface p-6 lg:sticky lg:top-[136px]">
          <div className="flex items-baseline justify-between gap-4">
            <h2 id="co-summary-h" className="text-xl">
              Order summary
            </h2>
            <Link href="/cart" className="text-[15px] font-medium underline underline-offset-4">
              Edit bag
            </Link>
          </div>
          <ul className="mt-4 divide-y divide-border border-y border-border">
            {items.map((i) => (
              <li key={i.key} className="flex gap-3 py-3">
                <Photo imageKey={`product:${i.productId}`} alt="" hex={i.hex} sizes="56px" className="aspect-[4/5] w-14 shrink-0" />
                <div className="min-w-0 flex-1 text-[15px]">
                  <p className="font-medium">{i.product.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {i.colour} · {i.size} · Qty {i.qty}
                  </p>
                </div>
                <p className="shrink-0 text-[15px] font-semibold">{formatPrice(i.lineTotal)}</p>
              </li>
            ))}
          </ul>
          <div className="mt-4">
            <OrderTotals subtotal={subtotal} delivery={delivery} total={total} deliveryLabel={DELIVERY_OPTIONS[values.method].label} />
          </div>
        </div>
      </aside>
    </form>
  )
}
