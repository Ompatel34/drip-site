/*
 * SAMPLE DATA. Fictional impact figures for the Drip prototype.
 *
 * Collection averages are worked out from the product data in products.ts,
 * so they change if you edit products. The take-back and repair figures
 * below are fixed sample numbers; edit them here.
 */
import { products } from "@/lib/products"

const round1 = (n: number) => Math.round(n * 10) / 10
const avg = (xs: number[]) => xs.reduce((a, b) => a + b, 0) / Math.max(xs.length, 1)

/* ------------------------------------------------------------------ */
/* Worked out from the catalogue                                       */

export const collection = {
  productCount: products.length,
  avgRecycledPercent: Math.round(avg(products.map((p) => p.sustainability.recycledPercent))),
  productsWithRecycled: products.filter((p) => p.sustainability.recycledPercent > 0).length,
  avgWaterLitres: Math.round(avg(products.map((p) => p.sustainability.waterLitres)) / 10) * 10,
  avgCo2Kg: round1(avg(products.map((p) => p.sustainability.co2Kg))),
}

/** Factory countries with the number of products made there. */
export const factoryCountries = Object.entries(
  products.reduce<Record<string, number>>((m, p) => {
    m[p.sustainability.factoryCountry] = (m[p.sustainability.factoryCountry] ?? 0) + 1
    return m
  }, {})
)
  .map(([country, count]) => ({ country, count }))
  .sort((a, b) => b.count - a.count || a.country.localeCompare(b.country))

/** One entry per fabric (same composition and source), with the products that use it. */
export const fabrics = Object.values(
  products.reduce<
    Record<string, { label: string; composition: string; source: string; recycledPercent: number; care: string; products: { id: string; name: string }[] }>
  >((m, p) => {
    const key = `${p.composition}|${p.sustainability.materialSource}`
    m[key] ??= {
      label: p.material,
      composition: p.composition,
      source: p.sustainability.materialSource,
      recycledPercent: p.sustainability.recycledPercent,
      care: p.care,
      products: [],
    }
    m[key].products.push({ id: p.id, name: p.name })
    return m
  }, {})
).sort((a, b) => b.products.length - a.products.length)

/* ------------------------------------------------------------------ */
/* Fixed sample figures                                                */

export const takeBack = {
  year: 2025,
  itemsReturned: 12400,
  resoldPercent: 61,
  recycledPercent: 33,
  respunPercent: 6,
  hub: "Dublin 12",
}

export const repairs = {
  year: 2025,
  repairsDone: 3100,
  freeRepairMonths: 12,
}

export const targets = {
  recycledPercentBy2028: 50,
  co2ReductionPercentBy2030: 30,
  baselineYear: 2024,
}

export const nf = new Intl.NumberFormat("en-IE")
