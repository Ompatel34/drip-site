/*
 * DRIP PROTOTYPE CATALOGUE: edit every product here.
 *
 * All products, prices, reviews and sustainability figures are FICTIONAL
 * SAMPLE DATA for a prototype store. Nothing can be bought.
 *
 * How to edit a product: find it in `catalogue` below and change its fields.
 *  - price      full price in euro (must be 15-35; most items sit at 15-20)
 *  - salePrice  optional reduced price; the full price is shown crossed out
 *  - colours    first colour = the colour shown in the product photo
 *  - soldOut    sizes that show as sold out
 *  - made       [factory country, water litres per item, kg CO2e per item]
 *  - fabric     key into FABRICS (composition, source, care, % recycled)
 *
 * Kept free of path-alias imports so scripts can import it directly.
 */

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

export type Swatch = { name: string; hex: string }

export type Department = "women" | "men" | "unisex" | "accessories"
export type Gender = "women" | "men" | "unisex"
export type Category =
  | "dresses" | "blouses" | "knitwear" | "trousers" | "skirts" | "outerwear"
  | "shirts" | "t-shirts" | "chinos" | "jeans" | "jackets"
  | "hoodies" | "sweatpants" | "overshirts"
  | "bags" | "hats" | "scarves" | "socks"
export type BadgeKind = "new" | "bestseller" | "low-stock"

export type Review = { author: string; rating: 1 | 2 | 3 | 4 | 5; title: string; body: string }

export type Sustainability = {
  materialSource: string
  recycledPercent: number
  factoryCountry: string
  waterLitres: number
  co2Kg: number
  endOfLife: string
}

export type Product = {
  id: string
  name: string
  department: Department
  gender: Gender
  category: Category
  price: number
  salePrice?: number
  badges: BadgeKind[]
  colours: Swatch[]
  sizes: string[]
  soldOut: string[]
  description: string
  fit: string
  material: string
  composition: string
  care: string
  sustainability: Sustainability
  reviews: Review[]
  /** ISO date the product was added (for "Newest" sort) */
  added: string
  /** Sample units sold (for "Bestsellers" sort) */
  sold: number
  /** Optional hand-picked ids; otherwise worked out automatically */
  completeTheLook?: string[]
}

/* ------------------------------------------------------------------ */
/* Colours                                                             */
/* ------------------------------------------------------------------ */

const C = {
  black: { name: "Black", hex: "#16181B" },
  white: { name: "White", hex: "#FAFAF8" },
  ecru: { name: "Ecru", hex: "#E9E3D6" },
  oatmeal: { name: "Oatmeal", hex: "#D8CDBB" },
  sand: { name: "Sand", hex: "#D8C8AE" },
  stone: { name: "Stone", hex: "#C9C1B2" },
  camel: { name: "Camel", hex: "#B48E64" },
  tan: { name: "Tan", hex: "#A27A55" },
  chocolate: { name: "Chocolate", hex: "#4A3A30" },
  rust: { name: "Rust", hex: "#8E4A30" },
  burgundy: { name: "Burgundy", hex: "#5E2430" },
  khaki: { name: "Khaki", hex: "#6F6A4E" },
  sage: { name: "Sage", hex: "#9DA592" },
  sky: { name: "Sky blue", hex: "#A9BED3" },
  midBlue: { name: "Mid blue", hex: "#5B7590" },
  indigo: { name: "Indigo", hex: "#2B3550" },
  navy: { name: "Navy", hex: "#1F2A3C" },
  grey: { name: "Grey marl", hex: "#A7A8A6" },
  charcoal: { name: "Charcoal", hex: "#3E4146" },
  // Added to match the product photos
  cream: { name: "Cream", hex: "#EEE8DC" },
  ivory: { name: "Ivory", hex: "#EEEAE2" },
  lightGrey: { name: "Light grey", hex: "#D6D6D4" },
  taupe: { name: "Taupe", hex: "#8B7F76" },
  blush: { name: "Blush", hex: "#CFA79C" },
  terracotta: { name: "Terracotta", hex: "#B65A43" },
  mint: { name: "Mint", hex: "#B9CFC5" },
  lightBlue: { name: "Light blue", hex: "#9FB5CB" },
  lilac: { name: "Lilac", hex: "#C5B8D6" },
  mustard: { name: "Mustard", hex: "#C99A2E" },
  darkTeal: { name: "Dark teal", hex: "#23393E" },
  sageGrey: { name: "Sage grey", hex: "#8E9A92" },
  greyPrint: { name: "Grey print", hex: "#C9CACA" },
  blueCheck: { name: "Blue check", hex: "#8FA2BD" },
  greyCheck: { name: "Grey check", hex: "#7C858C" },
} satisfies Record<string, Swatch>

/* ------------------------------------------------------------------ */
/* Fabrics (sample data)                                               */
/* ------------------------------------------------------------------ */

const TAKE_BACK =
  "Send it back free with Drip Take-back: wearable pieces are cleaned and resold in Pre-loved, worn-out ones are shredded into insulation felt."
const WOOL_BACK =
  "Send it back free with Drip Take-back: wearable pieces go to Pre-loved, the rest is sorted by colour and re-spun into new yarn in Prato, Italy."

