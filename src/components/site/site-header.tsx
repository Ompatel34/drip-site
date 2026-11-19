"use client"

import { useEffect, useId, useRef, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronDown, Heart, Menu, Search, ShoppingBag } from "lucide-react"
import { cn } from "cn"

import { Button } from "@/components/ui/button"
import { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { useCart, useWishlist } from "@/components/site/store-provider"
import { navMenus, type NavMenu } from "@/lib/navigation"

/* ------------------------------------------------------------------ */

function SearchField({ id, className }: { id: string; className?: string }) {
  return (
    <form action="/shop" method="get" role="search" className={cn("relative", className)}>
      <label htmlFor={id} className="sr-only">
        Search products, colours or materials
      </label>
      <Search
        aria-hidden
        className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-muted-foreground"
        strokeWidth={1.75}
      />
      <input
        id={id}
        name="q"
        type="search"
        placeholder="Search products, colours or materials"
        autoComplete="off"
        className="h-12 w-full rounded-sm border border-input bg-background pr-4 pl-12 text-base placeholder:text-muted-foreground focus-visible:border-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      />
    </form>
  )
}

function CountBadge({ count, label }: { count: number; label: string }) {
  return (
    <>
      {count > 0 && (
        <span
          aria-hidden
          className="absolute top-1.5 right-1 inline-flex h-5 min-w-5 items-center justify-center bg-foreground px-1 text-xs leading-none font-semibold text-background"
        >
          {count > 99 ? "99+" : count}
        </span>
      )}
      <span className="sr-only">
        {label}, {count} {count === 1 ? "item" : "items"}
      </span>
    </>
  )
}

function HeaderIcons() {
  const cart = useCart()
  const wishlist = useWishlist()
  return (
    <div className="-mr-3 flex items-center justify-end">
      <Button asChild variant="ghost" size="icon" className="relative">
        <Link href="/wishlist">
          <Heart aria-hidden strokeWidth={1.75} />
          <CountBadge count={wishlist.count} label="Favourites" />
        </Link>
      </Button>
      <Button asChild variant="ghost" size="icon" className="relative">
        <Link href="/cart">
          <ShoppingBag aria-hidden strokeWidth={1.75} />
          <CountBadge count={cart.count} label="Bag" />
        </Link>
      </Button>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Desktop: click / tap / keyboard disclosure menus (never hover-only) */

function MenuPanel({ menu, id }: { menu: NavMenu; id: string }) {
  return (
    <div id={id} className="absolute inset-x-0 top-full border-y border-border bg-background">
      <div className="page-container grid grid-cols-12 gap-6 py-8">
        <div className="col-span-3">
          <p className="label-caps mb-3 text-muted-foreground">Highlights</p>
          <ul>
            {menu.highlights.map((l) => (
              <li key={l.label}>
                <Link href={l.href} className="flex min-h-11 items-center text-base font-semibold hover:underline hover:underline-offset-4">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="col-span-6">
          <p className="label-caps mb-3 text-muted-foreground">
            {menu.label === "Pre-loved" ? "Pre-loved" : "Categories"}
          </p>
          <ul className="grid grid-cols-2 gap-x-6">
            {menu.categories.map((l) => (
              <li key={l.label}>
                <Link href={l.href} className="flex min-h-11 items-center text-base hover:underline hover:underline-offset-4">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="col-span-3 flex items-start justify-end">
          <Button asChild variant="outline">
            <Link href={menu.all.href}>{menu.all.label}</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

function DesktopNav() {
  const [open, setOpen] = useState<string | null>(null)
  const navRef = useRef<HTMLElement>(null)
  const baseId = useId()

  // Close on outside click and on Escape (returning focus to the trigger).
  useEffect(() => {
    if (!open) return
    const onPointer = (e: PointerEvent) => {
      if (!navRef.current?.contains(e.target as Node)) setOpen(null)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return
      const trigger = navRef.current?.querySelector<HTMLButtonElement>(`[data-menu="${open}"]`)
      setOpen(null)
      trigger?.focus()
    }
    document.addEventListener("pointerdown", onPointer)
    document.addEventListener("keydown", onKey)
    return () => {
      document.removeEventListener("pointerdown", onPointer)
      document.removeEventListener("keydown", onKey)
    }
  }, [open])

  return (
    <nav ref={navRef} aria-label="Main" className="hidden lg:block" onClick={(e) => {
      // Close after following a link inside a panel.
      if ((e.target as HTMLElement).closest("a")) setOpen(null)
    }}>
      <ul className="page-container flex h-12 items-center justify-center gap-2">
        {navMenus.map((m) => {
          const isOpen = open === m.label
          const panelId = `${baseId}-${m.label}`
          return (
            <li key={m.label}>
              <button
                type="button"
                data-menu={m.label}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? null : m.label)}
                className={cn(
                  "inline-flex h-12 items-center gap-1 border-b-2 px-3 text-[15px] font-medium",
                  isOpen ? "border-foreground" : "border-transparent hover:border-border"
                )}
              >
                {m.label}
                <ChevronDown
                  aria-hidden
                  className={cn("size-4 transition-transform", isOpen && "rotate-180")}
                  strokeWidth={1.75}
                />
              </button>
              {isOpen && <MenuPanel menu={m} id={panelId} />}
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

/* ------------------------------------------------------------------ */
/* Mobile: drawer with accordion sections                              */

function MobileNav() {
  const [section, setSection] = useState<string | null>(null)
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="-ml-3 lg:hidden" aria-label="Open menu">
          <Menu aria-hidden />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="gap-0 overflow-y-auto p-0">
        <div className="flex h-16 items-center border-b border-border px-6">
          <SheetTitle className="font-heading text-xl font-bold tracking-tight">DRIP</SheetTitle>
        </div>
        <nav aria-label="Main">
          <ul>
            {navMenus.map((m) => {
              const isOpen = section === m.label
              const id = `m-${m.label}`
              return (
                <li key={m.label} className="border-b border-border">
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={id}
                    onClick={() => setSection(isOpen ? null : m.label)}
                    className="flex min-h-14 w-full items-center justify-between px-6 text-base font-semibold"
                  >
                    {m.label}
                    <ChevronDown aria-hidden className={cn("size-5 transition-transform", isOpen && "rotate-180")} strokeWidth={1.75} />
                  </button>
                  {isOpen && (
                    <ul id={id} className="pb-3">
                      {[...m.highlights, ...m.categories, m.all].map((l, i) => (
                        <li key={l.label + i}>
                          <SheetClose asChild>
                            <Link
                              href={l.href}
                              className={cn(
                                "flex min-h-12 items-center px-8 text-base hover:bg-surface",
                                i < m.highlights.length && "font-medium"
                              )}
                            >
                              {l.label}
                            </Link>
                          </SheetClose>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              )
            })}
          </ul>
        </nav>
      </SheetContent>
    </Sheet>
  )
}

/* ------------------------------------------------------------------ */

export function SiteHeader() {
  const searchId = useId()
  const mobileSearchId = useId()
  const pathname = usePathname()

  return (
    <header key={pathname} className="sticky top-0 z-40 border-b border-border bg-background">
      <div className="page-container flex h-16 items-center gap-4 lg:h-[72px] lg:gap-8">
        <div className="flex items-center gap-1">
          <MobileNav />
          <Link href="/" className="font-heading text-2xl leading-none font-bold tracking-[-0.02em]">
            DRIP<span className="sr-only"> home</span>
          </Link>
        </div>
        <SearchField id={searchId} className="mx-auto hidden w-full max-w-[520px] md:block" />
        <div className="ml-auto md:ml-0">
          <HeaderIcons />
        </div>
      </div>

      <div className="page-container pb-3 md:hidden">
        <SearchField id={mobileSearchId} />
      </div>

      <div className="hidden border-t border-border lg:block">
        <DesktopNav />
      </div>
    </header>
  )
}
