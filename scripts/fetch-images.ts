/**
 * Picks Unsplash photos for every product, the 4 category tiles and the 2
 * "story" images, and records them in src/lib/image-data.ts.
 *
 * Images are NOT downloaded: Unsplash requires hotlinking images.unsplash.com.
 *
 *   npm run images:fetch                       search, assign, track downloads
 *   npm run images:fetch -- --reassign=linen-wrap-dress
 *                                              swap one product to its next-best
 *                                              photo (uses saved search results)
 *   npm run images:fetch -- --dry-run          assign and print, call nothing, save nothing
 *   npm run images:fetch -- --offline          apply PICKS + matching from saved results
 *                                              and save, without any requests
 *
 * Request budget: a demo key allows 50 requests per hour. Searches and every
 * download_location call each count as one request. The script stops at the
 * budget (or the first rate-limit response) and saves its progress; run it
 * again an hour later to finish. It never retries in a loop.
 *
 * Needs UNSPLASH_ACCESS_KEY in .env.local (git-ignored). The key is never printed.
 */
import { existsSync, readFileSync } from "node:fs"
import { writeFile } from "node:fs/promises"
import path from "node:path"

import { imageData as existingData, type UnsplashImage } from "../src/lib/image-data"
import { products, type Category, type Product } from "../src/lib/products"

const ROOT = path.resolve(__dirname, "..")
const DATA_FILE = path.join(ROOT, "src", "lib", "image-data.ts")
const CACHE_FILE = path.join(ROOT, "scripts", ".unsplash-cache.json")
const API = "https://api.unsplash.com"
const UTM = "utm_source=drip_prototype&utm_medium=referral"
/** Stay one under the hourly limit of 50. */
const MAX_REQUESTS_PER_RUN = 49

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

type Photo = {
  id: string
  width: number
  height: number
  color: string
  description: string | null
  alt_description: string | null
  urls: { raw: string }
  links: { html: string; download_location: string }
  user: { name: string; links: { html: string } }
}

type Cache = { searches: Record<string, Photo[]> }

type Search = { key: string; query: string; orientation: "portrait" | "landscape" }

type Slot = {
  key: string // image-data key, e.g. product:linen-wrap-dress
  search: string // Search.key whose results this slot prefers
  label: string
  want: RegExp[] // garment / subject words
  gender?: "women" | "men"
  hex?: string // swatch colour to match
  alt: string
}

/* ------------------------------------------------------------------ */
/* Searches: about 13 in total, by category (not per product)         */
/* ------------------------------------------------------------------ */

const SEARCHES: Search[] = [
  { key: "dresses", query: "woman dress fashion", orientation: "portrait" },
  { key: "blouses", query: "woman blouse fashion", orientation: "portrait" },
  { key: "knit", query: "knit sweater model", orientation: "portrait" },
  { key: "women-bottoms", query: "woman trousers skirt fashion", orientation: "portrait" },
  { key: "women-outer", query: "woman coat fashion", orientation: "portrait" },
  { key: "men-shirts", query: "man shirt fashion", orientation: "portrait" },
  { key: "tees", query: "t-shirt model plain background", orientation: "portrait" },
  { key: "men-bottoms", query: "jeans fashion man", orientation: "portrait" },
  { key: "men-outer", query: "man jacket fashion", orientation: "portrait" },
  { key: "hoodies", query: "hoodie streetwear", orientation: "portrait" },
  { key: "tote", query: "tote bag", orientation: "portrait" },
  { key: "winter-acc", query: "beanie scarf winter accessories", orientation: "portrait" },
  { key: "socks", query: "wool socks", orientation: "portrait" },
  { key: "story", query: "fabric sewing workshop", orientation: "landscape" },
]