const FABRICS = {
  organicCotton: {
    label: "Organic cotton",
    composition: "100% organic cotton",
    source: "Organic cotton grown in Gujarat, India",
    recycled: 0,
    care: "Machine wash at 30°C. Tumble dry on low. Warm iron.",
    endOfLife: TAKE_BACK,
  },
  stretchCotton: {
    label: "Organic cotton",
    composition: "97% organic cotton, 3% elastane",
    source: "Organic cotton grown in Gujarat, India",
    recycled: 0,
    care: "Machine wash at 30°C inside out. Warm iron.",
    endOfLife: TAKE_BACK,
  },
  recycledCotton: {
    label: "Recycled cotton",
    composition: "60% recycled cotton, 40% organic cotton",
    source: "Cutting-room offcuts collected from garment factories in northern Portugal",
    recycled: 60,
    care: "Machine wash at 30°C. Line dry.",
    endOfLife: TAKE_BACK,
  },
  cottonFleece: {
    label: "Organic cotton",
    composition: "80% organic cotton, 20% recycled polyester",
    source: "Organic cotton from Gujarat, India; polyester from recycled bottles in Taiwan",
    recycled: 20,
    care: "Machine wash at 30°C inside out. Do not tumble dry.",
    endOfLife: TAKE_BACK,
  },
  denim: {
    label: "Recycled cotton",
    composition: "80% organic cotton, 20% recycled cotton",
    source: "Denim woven in Izmir, Türkiye from organic and post-industrial recycled cotton",
    recycled: 20,
    care: "Wash rarely, inside out at 30°C. Line dry.",
    endOfLife: TAKE_BACK,
  },
  linen: {
    label: "Linen",
    composition: "100% linen",
    source: "Flax grown and scutched in Normandy, France",
    recycled: 0,
    care: "Machine wash at 30°C. Line dry and iron while damp.",
    endOfLife: TAKE_BACK,
  },
  lyocell: {
    label: "Lyocell",
    composition: "100% lyocell",
    source: "Wood pulp from FSC-certified forests, spun into fibre in Austria",
    recycled: 0,
    care: "Machine wash at 30°C on a gentle cycle. Line dry.",
    endOfLife: TAKE_BACK,
  },
  viscose: {
    label: "Viscose",
    composition: "100% viscose",
    source: "Wood pulp from FSC-certified forests, spun into fibre in Indonesia",
    recycled: 0,
    care: "Machine wash at 30°C on a delicate cycle. Cool iron.",
    endOfLife: TAKE_BACK,
  },
  merino: {
    label: "Merino wool",
    composition: "100% merino wool",
    source: "Non-mulesed merino from farms in the Eastern Cape, South Africa",
    recycled: 0,
    care: "Wool cycle at 30°C. Dry flat.",
    endOfLife: WOOL_BACK,
  },
  recycledWool: {
    label: "Recycled wool",
    composition: "70% recycled wool, 30% recycled polyamide",
    source: "Post-consumer knitwear sorted and re-spun in Prato, Italy",
    recycled: 100,
    care: "Hand wash cold or dry clean. Dry flat.",
    endOfLife: WOOL_BACK,
  },
  woolCoat: {
    label: "Recycled wool",
    composition: "60% recycled wool, 30% wool, 10% recycled polyester",
    source: "Post-consumer wool re-spun in Prato, Italy",
    recycled: 70,
    care: "Dry clean only. Brush after wear.",
    endOfLife: WOOL_BACK,
  },
  recycledPolyester: {
    label: "Recycled polyester",
    composition: "100% recycled polyester",
    source: "Plastic bottles collected and processed into yarn in Taiwan",
    recycled: 100,
    care: "Machine wash at 30°C. Do not tumble dry.",
    endOfLife: TAKE_BACK,
  },
  recycledNylon: {
    label: "Recycled nylon",
    composition: "Shell and fill: 100% recycled nylon",
    source: "Regenerated nylon from fishing nets, processed in Slovenia",
    recycled: 100,
    care: "Machine wash at 30°C. Do not tumble dry.",
    endOfLife: TAKE_BACK,
  },
  sockBlend: {
    label: "Organic cotton",
    composition: "80% organic cotton, 18% recycled polyamide, 2% elastane",
    source: "Organic cotton from Gujarat, India; polyamide from recycled fishing nets",
    recycled: 18,
    care: "Machine wash at 40°C. Tumble dry on low.",
    endOfLife: TAKE_BACK,
  },
} satisfies Record<
  string,
  { label: string; composition: string; source: string; recycled: number; care: string; endOfLife: string }
>

type FabricKey = keyof typeof FABRICS

/* ------------------------------------------------------------------ */
/* Sample reviews (picked automatically by product type)               */
/* ------------------------------------------------------------------ */

type ReviewGroup = "tops" | "knit" | "bottoms" | "dresses" | "outerwear" | "accessories"

