/*
 * Shop filtering, sorting and search. Shared by the server-rendered /shop
 * page and the client filter drawer (for its live "Show N results" count).
 *
 * URL params (all optional, lists are comma separated):
 *   q=search words  dept=women  category=dresses,skirts  gender=women,unisex
 *   size=M,L  colour=blue,black  min=20  max=80  badge=new|bestseller  sale=1
 *   sort=newest|price-asc|price-desc|bestsellers
 */
import {
  categoryLabels,
  currentPrice,
  departments,
  isOnSale,
  products,
  type Category,
  type Department,
  type Gender,
  type Product,
  type Swatch,
} from "@/lib/products"
import { PRICE_MAX, PRICE_MIN } from "@/lib/store"

/* ------------------------------------------------------------------ */
/* Colour families: each swatch name maps to one family for filtering  */

export const colourFamilies = [
  { slug: "black", name: "Black", hex: "#16181B" },
  { slug: "grey", name: "Grey", hex: "#A7A8A6" },
  { slug: "white", name: "White and cream", hex: "#F3EFE6" },
  { slug: "brown", name: "Beige and brown", hex: "#B48E64" },
  { slug: "blue", name: "Blue", hex: "#5B7590" },
  { slug: "green", name: "Green", hex: "#8E9A92" },
  { slug: "pink", name: "Pink and purple", hex: "#C5B8D6" },
  { slug: "red", name: "Red and orange", hex: "#B65A43" },
  { slug: "yellow", name: "Yellow", hex: "#C99A2E" },
] as const

export type ColourFamily = (typeof colourFamilies)[number]["slug"]

/** Add new colour names here when you add them to a product. */
const FAMILY_OF: Record<string, ColourFamily> = {
  Black: "black",
  Charcoal: "grey", "Grey marl": "grey", "Light grey": "grey", "Grey print": "grey", "Grey check": "grey", "Grey mix": "grey",
  White: "white", Cream: "white", Ecru: "white", Ivory: "white", Oatmeal: "white", "Ecru mix": "white",
  Sand: "brown", Stone: "brown", Camel: "brown", Tan: "brown", Chocolate: "brown", Taupe: "brown",
  "Sky blue": "blue", "Light blue": "blue", "Mid blue": "blue", Navy: "blue", Indigo: "blue", "Blue check": "blue",
  Sage: "green", "Sage grey": "green", Khaki: "green", Mint: "green", "Dark teal": "green",
  Blush: "pink", Lilac: "pink", Burgundy: "pink",
  Terracotta: "red", Rust: "red", "Rust check": "red",
  Mustard: "yellow",
}

export const familyOf = (s: Swatch): ColourFamily | undefined => FAMILY_OF[s.name]

/* ------------------------------------------------------------------ */
/* Filters                                                             */

export const SORTS = [
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "bestsellers", label: "Bestsellers" },
] as const
export type Sort = (typeof SORTS)[number]["value"]

export const SIZE_ORDER = ["XS", "S", "M", "L", "XL", "XXL", "One size"]
export const GENDERS: { slug: Gender; name: string }[] = [
  { slug: "women", name: "Women" },
  { slug: "men", name: "Men" },
  { slug: "unisex", name: "Unisex" },
]

export type Filters = {
  q: string
  dept?: Department
  categories: Category[]
  genders: Gender[]
  sizes: string[]
  colours: ColourFamily[]
  min?: number
  max?: number
  badge?: "new" | "bestseller"
  sale: boolean
  sort: Sort
}

type RawParams = Record<string, string | string[] | undefined>

const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? ""
const list = (v: string | string[] | undefined) =>
  first(v)
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
const num = (v: string | string[] | undefined) => {
  const n = Number(first(v))
  return first(v) !== "" && Number.isFinite(n) ? Math.min(PRICE_MAX, Math.max(PRICE_MIN, Math.round(n))) : undefined
}

export function parseFilters(params: RawParams): Filters {
  const dept = first(params.dept)
  const badge = first(params.badge)
  const sort = first(params.sort)
  let min = num(params.min)
  let max = num(params.max)
  if (min !== undefined && max !== undefined && min > max) [min, max] = [max, min]
  return {
    q: first(params.q).trim().slice(0, 80),
    dept: departments.some((d) => d.slug === dept) ? (dept as Department) : undefined,
    categories: list(params.category).filter((c): c is Category => c in categoryLabels),
    genders: list(params.gender).filter((g): g is Gender => GENDERS.some((x) => x.slug === g)),
    sizes: list(params.size).filter((s) => SIZE_ORDER.includes(s)),
    colours: list(params.colour).filter((c): c is ColourFamily => colourFamilies.some((f) => f.slug === c)),
    min,
    max,
    badge: badge === "new" || badge === "bestseller" ? badge : undefined,
    sale: first(params.sale) === "1",
    sort: SORTS.some((s) => s.value === sort) ? (sort as Sort) : "newest",
  }
}

/** Turn filters back into a query string (empty values dropped). */
export function toQuery(f: Partial<Filters>): string {
  const p = new URLSearchParams()
  if (f.q) p.set("q", f.q)
  if (f.dept) p.set("dept", f.dept)
  if (f.categories?.length) p.set("category", f.categories.join(","))
  if (f.genders?.length) p.set("gender", f.genders.join(","))
  if (f.sizes?.length) p.set("size", f.sizes.join(","))
  if (f.colours?.length) p.set("colour", f.colours.join(","))
  if (f.min !== undefined) p.set("min", String(f.min))
  if (f.max !== undefined) p.set("max", String(f.max))
  if (f.badge) p.set("badge", f.badge)
  if (f.sale) p.set("sale", "1")
  if (f.sort && f.sort !== "newest") p.set("sort", f.sort)
  const s = p.toString()
  return s ? `?${s}` : ""
}