const SEARCH_FOR: Record<Category, string> = {
  dresses: "dresses",
  blouses: "blouses",
  knitwear: "knit",
  trousers: "women-bottoms",
  skirts: "women-bottoms",
  outerwear: "women-outer",
  shirts: "men-shirts",
  overshirts: "men-shirts",
  "t-shirts": "tees",
  chinos: "men-bottoms",
  jeans: "men-bottoms",
  jackets: "men-outer",
  hoodies: "hoodies",
  sweatpants: "hoodies",
  bags: "tote",
  hats: "winter-acc",
  scarves: "winter-acc",
  socks: "socks",
}

const WORDS: Record<Category, string[]> = {
  dresses: ["dress"],
  blouses: ["blouse", "shirt", "top"],
  knitwear: ["sweater", "knit", "jumper", "cardigan", "knitted", "pullover"],
  trousers: ["trousers", "pants", "slacks"],
  skirts: ["skirt"],
  outerwear: ["coat", "jacket", "trench"],
  shirts: ["shirt", "button"],
  overshirts: ["shirt", "jacket", "overshirt", "corduroy"],
  "t-shirts": ["t-shirt", "tshirt", "tee", "shirt"],
  chinos: ["pants", "trousers", "chinos"],
  jeans: ["jeans", "denim"],
  jackets: ["jacket", "coat", "denim"],
  hoodies: ["hoodie", "hooded", "sweatshirt", "hood"],
  sweatpants: ["sweatpants", "joggers", "pants", "tracksuit", "sweat"],
  bags: ["bag", "tote"],
  hats: ["beanie", "hat", "knit cap"],
  scarves: ["scarf"],
  socks: ["socks", "sock"],
}

const rx = (words: string[]) => words.map((w) => new RegExp(`\\b${w.replace(/[-]/g, "[- ]?")}s?\\b`, "i"))

function productSlot(p: Product): Slot {
  return {
    key: `product:${p.id}`,
    search: SEARCH_FOR[p.category],
    label: p.name,
    want: rx(WORDS[p.category]),
    gender: p.gender === "unisex" ? undefined : p.gender,
    hex: p.colours[0].hex,
    alt: `${p.name} in ${p.colours[0].name.toLowerCase()}`,
  }
}

const extraSlots: Slot[] = [
  { key: "category:women", search: "women-outer", label: "Women tile", want: rx(["woman", "fashion", "model"]), gender: "women", alt: "Woman in a relaxed autumn outfit" },
  { key: "category:men", search: "men-shirts", label: "Men tile", want: rx(["man", "fashion", "model"]), gender: "men", alt: "Man in a casual shirt" },
  { key: "category:unisex", search: "hoodies", label: "Unisex tile", want: rx(["hoodie", "streetwear", "person", "model"]), alt: "Person wearing a relaxed hoodie" },
  { key: "category:accessories", search: "tote", label: "Accessories tile", want: rx(["bag", "tote", "accessor"]), alt: "Canvas tote bag" },
  { key: "story:fabric", search: "story", label: "How Drip makes clothes", want: rx(["fabric", "textile", "cloth", "thread"]), alt: "Fabric and thread on a workbench" },
  { key: "story:workshop", search: "story", label: "About", want: rx(["sewing", "machine", "tailor", "workshop", "seamstress"]), alt: "Sewing machine in a clothing workshop" },
]

/* ------------------------------------------------------------------ */
/* Manual picks: checked by eye, these override automatic matching.    */
/* Value = Unsplash photo id (must be in the saved search results).    */
/* ------------------------------------------------------------------ */