const REVIEWS: Record<ReviewGroup, Review[]> = {
  tops: [
    { author: "Aoife, Cork", rating: 5, title: "My new favourite", body: "Soft, holds its shape after washing and the length is right for tucking in or wearing out." },
    { author: "Ciarán, Galway", rating: 4, title: "Good quality", body: "Feels sturdier than what I usually buy on the high street. Runs very slightly large." },
    { author: "Niamh, Dublin", rating: 5, title: "Bought a second colour", body: "Wore it every week since it arrived, so I went back for another one." },
    { author: "Mark, Kildare", rating: 3, title: "Nice but creases", body: "Lovely fabric, but it needs an iron after every wash." },
    { author: "Fiona, Wexford", rating: 4, title: "Easy to wear", body: "Simple and well made. The colour is exactly as shown." },
  ],
  knit: [
    { author: "Gráinne, Sligo", rating: 5, title: "Warm without bulk", body: "Lovely and soft, no itch at all. Washed it on the wool cycle and it came out perfect." },
    { author: "Declan, Waterford", rating: 4, title: "Great jumper", body: "Good weight for an Irish winter. Sleeves are a touch long for me." },
    { author: "Siobhán, Kerry", rating: 5, title: "Worth it", body: "No bobbling after two months of regular wear." },
    { author: "Paul, Louth", rating: 3, title: "Size down", body: "Nice knit but roomier than expected. I swapped for a smaller size." },
  ],
  bottoms: [
    { author: "Emma, Dublin", rating: 5, title: "Perfect fit", body: "Comfortable all day at my desk and still look smart. The pockets are a proper depth." },
    { author: "Conor, Mayo", rating: 4, title: "Solid pair", body: "Good fabric and stitching. I had to take them up a couple of centimetres." },
    { author: "Róisín, Clare", rating: 5, title: "Ordered two", body: "Flattering cut and they don't go baggy at the knee." },
    { author: "Brian, Meath", rating: 4, title: "Comfortable", body: "Size guide was spot on. Would buy again." },
  ],
  dresses: [
    { author: "Orla, Limerick", rating: 5, title: "Wore it to a wedding", body: "Dressed it up with heels and down with trainers the next day. So versatile." },
    { author: "Sarah, Cork", rating: 4, title: "Lovely fabric", body: "Drapes nicely and has pockets. A little long on me at 160 cm." },
    { author: "Ciara, Tipperary", rating: 5, title: "Compliments all day", body: "Easy to wear, washes well and the colour hasn't faded." },
    { author: "Helen, Kilkenny", rating: 3, title: "Check the length", body: "Good quality, but the hem hit an awkward spot on me." },
  ],
  outerwear: [
    { author: "Eoin, Dublin", rating: 5, title: "Kept me dry and warm", body: "Survived a week of Galway weather. Plenty of room for a jumper underneath." },
    { author: "Louise, Wicklow", rating: 4, title: "Great everyday jacket", body: "Smart enough for work, casual enough for weekends. Pockets could be deeper." },
    { author: "Tom, Westmeath", rating: 5, title: "Built to last", body: "Heavy, well finished and the zip feels solid." },
    { author: "Aisling, Donegal", rating: 4, title: "Good buy", body: "Fits true to size. I wish it came in more colours." },
  ],
  accessories: [
    { author: "Méabh, Galway", rating: 5, title: "Use it daily", body: "Strong, washes well and goes with everything." },
    { author: "Darragh, Cork", rating: 4, title: "Nice quality", body: "Good value for what you get. Bought one as a gift too." },
    { author: "Katie, Dublin", rating: 5, title: "Lovely and soft", body: "Feels much nicer than I expected for the price." },
  ],
}

const reviewGroup = (cat: Category): ReviewGroup => {
  if (cat === "knitwear") return "knit"
  if (["trousers", "skirts", "chinos", "jeans", "sweatpants"].includes(cat)) return "bottoms"
  if (cat === "dresses") return "dresses"
  if (["outerwear", "jackets"].includes(cat)) return "outerwear"
  if (["bags", "hats", "scarves", "socks"].includes(cat)) return "accessories"
  return "tops"
}

/** Small stable hash so each product gets the same reviews every build. */
const hash = (s: string) => [...s].reduce((h, ch) => (h * 31 + ch.charCodeAt(0)) >>> 0, 7)

function pickReviews(id: string, cat: Category): Review[] {
  const pool = REVIEWS[reviewGroup(cat)]
  const h = hash(id)
  const count = 2 + (h % 3) // 2-4
  return Array.from({ length: Math.min(count, pool.length) }, (_, i) => pool[(h + i) % pool.length])
}

/* ------------------------------------------------------------------ */
/* Catalogue                                                           */
/* ------------------------------------------------------------------ */

const CLOTHING = ["XS", "S", "M", "L", "XL", "XXL"]
const ONE_SIZE = ["One size"]

type Entry = {
  id: string
  name: string
  department: Department
  category: Category
  price: number
  salePrice?: number
  badges?: BadgeKind[]
  colours: Swatch[]
  soldOut?: string[]
  fabric: FabricKey
  /** [factory country, water litres, kg CO2e] */
  made: [string, number, number]
  fit: string
  description: string
  added: string
  sold: number
  reviews?: Review[]
  completeTheLook?: string[]
}

