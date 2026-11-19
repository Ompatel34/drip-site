/*
 * The 7 pieces on the homepage clothing rail, taken from products.ts.
 * Only tops and outerwear (the rail can draw tee, knit, hoodie, shirt, jacket,
 * coat). Edit RAIL_PICKS to change what hangs on the rail; `colour` must be
 * one of that product's colour names.
 */
import type { RailGarment } from "@/components/ui/product-rail-gallery"
import { colourSlug, currentPrice, formatPrice, getProduct, railKind } from "@/lib/products"

const RAIL_PICKS: { id: string; colour: string }[] = [
  { id: "wool-blend-coat", colour: "Camel" }, // women, coat
  { id: "oxford-shirt", colour: "Sky blue" }, // men, shirt
  { id: "merino-crew-jumper", colour: "Navy" }, // women, knit
  { id: "classic-hoodie", colour: "Light grey" }, // unisex, hoodie
  { id: "canvas-chore-jacket", colour: "Sand" }, // men, jacket
  { id: "everyday-tee", colour: "Black" }, // unisex, tee
  { id: "corduroy-overshirt", colour: "Chocolate" }, // unisex, shirt
]

const firstSentence = (s: string) => (s.match(/^.*?[.!?](\s|$)/)?.[0] ?? s).trim()

/** "Relaxed fit, sits below the knee. Model is..." -> "Relaxed fit" */
const shortFit = (fit: string) => fit.split(/[.,]/)[0].trim()

export function railItems(): RailGarment[] {
  return RAIL_PICKS.flatMap(({ id, colour }) => {
    const p = getProduct(id)
    const kind = p ? railKind[p.category] : undefined
    if (!p || !kind) {
      console.warn(`Rail: skipped ${id} (unknown product or not a top / outerwear)`)
      return []
    }
    const swatch = p.colours.find((c) => c.name === colour) ?? p.colours[0]
    const s = p.sustainability
    return [
      {
        id: p.id,
        name: `${p.name} · ${swatch.name}`,
        kind,
        color: swatch.hex,
        tag: formatPrice(currentPrice(p)),
        description: firstSentence(p.description),
        details: [
          s.recycledPercent > 0 ? `${s.recycledPercent}% recycled fibre` : p.material,
          shortFit(p.fit),
          `Made in ${s.factoryCountry}`,
        ],
        href: `/product/${p.id}?colour=${colourSlug(swatch.name)}`,
      },
    ]
  })
}