const PICKS: Record<string, string> = {
  // Women
  "category:women": "Yh3DxI5ThUo", // woman in cream coat, black top
  "product:wool-blend-coat": "WyZENAF8WVs", // tan coat, plain pale background
  "product:cotton-trench-coat": "TRPFCWbrfRo", // stone trench
  "product:quilted-liner-jacket": "WE-qFRXdX_Q", // white padded coat in snow
  "product:merino-crew-jumper": "KlkfFwXXbXc", // cream jumper
  "product:recycled-wool-cardigan": "VjE0Lt9Ix_8", // cream V-neck knit
  "product:cotton-rib-top": "1RhBy4VkZeQ", // mint knit (moved from cardigan)
  "product:lyocell-button-blouse": "HoH3PUyV8Pw", // ecru shirt
  "product:pintuck-cotton-blouse": "5vcMgxyXSTI", // white eyelet blouse, plain background
  "product:straight-cotton-trousers": "CSbfqI7jBgU", // black trousers, plain wall
  "product:wide-leg-trousers": "AGS5n2WE9zQ", // camel wide-leg trousers
  // Men
  "product:oxford-shirt": "Matg3I8sGZg", // light blue shirt
  "product:slim-chinos": "4fkUAduhoSY", // beige chinos
  "product:relaxed-pleated-chinos": "1WqEZZp2qmU", // sage-grey trousers
  "product:flannel-check-shirt": "h0cztHfsLOk", // blue check shirt on mannequin
  "product:recycled-wool-overshirt": "NEoHtAwvwnE", // dark teal shirt (moved from flannel)
  "product:corduroy-overshirt": "j88fRoQ92PQ", // black shirt
  "product:merino-v-neck": "4rHYOxAugsg", // grey knit
  "product:recycled-wool-crew": "g3AwbdZut70", // brown jumper on a hanger
  "product:cotton-quarter-zip": "PMVYSAtLlLE", // stack of knits
  "product:slim-jeans": "M3-eH4_UNpQ", // mid-blue jeans
  "product:recycled-padded-jacket": "R4O8mJeih1w", // cream padded jacket
  "product:canvas-chore-jacket": "zMnCb2UfRDc", // beige jacket (swapped)
  "product:denim-trucker-jacket": "OT2UXntkCUI", // denim jacket (swapped)
  // Unisex
  "product:classic-hoodie": "VoP2WK9rTa4", // light grey hoodie
  "product:zip-through-hoodie": "ZCoqcrWp9GY", // grey zip hoodie
  "product:boxy-heavyweight-hoodie": "N6BP12FB_XU", // taupe hoodie (moved from sweatpants)
  "product:straight-sweatpants": "aAPLeoSmbk4", // lilac sweat set
  "product:cuffed-joggers": "z56-3HeECRk", // black joggers
  // Accessories
  "category:accessories": "3rtua9LWdCg", // dark beanie and scarf
  "product:ribbed-beanie": "9Kgp5XO2l0Y", // grey beanie
  "product:canvas-tote": "dKaTJZ_1MCM", // plain cotton totes
  "product:organic-socks-3-pack": "axt96zsVXL8", // grey knitted sock, plain background
}

/* ------------------------------------------------------------------ */
/* Scoring                                                             */
/* ------------------------------------------------------------------ */

const WOMEN = /\b(woman|women|girl|lady|female|her)\b/i
const MEN = /\b(man|men|guy|male|boy|his)\b/i
const MODEL = /\b(wearing|model|posing|standing|portrait|person)\b/i
const PLAIN = /\b(white|grey|gray|beige|plain|neutral|pink|studio)\s+(background|wall|backdrop)\b|\bstudio\b|\bminimal/i
const AVOID = /\b(child|children|kid|kids|baby|toddler|dog|cat|wedding|bride|costume|halloween)\b/i
const BRANDS = /\b(nike|adidas|supreme|gucci|zara|h&m|puma|vans|levi'?s|champion|balenciaga|louis vuitton|chanel)\b/i

const hexToRgb = (hex: string) => {
  const h = hex.replace("#", "")
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16))
}
const colourDistance = (a: string, b: string) => {
  const [r1, g1, b1] = hexToRgb(a)
  const [r2, g2, b2] = hexToRgb(b)
  return Math.sqrt((r1 - r2) ** 2 + (g1 - g2) ** 2 + (b1 - b2) ** 2) // 0..441
}