const catalogue: Entry[] = [
  /* ---------------- Women: 18 ---------------- */
  {
    id: "linen-wrap-dress", name: "Linen wrap dress", department: "women", category: "dresses",
    price: 29, badges: ["new"], colours: [C.sage, C.black], fabric: "linen", made: ["Portugal", 1900, 6.1],
    fit: "Relaxed fit with an adjustable tie waist. Model is 173 cm and wears S.",
    description: "A wrap dress in washed French linen with a tie waist and short flutter sleeves. It falls just below the knee and softens with every wash.",
    added: "2026-11-02", sold: 310,
  },
  {
    id: "jersey-midi-dress", name: "Organic cotton jersey midi dress", department: "women", category: "dresses",
    price: 20, badges: ["bestseller"], colours: [C.blush, C.black], fabric: "organicCotton", made: ["India", 2100, 4.2],
    fit: "Regular fit, close at the waist. Model is 170 cm and wears S.",
    description: "A round-neck midi dress in soft, mid-weight jersey with side pockets. Easy to layer under knitwear in winter.",
    added: "2026-06-14", sold: 1240,
  },
  {
    id: "poplin-shirt-dress", name: "Poplin shirt dress", department: "women", category: "dresses",
    price: 25, salePrice: 19, colours: [C.terracotta, C.white], fabric: "organicCotton", made: ["Bangladesh", 1700, 3.9],
    fit: "Relaxed fit with a removable belt. Model is 175 cm and wears M.",
    description: "A crisp button-through shirt dress with a collar, rolled sleeves and a self-fabric belt. Wear it buttoned or open as a light layer.",
    added: "2026-04-20", sold: 520,
  },
  {
    id: "ribbed-knit-dress", name: "Ribbed knit midi dress", department: "women", category: "dresses",
    price: 30, badges: ["low-stock"], colours: [C.cream, C.charcoal], soldOut: ["XS", "XXL"], fabric: "merino", made: ["Romania", 3900, 9.8],
    fit: "Slim fit with stretch. Model is 172 cm and wears S.",
    description: "A fine-rib knitted dress with a high neck and long sleeves. Warm enough for winter with tights and boots.",
    added: "2026-09-18", sold: 280,
  },
  {
    id: "relaxed-viscose-blouse", name: "Relaxed viscose blouse", department: "women", category: "blouses",
    price: 18, badges: ["new"], colours: [C.white, C.black], fabric: "viscose", made: ["Türkiye", 650, 2.4],
    fit: "Relaxed fit. Model is 170 cm and wears S.",
    description: "A fluid blouse with a soft collar and covered buttons. Tuck it into trousers for work or wear it loose at the weekend.",
    added: "2026-10-30", sold: 190,
  },
  {
    id: "pintuck-cotton-blouse", name: "Pintuck cotton blouse", department: "women", category: "blouses",
    price: 17, colours: [C.white, C.sky], fabric: "organicCotton", made: ["India", 1400, 3.1],
    fit: "Regular fit. Model is 168 cm and wears S.",
    description: "A crisp cotton blouse with fine pintucks down the front and a gathered cuff. A light layer that works on its own or under knitwear.",
    added: "2026-05-11", sold: 340,
  },
  {
    id: "lyocell-button-blouse", name: "Lyocell button-through blouse", department: "women", category: "blouses",
    price: 20, badges: ["bestseller"], colours: [C.ecru, C.sky], fabric: "lyocell", made: ["Portugal", 450, 2.2],
    fit: "Regular fit, slightly longer at the back. Model is 174 cm and wears M.",
    description: "A smooth, breathable blouse with a curved hem and a hidden button placket. It barely creases, so it packs well for travel.",
    added: "2026-03-02", sold: 980,
  },
  {
    id: "merino-crew-jumper", name: "Merino crew-neck jumper", department: "women", category: "knitwear",
    price: 28, badges: ["bestseller"], colours: [C.oatmeal, C.navy, C.burgundy], fabric: "merino", made: ["Italy", 4100, 10.2],
    fit: "Regular fit. Model is 172 cm and wears S.",
    description: "A fine-gauge merino jumper with a ribbed neck, cuffs and hem. Warm without bulk and naturally resists odour, so it needs washing less often.",
    added: "2026-08-25", sold: 1410,
  },
  {
    id: "recycled-wool-cardigan", name: "Recycled wool cardigan", department: "women", category: "knitwear",
    price: 32, badges: ["new"], colours: [C.cream, C.camel], fabric: "recycledWool", made: ["Italy", 520, 4.6],
    fit: "Relaxed fit with dropped shoulders. Model is 175 cm and wears S.",
    description: "A chunky V-neck cardigan with horn-effect buttons and two patch pockets. Knitted from re-spun wool, so every batch has a slightly different tone.",
    added: "2026-11-05", sold: 160,
  },
  {
    id: "cotton-rib-top", name: "Cotton rib-knit top", department: "women", category: "knitwear",
    price: 20, salePrice: 15, colours: [C.mint, C.ecru, C.black], fabric: "organicCotton", made: ["Türkiye", 1100, 2.6],
    fit: "Slim fit. Model is 170 cm and wears S.",
    description: "A close-fitting short-sleeve knit top in a fine cotton rib. Layers neatly under cardigans and blazers.",
    added: "2026-04-03", sold: 610,
  },
  {
    id: "wide-leg-trousers", name: "Wide-leg pleated trousers", department: "women", category: "trousers",
    price: 25, badges: ["bestseller"], colours: [C.camel, C.black], soldOut: ["XS"], fabric: "lyocell", made: ["Portugal", 900, 4.0],
    fit: "High waist, wide leg, full length. Model is 175 cm and wears S.",
    description: "Tailored trousers with front pleats, a wide leg and a zip fly with hook fastening. Smart enough for the office and comfortable all day.",
    added: "2026-02-15", sold: 1320,
  },
  {
    id: "straight-cotton-trousers", name: "Straight-leg cotton trousers", department: "women", category: "trousers",
    price: 20, colours: [C.black, C.camel], fabric: "stretchCotton", made: ["Bangladesh", 2300, 5.1],
    fit: "Mid rise, straight leg. Model is 170 cm and wears S.",
    description: "Everyday trousers in a cotton twill with a little stretch. Slanted pockets and a clean, flat front.",
    added: "2026-07-07", sold: 450,
  },
  {
    id: "linen-drawstring-trousers", name: "Linen drawstring trousers", department: "women", category: "trousers",
    price: 19, badges: ["low-stock"], colours: [C.white, C.sand], soldOut: ["M"], fabric: "linen", made: ["Portugal", 1600, 4.8],
    fit: "Relaxed fit with an elasticated drawstring waist. Model is 173 cm and wears S.",
    description: "Loose, airy trousers in washed linen with deep side pockets. Made for warm days and holidays.",
    added: "2026-05-28", sold: 390,
  },
  {
    id: "pleated-midi-skirt", name: "Pleated midi skirt", department: "women", category: "skirts",
    price: 19, badges: ["new"], colours: [C.tan, C.black], fabric: "recycledPolyester", made: ["Lithuania", 120, 3.4],
    fit: "Elasticated waist, midi length. Model is 172 cm and wears S.",
    description: "A sunray-pleated skirt that moves as you walk. The pleats are heat-set, so they hold after washing.",
    added: "2026-10-21", sold: 230,
  },
  {
    id: "denim-a-line-skirt", name: "Denim A-line skirt", department: "women", category: "skirts",
    price: 22, salePrice: 16, colours: [C.lightBlue], fabric: "denim", made: ["Türkiye", 3100, 6.9],
    fit: "High waist, knee length. Model is 170 cm and wears S.",
    description: "A classic five-pocket denim skirt with a button fly. Pairs with everything from tees to knitwear.",
    added: "2026-03-19", sold: 430,
  },
  {
    id: "wool-blend-coat", name: "Relaxed wool-blend coat", department: "women", category: "outerwear",
    price: 35, badges: ["new"], colours: [C.camel, C.black], fabric: "woolCoat", made: ["Italy", 1500, 14.5],
    fit: "Relaxed fit, sits below the knee. Model is 175 cm and wears S.",
    description: "A single-breasted coat with dropped shoulders and deep welt pockets. There is room underneath for a thick jumper.",
    added: "2026-10-12", sold: 370,
  },
  {
    id: "quilted-liner-jacket", name: "Quilted liner jacket", department: "women", category: "outerwear",
    price: 32, badges: ["bestseller"], colours: [C.ivory, C.black], fabric: "recycledNylon", made: ["Vietnam", 300, 7.2],
    fit: "Regular fit, hip length. Model is 170 cm and wears S.",
    description: "A light, collarless quilted jacket with press-stud fastening. Wear it on its own or as a warm layer under a coat.",
    added: "2026-01-20", sold: 1050,
  },
  {
    id: "cotton-trench-coat", name: "Cotton trench coat", department: "women", category: "outerwear",
    price: 35, salePrice: 29, colours: [C.stone], soldOut: ["XXL"], fabric: "organicCotton", made: ["Portugal", 3400, 11.0],
    fit: "Relaxed fit with a belt, mid-calf length. Model is 174 cm and wears M.",
    description: "A double-breasted trench in water-repellent cotton gabardine, with a storm flap and belted cuffs.",
    added: "2026-02-27", sold: 480,
  },

  /* ---------------- Men: 16 ---------------- */
  {
    id: "oxford-shirt", name: "Oxford cotton shirt", department: "men", category: "shirts",
    price: 20, badges: ["bestseller"], colours: [C.sky, C.white], fabric: "organicCotton", made: ["India", 2200, 4.4],
    fit: "Regular fit. Model is 185 cm and wears M.",
    description: "A button-down Oxford shirt with a soft collar roll and a chest pocket. Smart with chinos, relaxed with jeans.",
    added: "2026-01-10", sold: 1510,
  },
  {
    id: "linen-short-sleeve-shirt", name: "Linen short-sleeve shirt", department: "men", category: "shirts",
    price: 18, badges: ["new"], colours: [C.greyPrint, C.ecru], fabric: "linen", made: ["Portugal", 1300, 3.6],
    fit: "Relaxed fit with a camp collar. Model is 183 cm and wears M.",
    description: "A breezy short-sleeve shirt with a camp collar and straight hem, made to be worn untucked.",
    added: "2026-10-26", sold: 210,
  },
  {
    id: "flannel-check-shirt", name: "Brushed flannel check shirt", department: "men", category: "shirts",
    price: 24, salePrice: 18, colours: [C.blueCheck, { name: "Rust check", hex: C.rust.hex }], fabric: "organicCotton", made: ["Bangladesh", 2500, 5.2],
    fit: "Regular fit. Model is 186 cm and wears L.",
    description: "A soft, brushed flannel shirt in a small check with two chest pockets. Warm enough to wear as a light jacket.",
    added: "2026-03-08", sold: 560,
  },
  {
    id: "heavyweight-tee", name: "Heavyweight cotton T-shirt", department: "men", category: "t-shirts",
    price: 17, badges: ["bestseller"], colours: [C.white, C.black, C.khaki], fabric: "organicCotton", made: ["Portugal", 1800, 3.0],
    fit: "Regular fit. Model is 184 cm and wears M.",
    description: "A dense 220gsm T-shirt with a tight ribbed neck that keeps its shape wash after wash.",
    added: "2026-02-02", sold: 1880,
  },
  {
    id: "pocket-tee", name: "Recycled cotton pocket T-shirt", department: "men", category: "t-shirts",
    price: 16, colours: [C.white, C.navy, C.grey], fabric: "recycledCotton", made: ["Portugal", 600, 2.1],
    fit: "Regular fit. Model is 182 cm and wears M.",
    description: "A mid-weight T-shirt with a chest pocket. Made from recycled cotton, so each batch has a subtle marl.",
    added: "2026-06-03", sold: 690,
  },
  {
    id: "waffle-long-sleeve-tee", name: "Contrast-trim T-shirt", department: "men", category: "t-shirts",
    price: 18, badges: ["new", "low-stock"], colours: [C.black, C.ecru], soldOut: ["S"], fabric: "organicCotton", made: ["Türkiye", 1900, 3.3],
    fit: "Regular fit. Model is 185 cm and wears M.",
    description: "A heavyweight cotton T-shirt with contrast piping around the neck and sleeves. Smart enough to wear with chinos.",
    added: "2026-11-01", sold: 140,
  },
  {
    id: "merino-v-neck", name: "Merino V-neck jumper", department: "men", category: "knitwear",
    price: 27, colours: [C.charcoal, C.navy], fabric: "merino", made: ["Italy", 4000, 10.0],
    fit: "Regular fit. Model is 186 cm and wears M.",
    description: "A fine merino jumper with a neat V-neck that sits well over a shirt collar.",
    added: "2026-08-30", sold: 720,
  },
  {
    id: "recycled-wool-crew", name: "Recycled wool crew-neck jumper", department: "men", category: "knitwear",
    price: 30, badges: ["new"], colours: [C.chocolate, C.oatmeal], fabric: "recycledWool", made: ["Italy", 500, 4.4],
    fit: "Relaxed fit. Model is 184 cm and wears M.",
    description: "A chunky crew-neck jumper knitted from re-spun wool, with saddle shoulders and a deep rib hem.",
    added: "2026-11-08", sold: 120,
  },
  {
    id: "cotton-quarter-zip", name: "Cotton quarter-zip jumper", department: "men", category: "knitwear",
    price: 25, salePrice: 19, colours: [C.mustard, C.navy], fabric: "organicCotton", made: ["Türkiye", 2000, 4.6],
    fit: "Regular fit. Model is 185 cm and wears L.",
    description: "A mid-weight cotton knit with a quarter-zip neck. Wear it zipped up on cold mornings or open over a tee.",
    added: "2026-04-12", sold: 640,
  },
  {
    id: "slim-chinos", name: "Slim stretch chinos", department: "men", category: "chinos",
    price: 20, badges: ["bestseller"], colours: [C.stone, C.navy, C.black], soldOut: ["XS"], fabric: "stretchCotton", made: ["Bangladesh", 2300, 5.0],
    fit: "Slim fit, tapered leg. Model is 185 cm and wears M.",
    description: "Everyday chinos with a touch of stretch, slanted front pockets and a clean finish at the hem.",
    added: "2026-01-25", sold: 1460,
  },
  {
    id: "relaxed-pleated-chinos", name: "Relaxed pleated chinos", department: "men", category: "chinos",
    price: 22, badges: ["new"], colours: [C.sageGrey, C.tan], fabric: "stretchCotton", made: ["Portugal", 2200, 4.9],
    fit: "Relaxed fit with a single pleat. Model is 183 cm and wears M.",
    description: "Roomier chinos with a single front pleat and a slightly cropped length. Look good with trainers or loafers.",
    added: "2026-10-18", sold: 180,
  },
  {
    id: "straight-jeans", name: "Straight-leg jeans", department: "men", category: "jeans",
    price: 25, badges: ["bestseller"], colours: [C.midBlue, C.black], fabric: "denim", made: ["Türkiye", 3200, 7.1],
    fit: "Straight leg, mid rise. Model is 186 cm and wears M.",
    description: "Classic five-pocket jeans in rigid denim that softens and moulds to you over the first few months.",
    added: "2026-02-09", sold: 1590,
  },
  {
    id: "slim-jeans", name: "Slim-fit jeans", department: "men", category: "jeans",
    price: 22, salePrice: 17, badges: ["low-stock"], colours: [C.midBlue], soldOut: ["S", "XXL"], fabric: "denim", made: ["Türkiye", 3000, 6.8],
    fit: "Slim fit, tapered leg. Model is 183 cm and wears M.",
    description: "A slim, tapered jean in a mid-blue wash with a little stretch for comfort.",
    added: "2026-03-30", sold: 700,
  },
  {
    id: "canvas-chore-jacket", name: "Canvas chore jacket", department: "men", category: "jackets",
    price: 33, badges: ["new"], colours: [C.sand, C.navy], fabric: "organicCotton", made: ["Portugal", 3600, 8.4],
    fit: "Boxy fit, hip length. Model is 185 cm and wears M.",
    description: "A sturdy workwear jacket in cotton canvas with three patch pockets and corozo buttons.",
    added: "2026-10-08", sold: 260,
  },
  {
    id: "recycled-padded-jacket", name: "Recycled padded jacket", department: "men", category: "jackets",
    price: 35, colours: [C.cream, C.black], fabric: "recycledPolyester", made: ["Vietnam", 260, 12.3],
    fit: "Regular fit with room to layer. Model is 186 cm and wears L.",
    description: "A warm padded jacket with a stand collar, two-way zip and a water-repellent finish.",
    added: "2026-09-22", sold: 410,
  },
  {
    id: "denim-trucker-jacket", name: "Denim trucker jacket", department: "men", category: "jackets",
    price: 30, colours: [C.midBlue], fabric: "denim", made: ["Türkiye", 3500, 7.9],
    fit: "Regular fit. Model is 184 cm and wears M.",
    description: "A classic trucker jacket with chest pockets and adjustable waist tabs. Gets better with every wear.",
    added: "2026-04-25", sold: 530,
  },

  /* ---------------- Unisex: 10 ---------------- */
  {
    id: "classic-hoodie", name: "Classic organic cotton hoodie", department: "unisex", category: "hoodies",
    price: 20, badges: ["bestseller"], colours: [C.lightGrey, C.black, C.navy], fabric: "cottonFleece", made: ["Portugal", 2600, 6.2],
    fit: "Regular fit. Models are 172 cm wearing S and 185 cm wearing M.",
    description: "A brushed-back hoodie with a double-layer hood and kangaroo pocket. Dense enough to keep its shape.",
    added: "2026-01-05", sold: 1720,
  },
  {
    id: "zip-through-hoodie", name: "Zip-through hoodie", department: "unisex", category: "hoodies",
    price: 22, badges: ["new"], colours: [C.stone, C.charcoal], fabric: "cottonFleece", made: ["Portugal", 2700, 6.4],
    fit: "Regular fit. Model is 180 cm and wears M.",
    description: "A full-zip hoodie with a metal zip, split pockets and ribbed cuffs. An easy extra layer.",
    added: "2026-10-28", sold: 200,
  },
  {
    id: "boxy-heavyweight-hoodie", name: "Boxy heavyweight hoodie", department: "unisex", category: "hoodies",
    price: 25, salePrice: 19, colours: [C.taupe, C.black], fabric: "cottonFleece", made: ["Türkiye", 2800, 6.6],
    fit: "Boxy, oversized fit. Size down for a closer fit. Model is 178 cm and wears M.",
    description: "A cropped, boxy hoodie in extra-heavy 450gsm fleece with dropped shoulders.",
    added: "2026-05-15", sold: 580,
  },
  {
    id: "everyday-tee", name: "Everyday organic tee", department: "unisex", category: "t-shirts",
    price: 15, badges: ["bestseller"], colours: [C.black, C.white, C.grey, C.navy], soldOut: ["XXL"], fabric: "organicCotton", made: ["India", 1300, 2.2],
    fit: "Regular fit. Models are 170 cm wearing S and 184 cm wearing M.",
    description: "Our everyday T-shirt in a mid-weight 180gsm jersey with a ribbed crew neck.",
    added: "2026-01-02", sold: 2340,
  },
  {
    id: "recycled-cotton-tee", name: "Recycled cotton tee", department: "unisex", category: "t-shirts",
    price: 16, badges: ["new"], colours: [C.taupe, C.ecru], fabric: "recycledCotton", made: ["Portugal", 500, 1.8],
    fit: "Regular fit. Model is 176 cm and wears M.",
    description: "A soft tee knitted from 60% recycled cotton. Uses much less water than a standard cotton tee.",
    added: "2026-11-04", sold: 150,
  },
  {
    id: "oversized-boxy-tee", name: "Oversized boxy tee", department: "unisex", category: "t-shirts",
    price: 18, badges: ["low-stock"], colours: [C.white, C.black], soldOut: ["M"], fabric: "organicCotton", made: ["Türkiye", 1500, 2.6],
    fit: "Oversized fit with dropped shoulders. Model is 180 cm and wears M.",
    description: "A wide, boxy tee with a slightly cropped length and a thick ribbed neck.",
    added: "2026-07-21", sold: 470,
  },
  {
    id: "straight-sweatpants", name: "Straight-leg sweatpants", department: "unisex", category: "sweatpants",
    price: 19, badges: ["bestseller"], colours: [C.lilac, C.grey, C.black], fabric: "cottonFleece", made: ["Portugal", 2300, 5.4],
    fit: "Relaxed straight leg with a drawstring waist. Model is 178 cm and wears M.",
    description: "Brushed-back sweatpants with an open hem, deep pockets and a back patch pocket.",
    added: "2026-01-12", sold: 1290,
  },
  {
    id: "cuffed-joggers", name: "Cuffed joggers", department: "unisex", category: "sweatpants",
    price: 18, colours: [C.black, C.navy], fabric: "cottonFleece", made: ["Türkiye", 2200, 5.2],
    fit: "Regular fit, tapered with cuffs. Model is 182 cm and wears M.",
    description: "Classic joggers with ribbed cuffs, zip pockets and a flat drawcord.",
    added: "2026-06-19", sold: 620,
  },
  {
    id: "corduroy-overshirt", name: "Corduroy overshirt", department: "unisex", category: "overshirts",
    price: 26, badges: ["new"], colours: [C.black, C.chocolate], fabric: "organicCotton", made: ["Portugal", 2900, 6.0],
    fit: "Relaxed fit. Model is 180 cm and wears M.",
    description: "A soft, mid-wale corduroy overshirt with two flap pockets. Wear it open over a tee or buttoned as a shirt.",
    added: "2026-10-15", sold: 240,
  },
  {
    id: "recycled-wool-overshirt", name: "Recycled wool overshirt", department: "unisex", category: "overshirts",
    price: 30, badges: ["low-stock"], colours: [C.darkTeal, C.camel], soldOut: ["XS", "L"], fabric: "recycledWool", made: ["Italy", 620, 6.8],
    fit: "Boxy fit. Model is 182 cm and wears M.",
    description: "A warm wool-blend overshirt with a lightly brushed finish. Heavy enough to replace a jacket on mild days.",
    added: "2026-09-09", sold: 330,
  },

  /* ---------------- Accessories: 4 ---------------- */
  {
    id: "canvas-tote", name: "Organic cotton canvas tote", department: "accessories", category: "bags",
    price: 16, badges: ["bestseller"], colours: [C.ecru, C.black], fabric: "organicCotton", made: ["India", 900, 1.4],
    fit: "40 x 38 x 12 cm with 65 cm handles. Holds a 15-inch laptop.",
    description: "A heavy canvas tote with a flat base, an inside zip pocket and shoulder-length handles.",
    added: "2026-01-15", sold: 1650,
  },
  {
    id: "ribbed-beanie", name: "Ribbed recycled wool beanie", department: "accessories", category: "hats",
    price: 15, badges: ["new"], colours: [C.grey, C.charcoal, C.oatmeal], fabric: "recycledWool", made: ["Italy", 90, 0.8],
    fit: "One size with a deep fold-over cuff.",
    description: "A soft rib beanie in re-spun wool. Warm, light and it doesn't itch.",
    added: "2026-11-06", sold: 260,
  },
  {
    id: "recycled-wool-scarf", name: "Recycled wool scarf", department: "accessories", category: "scarves",
    price: 19, colours: [C.greyCheck, C.camel], fabric: "recycledWool", made: ["Italy", 210, 1.9],
    fit: "180 x 30 cm with fringed ends.",
    description: "A generous scarf woven from re-spun wool, with a soft brushed finish.",
    added: "2026-09-29", sold: 540,
  },
  {
    id: "organic-socks-3-pack", name: "Organic cotton socks, 3-pack", department: "accessories", category: "socks",
    price: 15, badges: ["bestseller"], colours: [{ name: "Grey mix", hex: "#8A8B88" }, { name: "Ecru mix", hex: C.ecru.hex }], fabric: "sockBlend", made: ["Portugal", 300, 0.9],
    fit: "One size, fits IE/UK shoe sizes 4-11.",
    description: "Three pairs of ribbed crew socks with a reinforced heel and toe.",
    added: "2026-02-20", sold: 1980,
  },
]

