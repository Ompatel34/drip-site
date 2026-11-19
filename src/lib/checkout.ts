/*
 * Checkout helpers: Irish address validation and the prototype "order".
 * Nothing here sends data anywhere. There is no payment step.
 */
import type { DeliveryMethod } from "@/lib/store"

export const COUNTIES = [
  "Carlow", "Cavan", "Clare", "Cork", "Donegal", "Dublin", "Galway", "Kerry", "Kildare",
  "Kilkenny", "Laois", "Leitrim", "Limerick", "Longford", "Louth", "Mayo", "Meath",
  "Monaghan", "Offaly", "Roscommon", "Sligo", "Tipperary", "Waterford", "Westmeath",
  "Wexford", "Wicklow",
] as const

export type CheckoutValues = {
  email: string
  phone: string
  firstName: string
  lastName: string
  address1: string
  address2: string
  town: string
  county: string
  eircode: string
  method: DeliveryMethod
}

export type FieldName = Exclude<keyof CheckoutValues, "method">

export const emptyCheckout: CheckoutValues = {
  email: "",
  phone: "",
  firstName: "",
  lastName: "",
  address1: "",
  address2: "",
  town: "",
  county: "",
  eircode: "",
  method: "standard",
}

/*
 * Eircode: a 3-character routing key (letter + 2 digits, or D6W) and a
 * 4-character unique identifier, e.g. "D02 X285" or "A65F4E2".
 */
const EIRCODE = /^(?:[AC-FHKNPRTV-Y]\d{2}|D6W)\s?[0-9AC-FHKNPRTV-Y]{4}$/i

export const formatEircode = (v: string) => {
  const s = v.replace(/\s+/g, "").toUpperCase()
  return s.length === 7 ? `${s.slice(0, 3)} ${s.slice(3)}` : v.trim().toUpperCase()
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
/** Irish mobile or landline: 08x xxx xxxx, 01 xxx xxxx, +353 ... */
const PHONE = /^(?:\+353|00353|0)\d{7,9}$/

export function validateField(name: FieldName, raw: string): string | undefined {
  const v = raw.trim()
  switch (name) {
    case "email":
      if (!v) return "Enter your email address."
      if (!EMAIL.test(v)) return "Enter an email address like name@example.ie."
      return
    case "phone": {
      if (!v) return // optional
      const digits = v.replace(/[\s()-]/g, "")
      if (!PHONE.test(digits)) return "Enter an Irish phone number, like 087 123 4567."
      return
    }
    case "firstName":
      return v ? undefined : "Enter your first name."
    case "lastName":
      return v ? undefined : "Enter your last name."
    case "address1":
      return v ? undefined : "Enter the first line of your address."
    case "address2":
      return
    case "town":
      return v ? undefined : "Enter your town or city."
    case "county":
      return (COUNTIES as readonly string[]).includes(v) ? undefined : "Choose your county."
    case "eircode":
      if (!v) return "Enter your Eircode."
      if (!EIRCODE.test(v)) return "Enter a valid Eircode, like D02 X285."
      return
  }
}

export function validateAll(values: CheckoutValues) {
  const errors: Partial<Record<FieldName, string>> = {}
  for (const name of Object.keys(values) as (keyof CheckoutValues)[]) {
    if (name === "method") continue
    const err = validateField(name, values[name])
    if (err) errors[name] = err
  }
  return errors
}

/* ------------------------------------------------------------------ */
/* Prototype order (kept in this browser tab only)                     */

export type OrderItem = { name: string; productId: string; colour: string; size: string; qty: number; unitPrice: number; lineTotal: number }

export type Order = {
  number: string
  placedAt: string
  items: OrderItem[]
  subtotal: number
  delivery: number
  total: number
  method: DeliveryMethod
  name: string
  email: string
  address: string[]
}

const ORDER_KEY = "drip-last-order-v1"

/** e.g. DRP-482913 (random, not sequential) */
export function makeOrderNumber() {
  const n = new Uint32Array(1)
  crypto.getRandomValues(n)
  return `DRP-${String(100000 + (n[0] % 900000))}`
}

export function saveOrder(order: Order) {
  try {
    sessionStorage.setItem(ORDER_KEY, JSON.stringify(order))
  } catch {
    // ignore: the confirmation page explains if it can't find the order
  }
}

export function loadOrder(): Order | null {
  try {
    const raw = sessionStorage.getItem(ORDER_KEY)
    return raw ? (JSON.parse(raw) as Order) : null
  } catch {
    return null
  }
}

/** Working days from today, skipping weekends. */
export function addWorkingDays(from: Date, days: number) {
  const d = new Date(from)
  let added = 0
  while (added < days) {
    d.setDate(d.getDate() + 1)
    if (d.getDay() !== 0 && d.getDay() !== 6) added++
  }
  return d
}