function score(photo: Photo, slot: Slot, rank: number) {
  const text = `${photo.alt_description ?? ""} ${photo.description ?? ""}`
  let s = 0
  for (const w of slot.want) if (w.test(text)) s += 4
  if (slot.gender === "women") s += WOMEN.test(text) ? 3 : MEN.test(text) ? -8 : 0
  if (slot.gender === "men") s += MEN.test(text) && !WOMEN.test(text) ? 3 : WOMEN.test(text) ? -8 : 0
  if (MODEL.test(text)) s += 2
  if (PLAIN.test(text)) s += 3
  if (AVOID.test(text)) s -= 10
  if (BRANDS.test(text)) s -= 15
  // Unsplash's average colour includes the background, so this is a gentle nudge.
  if (slot.hex) s += 3 * (1 - colourDistance(photo.color, slot.hex) / 441)
  return s - rank * 0.04 // keep Unsplash's relevance as a tie-breaker
}

/* ------------------------------------------------------------------ */
/* HTTP with a hard request budget                                     */
/* ------------------------------------------------------------------ */

class RateLimitStop extends Error {}

let requestsUsed = 0
let remainingReported: number | null = null

async function api(url: string, key: string) {
  if (requestsUsed >= MAX_REQUESTS_PER_RUN || remainingReported === 0) {
    throw new RateLimitStop("Request budget for this hour is used up.")
  }
  requestsUsed++
  const res = await fetch(url, { headers: { Authorization: `Client-ID ${key}`, "Accept-Version": "v1" } })
  const remaining = res.headers.get("x-ratelimit-remaining")
  if (remaining !== null) remainingReported = Number(remaining)
  if (res.status === 401) throw new Error("Unsplash rejected the access key (401). Check UNSPLASH_ACCESS_KEY in .env.local.")
  if (res.status === 403 || res.status === 429) {
    throw new RateLimitStop("Unsplash says the hourly rate limit is reached.")
  }
  if (!res.ok) throw new Error(`Unsplash request failed: ${res.status} ${res.statusText}`)
  return res.json()
}

/* ------------------------------------------------------------------ */
/* Files                                                               */
/* ------------------------------------------------------------------ */

const loadCache = (): Cache => {
  try {
    return existsSync(CACHE_FILE) ? (JSON.parse(readFileSync(CACHE_FILE, "utf8")) as Cache) : { searches: {} }
  } catch {
    return { searches: {} }
  }
}

const saveCache = (cache: Cache) => writeFile(CACHE_FILE, JSON.stringify(cache))

async function saveData(data: Record<string, UnsplashImage>) {
  const sorted = Object.fromEntries(Object.entries(data).sort(([a], [b]) => a.localeCompare(b)))
  await writeFile(
    DATA_FILE,
    `// Written by scripts/fetch-images.ts. Do not re-host these images:
// Unsplash requires hotlinking their URLs. Credits are shown on /credits.

export type UnsplashImage = {
  /** Unsplash photo id */
  id: string
  /** urls.raw from the API; next/image adds width/quality params */
  url: string
  width: number
  height: number
  alt: string
  /** Average colour from Unsplash, used behind the image while it loads */
  color: string
  photographer: string
  /** Photographer profile, with Unsplash referral params */
  photographerUrl: string
  /** Photo page on Unsplash, with referral params */
  photoUrl: string
  downloadLocation: string
  /** True once the download_location endpoint has been called for this photo */
  downloadTracked: boolean
}

export const imageData: Record<string, UnsplashImage> = ${JSON.stringify(sorted, null, 2)}
`
  )
}

const withUtm = (url: string) => `${url}${url.includes("?") ? "&" : "?"}${UTM}`