/* ------------------------------------------------------------------ */
/* Build final product objects                                         */
/* ------------------------------------------------------------------ */

const genderOf = (d: Department): Gender => (d === "accessories" ? "unisex" : d)

export const products: Product[] = catalogue.map((e) => {
  const fabric = FABRICS[e.fabric]
  const [factoryCountry, waterLitres, co2Kg] = e.made
  return {
    id: e.id,
    name: e.name,
    department: e.department,
    gender: genderOf(e.department),
    category: e.category,
    price: e.price,
    salePrice: e.salePrice,
    badges: e.badges ?? [],
    colours: e.colours,
    sizes: e.department === "accessories" ? ONE_SIZE : CLOTHING,
    soldOut: e.soldOut ?? [],
    description: e.description,
    fit: e.fit,
    material: fabric.label,
    composition: fabric.composition,
    care: fabric.care,
    sustainability: {
      materialSource: fabric.source,
      recycledPercent: fabric.recycled,
      factoryCountry,
      waterLitres,
      co2Kg,
      endOfLife: fabric.endOfLife,
    },
    reviews: e.reviews ?? pickReviews(e.id, e.category),
    added: e.added,
    sold: e.sold,
    completeTheLook: e.completeTheLook,
  }
})

/* ------------------------------------------------------------------ */
/* Labels and lookups                                                  */
/* ------------------------------------------------------------------ */

