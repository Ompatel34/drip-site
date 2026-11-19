"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react"

/*
 * Cart and wishlist live in React context and are saved to localStorage so
 * they survive reloads. Nothing is ever sent to a server.
 */

export type CartLine = {
  productId: string
  colour: string
  size: string
  qty: number
}

export const lineKey = (l: Pick<CartLine, "productId" | "colour" | "size">) =>
  `${l.productId}|${l.colour}|${l.size}`

const MAX_QTY = 10
const CART_KEY = "drip-cart-v1"
const WISHLIST_KEY = "drip-wishlist-v1"

type CartContextValue = {
  ready: boolean
  lines: CartLine[]
  count: number
  addItem: (line: Omit<CartLine, "qty">, qty?: number) => void
  setQty: (key: string, qty: number) => void
  removeItem: (key: string) => void
  clear: () => void
  /** Last line added, used to open the mini-cart drawer. */
  lastAdded: { line: CartLine; at: number } | null
}

type WishlistContextValue = {
  ready: boolean
  ids: string[]
  count: number
  has: (id: string) => boolean
  toggle: (id: string) => void
  remove: (id: string) => void
}

const CartContext = createContext<CartContextValue | null>(null)
const WishlistContext = createContext<WishlistContextValue | null>(null)

function read<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

function write(key: string, value: unknown) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Storage full or blocked (private mode): the session still works.
  }
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false)
  const [lines, setLines] = useState<CartLine[]>([])
  const [ids, setIds] = useState<string[]>([])
  const [lastAdded, setLastAdded] = useState<CartContextValue["lastAdded"]>(null)

  // Load once on the client. Server render starts empty, then hydrates.
  useEffect(() => {
    const savedLines = read<CartLine[]>(CART_KEY, [])
    const savedIds = read<string[]>(WISHLIST_KEY, [])
    /* eslint-disable react-hooks/set-state-in-effect -- one-off hydration from localStorage */
    setLines(Array.isArray(savedLines) ? savedLines : [])
    setIds(Array.isArray(savedIds) ? savedIds : [])
    setReady(true)
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [])

  useEffect(() => {
    if (ready) write(CART_KEY, lines)
  }, [ready, lines])

  useEffect(() => {
    if (ready) write(WISHLIST_KEY, ids)
  }, [ready, ids])

  // Keep tabs in sync.
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === CART_KEY) setLines(read<CartLine[]>(CART_KEY, []))
      if (e.key === WISHLIST_KEY) setIds(read<string[]>(WISHLIST_KEY, []))
    }
    window.addEventListener("storage", onStorage)
    return () => window.removeEventListener("storage", onStorage)
  }, [])

  const addItem = useCallback<CartContextValue["addItem"]>((line, qty = 1) => {
    setLines((prev) => {
      const key = lineKey(line)
      const existing = prev.find((l) => lineKey(l) === key)
      if (existing) {
        return prev.map((l) =>
          lineKey(l) === key ? { ...l, qty: Math.min(MAX_QTY, l.qty + qty) } : l
        )
      }
      return [...prev, { ...line, qty }]
    })
    // `qty` here is the amount just added, for the mini-cart message.
    setLastAdded({ line: { ...line, qty }, at: Date.now() })
  }, [])

  const setQty = useCallback((key: string, qty: number) => {
    setLines((prev) =>
      qty <= 0
        ? prev.filter((l) => lineKey(l) !== key)
        : prev.map((l) => (lineKey(l) === key ? { ...l, qty: Math.min(MAX_QTY, qty) } : l))
    )
  }, [])

  const removeItem = useCallback((key: string) => {
    setLines((prev) => prev.filter((l) => lineKey(l) !== key))
  }, [])

  const clear = useCallback(() => setLines([]), [])

  const toggle = useCallback((id: string) => {
    setIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }, [])

  const remove = useCallback((id: string) => {
    setIds((prev) => prev.filter((x) => x !== id))
  }, [])

  const cart = useMemo<CartContextValue>(
    () => ({
      ready,
      lines,
      count: lines.reduce((n, l) => n + l.qty, 0),
      addItem,
      setQty,
      removeItem,
      clear,
      lastAdded,
    }),
    [ready, lines, addItem, setQty, removeItem, clear, lastAdded]
  )

  const wishlist = useMemo<WishlistContextValue>(
    () => ({
      ready,
      ids,
      count: ids.length,
      has: (id) => ids.includes(id),
      toggle,
      remove,
    }),
    [ready, ids, toggle, remove]
  )

  return (
    <CartContext.Provider value={cart}>
      <WishlistContext.Provider value={wishlist}>{children}</WishlistContext.Provider>
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error("useCart must be used inside <StoreProvider>")
  return ctx
}

export function useWishlist() {
  const ctx = useContext(WishlistContext)
  if (!ctx) throw new Error("useWishlist must be used inside <StoreProvider>")
  return ctx
}
