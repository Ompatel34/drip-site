"use client"

import { useId, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { SlidersHorizontal } from "lucide-react"
import { cn } from "cn"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { applyFilters, facetOptions, shopHref, SORTS, type Filters, type Sort } from "@/lib/shop"
import { PRICE_MAX, PRICE_MIN } from "@/lib/store"

/* ------------------------------------------------------------------ */

function OptionChip({
  name,
  value,
  checked,
  disabled,
  onChange,
  children,
}: {
  name: string
  value: string
  checked: boolean
  disabled?: boolean
  onChange: (checked: boolean) => void
  children: React.ReactNode
}) {
  return (
    <label className={cn("cursor-pointer", disabled && !checked && "cursor-not-allowed")}>
      <input
        type="checkbox"
        name={name}
        value={value}
        checked={checked}
        disabled={disabled && !checked}
        onChange={(e) => onChange(e.target.checked)}
        className="peer sr-only"
      />
      <span
        className={cn(
          "inline-flex min-h-12 items-center gap-2 rounded-sm border px-4 text-[15px] transition-colors",
          "peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ring",
          "border-input hover:border-foreground peer-checked:border-foreground peer-checked:bg-foreground peer-checked:text-background",
          "peer-disabled:border-border peer-disabled:text-muted-foreground peer-disabled:hover:border-border"
        )}
      >
        {children}
      </span>
    </label>
  )
}

function Group({ legend, children }: { legend: string; children: React.ReactNode }) {
  return (
    <fieldset className="border-b border-border px-6 py-5">
      <legend className="float-left mb-3 w-full text-base font-semibold">{legend}</legend>
      <div className="clear-both flex flex-wrap gap-2">{children}</div>
    </fieldset>
  )
}

const toggle = <T,>(arr: T[], v: T, on: boolean) => (on ? [...new Set([...arr, v])] : arr.filter((x) => x !== v))

/* ------------------------------------------------------------------ */

export function FilterDrawer({ filters, activeCount }: { filters: Filters; activeCount: number }) {
  const router = useRouter()
  const id = useId()
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState<Filters>(filters)

  const facets = useMemo(() => facetOptions(draft), [draft])
  const resultCount = useMemo(() => applyFilters(draft).length, [draft])
  const set = (patch: Partial<Filters>) => setDraft((d) => ({ ...d, ...patch }))

  const priceInput = (key: "min" | "max", label: string) => (
    <label className="flex flex-1 flex-col gap-1 text-[15px]">
      {label}
      <input
        type="number"
        inputMode="numeric"
        min={PRICE_MIN}
        max={PRICE_MAX}
        step={1}
        value={draft[key] ?? ""}
        placeholder={String(key === "min" ? PRICE_MIN : PRICE_MAX)}
        onChange={(e) => set({ [key]: e.target.value === "" ? undefined : Number(e.target.value) })}
        className="h-12 w-full rounded-sm border border-input bg-background px-3 text-base focus-visible:border-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      />
    </label>
  )

  const apply = () => {
    let { min, max } = draft
    const clamp = (n?: number) => (n === undefined || Number.isNaN(n) ? undefined : Math.min(PRICE_MAX, Math.max(PRICE_MIN, Math.round(n))))
    min = clamp(min)
    max = clamp(max)
    if (min !== undefined && max !== undefined && min > max) [min, max] = [max, min]
    setOpen(false)
    router.push(shopHref({ ...draft, min, max }))
  }

  return (
    <Sheet
      open={open}
      onOpenChange={(o) => {
        if (o) setDraft(filters) // start from what's applied
        setOpen(o)
      }}
    >
      <SheetTrigger asChild>
        <Button variant="outline">
          <SlidersHorizontal aria-hidden className="size-5" strokeWidth={1.75} />
          Filters{activeCount > 0 && ` (${activeCount})`}
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="gap-0 p-0">
        <div className="shrink-0 border-b border-border px-6 py-5 pr-16">
          <SheetTitle className="font-heading text-xl font-semibold">Filter products</SheetTitle>
          <SheetDescription className="mt-1 text-[15px] text-muted-foreground">
            Choose as many as you like, then show the results.
          </SheetDescription>
        </div>

        <form
          id={id}
          className="min-h-0 flex-1 overflow-y-auto overscroll-contain"
          onSubmit={(e) => {
            e.preventDefault()
            apply()
          }}
        >
          {facets.categories.length > 1 && (
            <Group legend="Category">
              {facets.categories.map((o) => (
                <OptionChip
                  key={o.value}
                  name="category"
                  value={o.value}
                  checked={draft.categories.includes(o.value)}
                  disabled={o.count === 0}
                  onChange={(on) => set({ categories: toggle(draft.categories, o.value, on) })}
                >
                  {o.label} <span className="opacity-70">({o.count})</span>
                </OptionChip>
              ))}
            </Group>
          )}

          <Group legend="Gender">
            {facets.genders.map((o) => (
              <OptionChip
                key={o.value}
                name="gender"
                value={o.value}
                checked={draft.genders.includes(o.value)}
                disabled={o.count === 0}
                onChange={(on) => set({ genders: toggle(draft.genders, o.value, on) })}
              >
                {o.label} <span className="opacity-70">({o.count})</span>
              </OptionChip>
            ))}
          </Group>

          <Group legend="Size (in stock)">
            {facets.sizes.map((o) => (
              <OptionChip
                key={o.value}
                name="size"
                value={o.value}
                checked={draft.sizes.includes(o.value)}
                disabled={o.count === 0}
                onChange={(on) => set({ sizes: toggle(draft.sizes, o.value, on) })}
              >
                {o.value}
              </OptionChip>
            ))}
          </Group>

          <Group legend="Colour">
            {facets.colours.map((o) => (
              <OptionChip
                key={o.value}
                name="colour"
                value={o.value}
                checked={draft.colours.includes(o.value)}
                disabled={o.count === 0}
                onChange={(on) => set({ colours: toggle(draft.colours, o.value, on) })}
              >
                <span aria-hidden className="size-4 shrink-0 border border-[#BDBAB3]" style={{ backgroundColor: o.hex }} />
                {o.name} <span className="opacity-70">({o.count})</span>
              </OptionChip>
            ))}
          </Group>

          <fieldset className="border-b border-border px-6 py-5">
            <legend className="float-left mb-3 w-full text-base font-semibold">Price (€)</legend>
            <div className="clear-both flex gap-3">
              {priceInput("min", "Min")}
              {priceInput("max", "Max")}
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              All prices are between €{PRICE_MIN} and €{PRICE_MAX}.
            </p>
          </fieldset>

          <Group legend="Offers">
            <OptionChip name="badge" value="new" checked={draft.badge === "new"} onChange={(on) => set({ badge: on ? "new" : undefined })}>
              New in
            </OptionChip>
            <OptionChip name="badge" value="bestseller" checked={draft.badge === "bestseller"} onChange={(on) => set({ badge: on ? "bestseller" : undefined })}>
              Bestsellers
            </OptionChip>
            <OptionChip name="sale" value="1" checked={draft.sale} onChange={(on) => set({ sale: on })}>
              Sale
            </OptionChip>
          </Group>
        </form>

        <div className="flex shrink-0 gap-3 border-t border-border px-6 py-4">
          <Button
            type="button"
            variant="outline"
            className="flex-1 px-3"
            onClick={() =>
              setDraft({ ...draft, categories: [], genders: [], sizes: [], colours: [], min: undefined, max: undefined, badge: undefined, sale: false })
            }
          >
            Clear all
          </Button>
          <Button type="submit" form={id} className="flex-[2] px-3" disabled={resultCount === 0}>
            {resultCount === 0 ? "No results" : `Show ${resultCount} ${resultCount === 1 ? "result" : "results"}`}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}

/* ------------------------------------------------------------------ */

export function SortSelect({ filters }: { filters: Filters }) {
  const router = useRouter()
  const id = useId()
  return (
    <div className="flex items-center gap-2">
      <label htmlFor={id} className="text-[15px] font-medium whitespace-nowrap">
        Sort by
      </label>
      <select
        id={id}
        value={filters.sort}
        onChange={(e) => router.push(shopHref({ ...filters, sort: e.target.value as Sort }), { scroll: false })}
        className="h-12 min-w-0 rounded-sm border border-input bg-background pr-8 pl-3 text-[15px] focus-visible:border-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      >
        {SORTS.map((s) => (
          <option key={s.value} value={s.value}>
            {s.label}
          </option>
        ))}
      </select>
    </div>
  )
}