export const departments: { slug: Department; name: string }[] = [
  { slug: "women", name: "Women" },
  { slug: "men", name: "Men" },
  { slug: "unisex", name: "Unisex" },
  { slug: "accessories", name: "Accessories" },
]

export const categoryLabels: Record<Category, string> = {
  dresses: "Dresses", blouses: "Blouses", knitwear: "Knitwear", trousers: "Trousers",
  skirts: "Skirts", outerwear: "Outerwear", shirts: "Shirts", "t-shirts": "T-shirts",
  chinos: "Chinos", jeans: "Jeans", jackets: "Jackets", hoodies: "Hoodies",
  sweatpants: "Sweatpants", overshirts: "Overshirts", bags: "Tote bags", hats: "Beanies",
  scarves: "Scarves", socks: "Socks",
}

export const badgeLabels: Record<BadgeKind, string> = {
  new: "New",
  bestseller: "Bestseller",
  "low-stock": "Low stock",
}

export const getProduct = (id: string) => products.find((p) => p.id === id)

/** "Sky blue" -> "sky-blue", used for ?colour= links */
export const colourSlug = (name: string) =>
  name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")

/** Find a product colour from a ?colour= value (slug or name, any case). */
export const findColour = (p: { colours: Swatch[] }, value?: string | null) => {
  if (!value) return undefined
  const v = colourSlug(value)
  return p.colours.find((c) => colourSlug(c.name) === v)
}

