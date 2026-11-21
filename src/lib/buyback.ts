/*
 * The Drip Buy-back promise. Every page reads its numbers from here; do not
 * hard-code buy-back amounts anywhere else.
 *
 * Within 2 years of purchase, Drip buys an item back for a fixed share of the
 * price paid, depending on condition. Credit spent on Pre-loved gets 20% extra.
 * All values are rounded to the nearest €0.50.
 */

export type Grade = "like-new" | "very-good" | "good" | "worn-out"

/** Share of the price paid, by condition. */
export const BUYBACK_RATES: Record<Grade, number> = {
  "like-new": 0.4,
  "very-good": 0.3,
  good: 0.2,
  "worn-out": 0,
}

export const GRADE_LABELS: Record<Grade, string> = {
  "like-new": "Like new",
  "very-good": "Very good",
  good: "Good",
  "worn-out": "Worn out",
}

/** The grades that earn credit, best first. */
export const PAID_GRADES: Grade[] = ["like-new", "very-good", "good"]

/** Extra when the credit is spent on Pre-loved (0.2 = +20%). */
export const PRELOVED_BONUS = 0.2

/** How long the promise lasts after purchase. */
export const BUYBACK_MONTHS = 24

/** Round to the nearest €0.50. */
export const roundHalfEuro = (n: number) => Math.round(n * 2) / 2

export type BuybackValue = { grade: Grade; label: string; rate: number; value: number; preloved: number }

/** Credit for one grade: cash value and the Pre-loved value (+20%), both rounded. */
export function buybackFor(price: number, grade: Grade): BuybackValue {
  const raw = price * BUYBACK_RATES[grade]
  return {
    grade,
    label: GRADE_LABELS[grade],
    rate: BUYBACK_RATES[grade],
    value: roundHalfEuro(raw),
    preloved: roundHalfEuro(raw * (1 + PRELOVED_BONUS)),
  }
}

/** The three paid values (like new, very good, good) for a price paid. */
export function buybackValues(price: number): BuybackValue[] {
  return PAID_GRADES.map((g) => buybackFor(price, g))
}

/** Best possible value (like new), for "up to €X" lines. */
export const maxBuyback = (price: number) => buybackFor(price, "like-new").value

/** Condition checklist used by Snap & Quote. */
export const CONDITION_ISSUES = [
  { id: "stains", label: "Stains or marks" },
  { id: "holes", label: "Holes or tears" },
  { id: "pilling", label: "Pilling (small bobbles on the fabric)" },
  { id: "faded", label: "Faded colour" },
  { id: "stretched", label: "Stretched or out of shape" },
] as const

/** 0 issues = Like new, 1 = Very good, 2 = Good, 3 or more = Worn out. */
export function gradeFromIssues(count: number): Grade {
  if (count <= 0) return "like-new"
  if (count === 1) return "very-good"
  if (count === 2) return "good"
  return "worn-out"
}

/** Plain-language summary used in several places. */
export const PROMISE_LINE = `Sell it back to Drip within ${BUYBACK_MONTHS / 12} years. +${Math.round(PRELOVED_BONUS * 100)}% if you spend it on Pre-loved.`

const pct = (n: number) => `${Math.round(n * 100)}%`

/** "40% if like new, 30% if very good or 20% if good" */
export const RATES_SUMMARY = PAID_GRADES.map((g, i) => `${i === PAID_GRADES.length - 1 ? "or " : ""}${pct(BUYBACK_RATES[g])} if ${GRADE_LABELS[g].toLowerCase()}`)
  .join(", ")
  .replace(", or", " or")

/** "up to 40%" */
export const MAX_RATE = pct(BUYBACK_RATES["like-new"])
export const BONUS_PCT = pct(PRELOVED_BONUS)
