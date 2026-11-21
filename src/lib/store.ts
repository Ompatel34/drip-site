/** Single source of truth for store-wide promises and delivery options. */
export const FREE_DELIVERY_THRESHOLD = 20
export const RETURNS_DAYS = 30
export const CURRENCY = "EUR"

export const DELIVERY_OPTIONS = {
  standard: { label: "Standard delivery", days: "2-4 working days", cost: 4.95 },
  express: { label: "Express delivery", days: "1-2 working days", cost: 9.95 },
} as const

export type DeliveryMethod = keyof typeof DELIVERY_OPTIONS

/** Standard delivery is free at or over the threshold; express is always charged. */
export const deliveryCost = (subtotal: number, method: DeliveryMethod = "standard") =>
  method === "standard" && subtotal >= FREE_DELIVERY_THRESHOLD
    ? 0
    : DELIVERY_OPTIONS[method].cost

/** Every product price must sit inside this range. */
export const PRICE_MIN = 15
export const PRICE_MAX = 35

export const PROTOTYPE_NOTICE = "Prototype store - no real products or orders."