export const currentPrice = (p: Product) => p.salePrice ?? p.price
export const isOnSale = (p: Product) => p.salePrice !== undefined && p.salePrice < p.price

export const averageRating = (p: Product) =>
  p.reviews.length ? p.reviews.reduce((n, r) => n + r.rating, 0) / p.reviews.length : 0

export const newArrivals = (n = 8) =>
  [...products].sort((a, b) => b.added.localeCompare(a.added)).slice(0, n)

export const bestsellers = (n = 8) => [...products].sort((a, b) => b.sold - a.sold).slice(0, n)

/** Garment shapes the homepage rail can draw, by category. */
export const railKind: Partial<Record<Category, "tee" | "knit" | "hoodie" | "shirt" | "jacket" | "coat">> = {
  "t-shirts": "tee", knitwear: "knit", hoodies: "hoodie", shirts: "shirt", blouses: "shirt",
  overshirts: "shirt", jackets: "jacket", outerwear: "coat",
}

/* ------------------------------------------------------------------ */
/* Recommendations                                                     */
/* ------------------------------------------------------------------ */

const TOPS: Category[] = ["blouses", "shirts", "t-shirts", "knitwear", "hoodies", "overshirts"]
const BOTTOMS: Category[] = ["trousers", "skirts", "chinos", "jeans", "sweatpants"]
const LAYERS: Category[] = ["outerwear", "jackets", "overshirts", "knitwear"]
const ACCESSORIES: Category[] = ["bags", "hats", "scarves", "socks"]

