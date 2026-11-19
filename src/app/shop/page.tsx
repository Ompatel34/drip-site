import type { Metadata } from "next"
import Link from "next/link"
import { Search, X } from "lucide-react"
import { cn } from "cn"

import { Button } from "@/components/ui/button"
import { ProductGrid } from "@/components/site/product-card"
import { FilterDrawer, SortSelect } from "@/components/site/shop-controls"
import { categoryLabels, departments } from "@/lib/products"
import { activeChips, applyFilters, parseFilters, shopHref, sortProducts } from "@/lib/shop"

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> }

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const f = parseFilters(await searchParams)
  if (f.q) return { title: `Search: ${f.q} | Drip` }
  return { title: `${departments.find((d) => d.slug === f.dept)?.name ?? "Shop all"} | Drip` }
}

export default async function ShopPage({ searchParams }: Props) {
  const f = parseFilters(await searchParams)
  const items = sortProducts(applyFilters(f), f.sort)
  const chips = activeChips(f)
  const dept = departments.find((d) => d.slug === f.dept)

  const heading = f.q
    ? `Results for “${f.q}”`
    : f.sale
      ? `${dept ? `${dept.name}: ` : ""}Last chance`
      : f.badge === "new"
        ? `${dept ? `${dept.name}: ` : ""}New in`
        : f.badge === "bestseller"
          ? `${dept ? `${dept.name}: ` : ""}Bestsellers`
          : f.categories.length === 1
            ? `${dept ? `${dept.name} · ` : ""}${categoryLabels[f.categories[0]]}`
            : (dept?.name ?? "Shop all")

  const tabs = [{ slug: undefined, name: "All" }, ...departments]
  // Filters inside the drawer (department and search are shown elsewhere)
  const drawerCount =
    f.categories.length + f.genders.length + f.sizes.length + f.colours.length +
    (f.min !== undefined || f.max !== undefined ? 1 : 0) + (f.badge ? 1 : 0) + (f.sale ? 1 : 0)

  return (
    <div className="page-container pt-10 pb-20 lg:pt-14 lg:pb-28">
      <nav aria-label="Breadcrumb" className="mb-4 text-sm text-muted-foreground">
        <ol className="flex gap-2">
          <li>
            <Link href="/" className="hover:text-foreground hover:underline">Home</Link>
          </li>
          <li aria-hidden>/</li>
          <li aria-current="page" className="text-foreground">{dept?.name ?? "Shop"}</li>
        </ol>
      </nav>

      <div className="flex flex-wrap items-end justify-between gap-6">
        <h1 className="min-w-0 text-[32px] break-words lg:text-[40px]">{heading}</h1>

        {/* Search within the shop; keeps the current department */}
        <form action="/shop" method="get" role="search" className="relative w-full max-w-md">
          {f.dept && <input type="hidden" name="dept" value={f.dept} />}
          <label htmlFor="shop-search" className="sr-only">
            Search products, colours or materials
          </label>
          <Search aria-hidden className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-muted-foreground" strokeWidth={1.75} />
          <input
            id="shop-search"
            name="q"
            type="search"
            defaultValue={f.q}
            placeholder="Search products, colours or materials"
            className="h-12 w-full rounded-sm border border-input bg-background pr-28 pl-12 text-base placeholder:text-muted-foreground focus-visible:border-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          />
          <Button type="submit" className="absolute top-0 right-0 h-12 px-4">
            Search
          </Button>
        </form>
      </div>

      <nav aria-label="Departments" className="mt-6 min-w-0 max-w-full overflow-x-auto border-b border-border">
        <ul className="-mb-px flex gap-6">
          {tabs.map((t) => {
            const active = t.slug === f.dept
            return (
              <li key={t.name}>
                <Link
                  href={shopHref({ dept: t.slug, q: f.q, sort: f.sort })}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "inline-flex h-12 items-center border-b-2 text-[15px] font-medium whitespace-nowrap",
                    active ? "border-foreground text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"
                  )}
                >
                  {t.name}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Toolbar */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <FilterDrawer key={JSON.stringify(f)} filters={f} activeCount={drawerCount} />
          <p className="text-[15px] text-muted-foreground" aria-live="polite">
            {items.length} {items.length === 1 ? "item" : "items"}
          </p>
        </div>
        <SortSelect filters={f} />
      </div>

      {chips.length > 0 && (
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="sr-only">Active filters:</span>
          {chips.map((c) => (
            <Link
              key={c.label}
              href={c.href}
              aria-label={`Remove filter: ${c.label}`}
              className="inline-flex min-h-11 items-center gap-2 rounded-sm border border-border bg-surface px-3 text-[15px] hover:border-foreground"
            >
              {c.label}
              <X aria-hidden className="size-4" strokeWidth={1.75} />
            </Link>
          ))}
          <Link href={shopHref({ dept: f.dept })} className="ml-1 inline-flex min-h-11 items-center px-1 text-[15px] font-medium underline underline-offset-4">
            Clear all
          </Link>
        </div>
      )}

      <div className="mt-8 lg:mt-10">
        {items.length > 0 ? (
          <ProductGrid products={items} />
        ) : (
          <div className="border border-border bg-surface px-6 py-12 text-center">
            <p className="text-lg font-semibold">Nothing matches those filters</p>
            <p className="mx-auto mt-2 max-w-[50ch] text-muted-foreground">
              Try removing a filter or searching for something broader, like a colour or a material.
            </p>
            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
              <Button asChild>
                <Link href={shopHref({ dept: f.dept })}>Clear filters</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/shop">See everything</Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