export const shopHref = (f: Partial<Filters>) => `/shop${toQuery(f)}`

/* ------------------------------------------------------------------ */
/* Search                                                              */

const searchText = (p: Product) =>
  [
    p.name,
    p.material,
    p.composition,
    p.description,
    categoryLabels[p.category],
    p.category,
    p.department,
    p.gender,
    ...p.colours.map((c) => c.name),
    ...p.colours.map((c) => familyOf(c) ?? ""),
    isOnSale(p) ? "sale" : "",
  ]
    .join(" ")
    .toLowerCase()

/** Every word must match; simple plurals ("dresses", "jeans") also match. */
export function matchesSearch(p: Product, q: string) {
  const words = q.toLowerCase().split(/[^a-z0-9%-]+/).filter((w) => w.length > 1)
  if (!words.length) return true
  const text = searchText(p)
  return words.every((w) => {
    const stems = [w, w.replace(/(es|s)$/, ""), w.replace(/ies$/, "y")]
    return stems.some((s) => s.length > 1 && text.includes(s))
  })
}

/* ------------------------------------------------------------------ */
/* Apply                                                               */

type Key = "categories" | "genders" | "sizes" | "colours" | "price"

/** Filter products. `skip` ignores one filter (used for option counts). */
export function applyFilters(f: Filters, skip?: Key, source: Product[] = products) {
  return source.filter((p) => {
    if (f.q && !matchesSearch(p, f.q)) return false
    if (f.dept && p.department !== f.dept) return false
    if (skip !== "categories" && f.categories.length && !f.categories.includes(p.category)) return false
    if (skip !== "genders" && f.genders.length && !f.genders.includes(p.gender)) return false
    if (skip !== "sizes" && f.sizes.length && !f.sizes.some((s) => p.sizes.includes(s) && !p.soldOut.includes(s))) return false
    if (skip !== "colours" && f.colours.length && !p.colours.some((c) => f.colours.includes(familyOf(c)!))) return false
    if (skip !== "price") {
      const price = currentPrice(p)
      if (f.min !== undefined && price < f.min) return false
      if (f.max !== undefined && price > f.max) return false
    }
    if (f.badge && !p.badges.includes(f.badge)) return false
    if (f.sale && !isOnSale(p)) return false
    return true
  })
}

export function sortProducts(list: Product[], sort: Sort) {
  const out = [...list]
  if (sort === "price-asc") out.sort((a, b) => currentPrice(a) - currentPrice(b) || a.name.localeCompare(b.name))
  else if (sort === "price-desc") out.sort((a, b) => currentPrice(b) - currentPrice(a) || a.name.localeCompare(b.name))
  else if (sort === "bestsellers") out.sort((a, b) => b.sold - a.sold)
  else out.sort((a, b) => b.added.localeCompare(a.added))
  return out
}

/** Options for each filter group with how many products each would show. */
export function facetOptions(f: Filters) {
  const count = <T,>(key: Key, values: T[], test: (p: Product, v: T) => boolean) => {
    const base = applyFilters(f, key)
    return values.map((v) => ({ value: v, count: base.filter((p) => test(p, v)).length }))
  }
  const inDept = products.filter((p) => !f.dept || p.department === f.dept)
  const cats = [...new Set(inDept.map((p) => p.category))]
  return {
    categories: count("categories", cats, (p, c) => p.category === c).map((o) => ({ ...o, label: categoryLabels[o.value] })),
    genders: count("genders", GENDERS.map((g) => g.slug), (p, g) => p.gender === g).map((o) => ({
      ...o,
      label: GENDERS.find((g) => g.slug === o.value)!.name,
    })),
    sizes: count("sizes", SIZE_ORDER, (p, s) => p.sizes.includes(s) && !p.soldOut.includes(s)).filter((o) =>
      inDept.some((p) => p.sizes.includes(o.value))
    ),
    colours: count("colours", colourFamilies.map((c) => c.slug), (p, c) => p.colours.some((s) => familyOf(s) === c)).map((o) => ({
      ...o,
      ...colourFamilies.find((c) => c.slug === o.value)!,
    })),
  }
}

/** Human-readable active filters, each with a link that removes it. */
export function activeChips(f: Filters) {
  const chips: { label: string; href: string }[] = []
  const without = (patch: Partial<Filters>) => shopHref({ ...f, ...patch })
  if (f.q) chips.push({ label: `“${f.q}”`, href: without({ q: "" }) })
  if (f.badge) chips.push({ label: f.badge === "new" ? "New in" : "Bestsellers", href: without({ badge: undefined }) })
  if (f.sale) chips.push({ label: "Sale", href: without({ sale: false }) })
  for (const c of f.categories)
    chips.push({ label: categoryLabels[c], href: without({ categories: f.categories.filter((x) => x !== c) }) })
  for (const g of f.genders)
    chips.push({ label: GENDERS.find((x) => x.slug === g)!.name, href: without({ genders: f.genders.filter((x) => x !== g) }) })
  for (const s of f.sizes) chips.push({ label: `Size ${s}`, href: without({ sizes: f.sizes.filter((x) => x !== s) }) })
  for (const c of f.colours)
    chips.push({ label: colourFamilies.find((x) => x.slug === c)!.name, href: without({ colours: f.colours.filter((x) => x !== c) }) })
  if (f.min !== undefined || f.max !== undefined)
    chips.push({ label: `€${f.min ?? PRICE_MIN}–€${f.max ?? PRICE_MAX}`, href: without({ min: undefined, max: undefined }) })
  return chips
}