const wears = (p: Product, viewer: Product) =>
  p.gender === "unisex" || viewer.gender === "unisex" || p.gender === viewer.gender

/** Pick one product from `cats` that suits `viewer`, stable per viewer. */
function pickFrom(viewer: Product, cats: Category[], exclude: Set<string>) {
  const pool = products.filter(
    (p) => cats.includes(p.category) && wears(p, viewer) && !exclude.has(p.id) && p.department === viewer.department
  )
  const fallback = products.filter((p) => cats.includes(p.category) && wears(p, viewer) && !exclude.has(p.id))
  const list = pool.length ? pool : fallback
  if (!list.length) return undefined
  return list[hash(viewer.id + cats.join()) % list.length]
}

export function completeTheLook(p: Product): Product[] {
  if (p.completeTheLook?.length) {
    return p.completeTheLook.map(getProduct).filter((x): x is Product => Boolean(x))
  }
  const plan: Category[][] = TOPS.includes(p.category)
    ? [BOTTOMS, LAYERS.filter((c) => c !== p.category), ACCESSORIES]
    : BOTTOMS.includes(p.category)
      ? [TOPS, LAYERS, ACCESSORIES]
      : p.category === "dresses"
        ? [["knitwear"], ["outerwear"], ["bags", "scarves", "hats"]]
        : ["outerwear", "jackets"].includes(p.category)
          ? [TOPS, BOTTOMS, ["scarves", "hats"]]
          : [TOPS, BOTTOMS, LAYERS]
  const used = new Set([p.id])
  const out: Product[] = []
  for (const cats of plan) {
    const pick = pickFrom(p, cats, used)
    if (pick) {
      used.add(pick.id)
      out.push(pick)
    }
  }
  return out
}

export function youMayAlsoLike(p: Product, n = 4): Product[] {
  const exclude = new Set([p.id, ...completeTheLook(p).map((x) => x.id)])
  const same = products.filter((x) => !exclude.has(x.id) && x.category === p.category && wears(x, p))
  const dept = products
    .filter((x) => !exclude.has(x.id) && x.department === p.department && !same.includes(x))
    .sort((a, b) => b.sold - a.sold)
  const popular = bestsellers(products.length).filter(
    (x) => !exclude.has(x.id) && !same.includes(x) && !dept.includes(x) && wears(x, p)
  )
  return [...same, ...dept, ...popular].slice(0, n)
}

/* ------------------------------------------------------------------ */

export const formatPrice = (value: number) =>
  new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: value % 1 === 0 ? 0 : 2,
  }).format(value)
