"use client"

/*
 * Snap & Quote: a demo of selling an item back. No AI and no uploads: photos
 * preview in the browser only. Step, checklist and route live in the URL
 * (?step=2&issues=pilling,faded&route=post) so the browser back button works.
 */
import { useEffect, useId, useRef, useState } from "react"
import Link from "next/link"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Check } from "lucide-react"
import { cn } from "cn"

import { Button } from "@/components/ui/button"
import {
  buybackFor,
  CONDITION_ISSUES,
  gradeFromIssues,
  PRELOVED_BONUS,
} from "@/lib/buyback"
import { formatPrice } from "@/lib/products"

const STEPS = ["Photos", "Your estimate", "Route", "Done"] as const
type Route = "post" | "store"
const ISSUE_IDS = CONDITION_ISSUES.map((i) => i.id) as string[]

/** Stable made-up reference, e.g. DRIP-4F7K2 (same inputs, same code). */
function makeCode(seed: string) {
  let h = 2166136261
  for (const ch of seed) h = Math.imul(h ^ ch.charCodeAt(0), 16777619) >>> 0
  return `DRIP-${h.toString(36).toUpperCase().padStart(5, "0").slice(-5)}`
}

function PhotoInput({ label, hint, file, onChange }: { label: string; hint: string; file: string | null; onChange: (url: string | null) => void }) {
  const id = useId()
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-[15px] font-medium">
        {label} <span className="font-normal text-muted-foreground">(optional)</span>
      </label>
      <p id={`${id}-hint`} className="text-sm text-muted-foreground">{hint}</p>
      <input
        id={id}
        type="file"
        accept="image/*"
        aria-describedby={`${id}-hint`}
        onChange={(e) => {
          const f = e.target.files?.[0]
          onChange(f ? URL.createObjectURL(f) : null)
        }}
        className="block min-h-12 w-full rounded-sm border border-input bg-background text-[15px] file:mr-4 file:h-12 file:cursor-pointer file:border-0 file:border-r file:border-input file:bg-surface file:px-4 file:text-[15px] file:font-medium file:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      />
      {file && (
        // Local preview only: the photo never leaves this device.
        // eslint-disable-next-line @next/next/no-img-element
        <img src={file} alt={`Preview: ${label.toLowerCase()}`} className="mt-2 aspect-[4/5] w-32 border border-border object-cover" />
      )}
    </div>
  )
}

