/*
 * SAMPLE DATA: the "My Drip Wardrobe" demo account. Prototype only.
 *
 * Dates are fixed so the page is the same on every build. Months left in the
 * buy-back window are counted from SAMPLE_TODAY, not the real clock.
 */
import { BUYBACK_MONTHS } from "@/lib/buyback"
import { getProduct, type Product } from "@/lib/products"

/** The "today" the sample account is shown as of. */
export const SAMPLE_TODAY = "2026-11-21"

type WardrobeEntry = { productId: string; colour: string; size: string; purchased: string; pricePaid: number }

const ENTRIES: WardrobeEntry[] = [
  { productId: "merino-crew-jumper", colour: "Navy", size: "M", purchased: "2026-08-14", pricePaid: 28 }, // ~3 months ago
  { productId: "straight-jeans", colour: "Mid blue", size: "M", purchased: "2026-01-09", pricePaid: 25 }, // ~10 months ago
  { productId: "classic-hoodie", colour: "Light grey", size: "L", purchased: "2025-06-02", pricePaid: 20 }, // ~17 months ago
  { productId: "wool-blend-coat", colour: "Camel", size: "S", purchased: "2025-03-28", pricePaid: 35 }, // ~20 months ago
]

/** Whole months between two ISO dates. */
function monthsBetween(fromIso: string, toIso: string) {
  const a = new Date(fromIso + "T00:00:00Z")
  const b = new Date(toIso + "T00:00:00Z")
  let m = (b.getUTCFullYear() - a.getUTCFullYear()) * 12 + (b.getUTCMonth() - a.getUTCMonth())
  if (b.getUTCDate() < a.getUTCDate()) m -= 1
  return m
}

export type WardrobeItem = WardrobeEntry & {
  product: Product
  hex: string
  monthsOwned: number
  monthsLeft: number
}

export const wardrobe: WardrobeItem[] = ENTRIES.flatMap((e) => {
  const product = getProduct(e.productId)
  if (!product) return []
  const monthsOwned = monthsBetween(e.purchased, SAMPLE_TODAY)
  return [
    {
      ...e,
      product,
      hex: product.colours.find((c) => c.name === e.colour)?.hex ?? product.colours[0].hex,
      monthsOwned,
      monthsLeft: Math.max(0, BUYBACK_MONTHS - monthsOwned),
    },
  ]
})

export const getWardrobeItem = (productId: string) => wardrobe.find((w) => w.productId === productId)

const dateFmt = new Intl.DateTimeFormat("en-IE", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" })
export const formatDate = (iso: string) => dateFmt.format(new Date(iso + "T00:00:00Z"))