const toImage = (photo: Photo, slot: Slot): UnsplashImage => ({
  id: photo.id,
  url: photo.urls.raw,
  width: photo.width,
  height: photo.height,
  alt: slot.alt,
  color: photo.color,
  photographer: photo.user.name,
  photographerUrl: withUtm(photo.user.links.html),
  photoUrl: withUtm(photo.links.html),
  downloadLocation: photo.links.download_location,
  downloadTracked: false,
})

/* ------------------------------------------------------------------ */
/* Main                                                                */
/* ------------------------------------------------------------------ */

async function main() {
  const args = process.argv.slice(2)
  const dryRun = args.includes("--dry-run")
  /** Apply picks and matching from saved search results only: no requests, but saves. */
  const offline = args.includes("--offline")
  const reassign = (args.find((a) => a.startsWith("--reassign="))?.slice(11) ?? "")
    .split(",")
    .filter(Boolean)
    .map((k) => (k.includes(":") ? k : `product:${k}`))

  const key = process.env.UNSPLASH_ACCESS_KEY?.trim()
  if (!key && !dryRun && !offline) {
    console.error("UNSPLASH_ACCESS_KEY is missing. Add it to .env.local:\n\n  UNSPLASH_ACCESS_KEY=your-access-key\n")
    process.exit(1)
  }

  const cache = loadCache()
  const data: Record<string, UnsplashImage> = { ...existingData }
  const banned = new Map<string, Set<string>>() // slot -> photo ids it must not get again
  for (const k of reassign) {
    if (!data[k]) console.warn(`Note: ${k} has no photo yet, so --reassign just assigns one.`)
    else banned.set(k, new Set([data[k].id]))
    delete data[k]
  }

  let stopReason: string | null = null

  try {
    /* 1. Searches (cached, so a second run doesn't repeat them) */
    for (const s of SEARCHES) {
      if (cache.searches[s.key]?.length) continue
      if (dryRun || offline) continue
      const params = new URLSearchParams({ query: s.query, per_page: "30", orientation: s.orientation, content_filter: "high" })
      const json = (await api(`${API}/search/photos?${params}`, key!)) as { results: Photo[] }
      cache.searches[s.key] = json.results
      await saveCache(cache)
      console.log(`Searched "${s.query}": ${json.results.length} photos`)
    }
  } catch (err) {
    if (!(err instanceof RateLimitStop)) throw err
    stopReason = err.message
  }

  /* 2a. Manual picks (local, no requests) */
  const allSlotsList = [...products.map(productSlot), ...extraSlots]
  const trackedIds = new Set(Object.values(existingData).filter((d) => d.downloadTracked).map((d) => d.id))
  const cachedById = new Map(Object.values(cache.searches).flat().map((p) => [p.id, p]))
  const pickedIds = new Set(Object.values(PICKS))
  // Free any slot that holds a picked photo it wasn't picked for.
  for (const [k, img] of Object.entries(data)) {
    if (pickedIds.has(img.id) && PICKS[k] !== img.id) delete data[k]
  }
  for (const [slotKey, photoId] of Object.entries(PICKS)) {
    const slot = allSlotsList.find((s) => s.key === slotKey)
    const photo = cachedById.get(photoId)
    if (!slot || !photo) {
      console.warn(`Pick skipped: ${slotKey} -> ${photoId} (${!slot ? "unknown slot" : "photo not in saved results"})`)
      continue
    }
    if (data[slotKey]?.id === photoId) continue
    data[slotKey] = { ...toImage(photo, slot), downloadTracked: trackedIds.has(photoId) }
  }

  /* 2b. Automatic matching for the rest. Highest score first, no photo twice. */
  const slots = allSlotsList.filter((s) => !data[s.key])
  const used = new Set(Object.values(data).map((d) => d.id))
  const candidates: { slot: Slot; photo: Photo; score: number }[] = []
  for (const slot of slots) {
    const results = cache.searches[slot.search] ?? []
    results.forEach((photo, rank) => {
      if (banned.get(slot.key)?.has(photo.id)) return
      candidates.push({ slot, photo, score: score(photo, slot, rank) })
    })
  }
  candidates.sort((a, b) => b.score - a.score)
  const assigned = new Set<string>()
  for (const c of candidates) {
    if (assigned.has(c.slot.key) || used.has(c.photo.id)) continue
    data[c.slot.key] = toImage(c.photo, c.slot)
    assigned.add(c.slot.key)
    used.add(c.photo.id)
  }

  // Fallback: borrow leftovers from any search for slots whose own search ran dry.
  for (const slot of slots.filter((s) => !assigned.has(s.key))) {
    const pool = Object.values(cache.searches).flat().filter((p) => !used.has(p.id) && !banned.get(slot.key)?.has(p.id))
    const matchesGarment = (p: Photo) => slot.want.some((w) => w.test(`${p.alt_description ?? ""} ${p.description ?? ""}`))
    const best = pool
      .filter(matchesGarment)
      .map((p, i) => ({ p, s: score(p, slot, i) }))
      .sort((a, b) => b.s - a.s)[0]
    if (best && best.s > 0) {
      data[slot.key] = toImage(best.p, slot)
      assigned.add(slot.key)
      used.add(best.p.id)
    }
  }

  // Safety check: the brief says no photo may be used twice.
  const ids = Object.values(data).map((d) => d.id)
  const dupes = ids.filter((id, i) => ids.indexOf(id) !== i)
  if (dupes.length) throw new Error(`Bug: photo used twice (${dupes.join(", ")}). Nothing was saved.`)

  if (!dryRun) await saveData(data)

  /* 3. Tell Unsplash each assigned photo is used: one download_location call each */
  if (!dryRun && !offline && !stopReason) {
    try {
      for (const [k, img] of Object.entries(data)) {
        if (img.downloadTracked) continue
        await api(img.downloadLocation, key!)
        data[k] = { ...img, downloadTracked: true }
        await saveData(data) // save after each so progress survives a stop
      }
    } catch (err) {
      if (!(err instanceof RateLimitStop)) throw err
      stopReason = err.message
    }
  }

  /* 4. Report */
  const allSlots = [...products.map(productSlot), ...extraSlots]
  const missing = allSlots.filter((s) => !data[s.key])
  const untracked = Object.values(data).filter((d) => !d.downloadTracked).length

  console.log("\nAssignments (check the photo colour against the product colour):")
  for (const s of allSlots) {
    const d = data[s.key]
    if (!d) continue
    const product = s.key.startsWith("product:") ? products.find((p) => `product:${p.id}` === s.key) : undefined
    const swatch = product ? `${product.colours[0].name} ${product.colours[0].hex}` : ""
    console.log(`  ${s.key.padEnd(38)} photo ${d.color}  product ${swatch.padEnd(18)} ${d.downloadTracked ? "tracked" : "NOT TRACKED"}`)
  }

  console.log(`\nRequests used this run: ${requestsUsed} (Unsplash reports ${remainingReported ?? "?"} left this hour)`)
  console.log(`Photos assigned: ${allSlots.length - missing.length} of ${allSlots.length}`)
  if (missing.length) console.log(`No suitable photo yet: ${missing.map((m) => m.key).join(", ")}`)
  if (untracked) console.log(`Downloads still to report to Unsplash: ${untracked}`)

  if (stopReason) {
    console.log(`\nSTOPPED: ${stopReason}`)
    console.log("Progress is saved. Wait an hour, then run `npm run images:fetch` again to finish.")
    process.exitCode = 2
  } else if (offline) {
    console.log("\nOffline run: picks and matches saved. Run without --offline to report new photos to Unsplash.")
  } else if (!dryRun && untracked === 0) {
    console.log("\nDone. Every assigned photo has been reported to Unsplash.")
  }
}

main().catch((err: Error) => {
  console.error(`\n${err.message}`)
  process.exit(1)
})