export function PassOnFlow({ productId, pricePaid, productName }: { productId: string; pricePaid: number; productName: string }) {
  const router = useRouter()
  const pathname = usePathname()
  const params = useSearchParams()
  const headingRef = useRef<HTMLHeadingElement>(null)
  const [front, setFront] = useState<string | null>(null)
  const [labelPhoto, setLabelPhoto] = useState<string | null>(null)
  const [routeError, setRouteError] = useState(false)

  const step = Math.min(4, Math.max(1, Number(params.get("step")) || 1))
  const issues = (params.get("issues") ?? "").split(",").filter((x) => ISSUE_IDS.includes(x))
  const routeParam = params.get("route")
  const route: Route | null = routeParam === "post" || routeParam === "store" ? routeParam : null

  const grade = gradeFromIssues(issues.length)
  const quote = buybackFor(pricePaid, grade)
  const code = makeCode(`${productId}|${issues.join(",")}|${route}`)
  // Came straight from "No photos? Bring it to any store": staff grade at the till, so no estimate yet.
  const noEstimate = route === "store" && !params.has("estimated")
  const best = buybackFor(pricePaid, "like-new")

  const hrefFor = (patch: { step?: number; issues?: string[]; route?: Route | null; estimated?: boolean }) => {
    const q = new URLSearchParams()
    q.set("step", String(patch.step ?? step))
    const iss = patch.issues ?? issues
    if (iss.length) q.set("issues", iss.join(","))
    // Marks that the customer saw an online estimate (step 2).
    if (patch.estimated ?? params.has("estimated")) q.set("estimated", "1")
    const r = patch.route === undefined ? route : patch.route
    if (r) q.set("route", r)
    return `${pathname}?${q.toString()}`
  }
  const go = (patch: Parameters<typeof hrefFor>[0], replace = false) =>
    replace ? router.replace(hrefFor(patch), { scroll: false }) : router.push(hrefFor(patch), { scroll: false })

  // Move focus to the step heading when the step changes (keyboard and screen reader users).
  const firstRender = useRef(true)
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false
      return
    }
    headingRef.current?.focus()
    headingRef.current?.scrollIntoView({ block: "nearest" })
  }, [step])

  // Free local photo previews when they change or the page closes.
  useEffect(() => () => { if (front) URL.revokeObjectURL(front) }, [front])
  useEffect(() => () => { if (labelPhoto) URL.revokeObjectURL(labelPhoto) }, [labelPhoto])

  const backHref = step > 1 ? hrefFor({ step: step - 1 }) : "/wardrobe"

  return (
    <div className="mt-10 max-w-2xl">
      {/* Step indicator */}
      <p className="text-[15px] font-semibold">
        Step {step} of {STEPS.length}
      </p>
      <ol className="mt-3 grid grid-cols-4 gap-1" aria-label="Progress">
        {STEPS.map((s, i) => (
          <li key={s} aria-current={i + 1 === step ? "step" : undefined} className="min-w-0">
            <span className={cn("block h-1", i + 1 <= step ? "bg-foreground" : "bg-border")} />
            <span className={cn("mt-2 block truncate text-sm", i + 1 === step ? "font-semibold text-foreground" : "text-muted-foreground")}>
              {s}
            </span>
          </li>
        ))}
      </ol>

      <h2 ref={headingRef} tabIndex={-1} className="mt-8 text-2xl outline-none focus-visible:outline-2 focus-visible:outline-ring">
        {STEPS[step - 1]}
      </h2>

      {/* ---------------- Step 1: photos + checklist ---------------- */}
      {step === 1 && (
        <form
          className="mt-4 flex flex-col gap-8"
          onSubmit={(e) => {
            e.preventDefault()
            const picked = new FormData(e.currentTarget).getAll("issue").map(String)
            go({ step: 2, issues: picked, estimated: true })
          }}
        >
          <p className="text-base text-muted-foreground">
            Photos help us estimate a price. They stay on this device and are not uploaded.
          </p>
          <div className="grid gap-6 sm:grid-cols-2">
            <PhotoInput label="Front photo" hint="Lay it flat in good light." file={front} onChange={setFront} />
            <PhotoInput label="Label photo" hint="The care label inside." file={labelPhoto} onChange={setLabelPhoto} />
          </div>

          <fieldset>
            <legend className="text-base font-semibold">Does it have any of these?</legend>
            <p className="mt-1 text-[15px] text-muted-foreground">Tick all that apply. Leave them blank if it looks new.</p>
            <div className="mt-3 flex flex-col gap-2">
              {CONDITION_ISSUES.map((issue) => (
                <label
                  key={issue.id}
                  className="flex min-h-12 cursor-pointer items-center gap-3 rounded-sm border border-input px-4 has-[:checked]:border-foreground has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ring"
                >
                  <input
                    type="checkbox"
                    name="issue"
                    value={issue.id}
                    defaultChecked={issues.includes(issue.id)}
                    className="size-5 shrink-0 accent-[#111418]"
                  />
                  <span className="text-[15px]">{issue.label}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <p className="text-[15px]">
            No photos?{" "}
            <Link href={hrefFor({ step: 3, route: "store", issues: [], estimated: false })} className="font-medium underline underline-offset-4">
              Bring it to any store and staff will grade it at the till.
            </Link>
          </p>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button type="submit">See my estimate</Button>
            <Button asChild variant="outline">
              <Link href="/wardrobe">Back to wardrobe</Link>
            </Button>
          </div>
        </form>
      )}

      {/* ---------------- Step 2: estimate ---------------- */}
      {step === 2 && (
        <div className="mt-4 flex flex-col gap-6">
          <div className="border border-border p-5">
            <p className="text-[15px] text-muted-foreground">Estimated grade</p>
            <p className="font-heading text-[28px] font-semibold leading-tight">{quote.label}</p>
            <p className="mt-1 text-[15px] text-muted-foreground">
              {issues.length === 0
                ? "You did not tick any wear."
                : `Based on ${issues.length} ${issues.length === 1 ? "sign" : "signs"} of wear: ${issues
                    .map((id) => CONDITION_ISSUES.find((c) => c.id === id)?.label.split(" (")[0].toLowerCase())
                    .join(", ")}.`}
            </p>
            {grade === "worn-out" ? (
              <p className="mt-4 text-base">
                No credit for this one, but we still take it free and recycle it.
              </p>
            ) : (
              <dl className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="border border-border p-4">
                  <dt className="text-[15px] text-muted-foreground">Drip credit</dt>
                  <dd className="text-2xl font-semibold">{formatPrice(quote.value)}</dd>
                </div>
                <div className="border border-border p-4">
                  <dt className="text-[15px] text-muted-foreground">If spent on Pre-loved (+{Math.round(PRELOVED_BONUS * 100)}%)</dt>
                  <dd className="text-2xl font-semibold">{formatPrice(quote.preloved)}</dd>
                </div>
              </dl>
            )}
          </div>
          <p className="text-base">
            This is an estimate. Staff confirm the grade when it arrives, and if it changes we tell you why.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button onClick={() => go({ step: 3 })}>Choose how to send it</Button>
            <Button asChild variant="outline">
              <Link href={backHref}>Back</Link>
            </Button>
          </div>
        </div>
      )}

      {/* ---------------- Step 3: route ---------------- */}
      {step === 3 && (
        <form
          className="mt-4 flex flex-col gap-6"
          onSubmit={(e) => {
            e.preventDefault()
            const picked = new FormData(e.currentTarget).get("route")
            if (picked !== "post" && picked !== "store") {
              setRouteError(true)
              return
            }
            setRouteError(false)
            go({ step: 4, route: picked })
          }}
        >
          <fieldset aria-describedby={routeError ? "route-error" : undefined}>
            <legend className="text-base font-semibold">How would you like to send it?</legend>
            <div className="mt-3 flex flex-col gap-3">
              {([
                ["post", "Free An Post label", "We email a label. Drop the parcel at any post office within 14 days."],
                ["store", "Drop off at a Drip store", "Bring it to the till. Staff grade it with you there and then."],
              ] as const).map(([value, title, body]) => (
                <label
                  key={value}
                  className="flex min-h-16 cursor-pointer items-start gap-3 rounded-sm border border-input px-4 py-3 has-[:checked]:border-2 has-[:checked]:border-foreground has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ring"
                >
                  <input
                    type="radio"
                    name="route"
                    value={value}
                    defaultChecked={route === value}
                    onChange={() => setRouteError(false)}
                    className="mt-1 size-5 shrink-0 accent-[#111418]"
                  />
                  <span>
                    <span className="block text-base font-semibold">{title}</span>
                    <span className="block text-[15px] text-muted-foreground">{body}</span>
                  </span>
                </label>
              ))}
            </div>
            {routeError && (
              <p id="route-error" role="alert" className="mt-2 text-sm font-medium text-sale">
                Choose how you will send it.
              </p>
            )}
          </fieldset>
          {route === "store" && issues.length === 0 && (
            <p className="text-[15px] text-muted-foreground">
              No checklist needed: staff will grade it at the till and pay the credit there.
            </p>
          )}
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button type="submit">Confirm</Button>
            <Button asChild variant="outline">
              <Link href={backHref}>Back</Link>
            </Button>
          </div>
        </form>
      )}

      {/* ---------------- Step 4: done ---------------- */}
      {step === 4 && (
        <div className="mt-4 flex flex-col gap-6">
          <div className="border border-border p-5">
            <p className="flex items-center gap-2 text-base font-semibold text-success">
              <Check aria-hidden className="size-5" strokeWidth={2} />
              Booked in: {productName}
            </p>
            <p className="mt-3 text-[15px] text-muted-foreground">Your reference</p>
            <p className="text-2xl font-semibold tracking-wide">{code}</p>
            <p className="mt-2 text-[15px] text-muted-foreground">Prototype only: this code is made up and nothing has been booked.</p>
          </div>
          <div>
            <h3 className="text-xl">What happens next</h3>
            <ol className="mt-3 list-decimal space-y-2 pl-5 text-base">
              <li>
                {route === "store"
                  ? `Bring it to any Drip store with your reference ${code}.`
                  : `Post it with the free An Post label we email you. Write ${code} on the parcel.`}
              </li>
              {noEstimate ? (
                <>
                  <li>Staff grade it with you at the till.</li>
                  <li>
                    We pay the credit there: up to {formatPrice(best.value)}, or up to {formatPrice(best.preloved)} if you spend it on
                    Pre-loved, depending on the grade.
                  </li>
                </>
              ) : (
                <>
                  <li>Staff check it and confirm the grade. If it changes from your estimate, we tell you why.</li>
                  <li>
                    {grade === "worn-out"
                      ? "We recycle it for free. There is no credit for worn-out items."
                      : `We pay the credit: ${formatPrice(quote.value)}, or ${formatPrice(quote.preloved)} if you spend it on Pre-loved.`}
                  </li>
                </>
              )}
            </ol>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild>
              <Link href="/wardrobe">Back to My Drip Wardrobe</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href={backHref}>Back</Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
