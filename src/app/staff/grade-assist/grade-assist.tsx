"use client"

import { useId, useState } from "react"
import { Check } from "lucide-react"

import { Button } from "@/components/ui/button"
import { buybackFor, GRADE_LABELS, type Grade } from "@/lib/buyback"
import { formatPrice, getProduct } from "@/lib/products"

/* SAMPLE DATA: one returned item as the staff member would see it. */
const SAMPLE = {
  reference: "DRIP-7Q2MX",
  productId: "merino-crew-jumper",
  colour: "Navy",
  size: "M",
  pricePaid: 28,
  purchased: "14 August 2026",
  customerGrade: "very-good" as Grade,
  suggested: "very-good" as Grade,
  reasons: ["Light pilling on cuffs", "No stains, holes or tears found", "Colour even on front and back"],
  photos: [
    { label: "Front (customer photo)", hex: "#1F2A3C" },
    { label: "Care label (customer photo)", hex: "#E9E3D6" },
  ],
}

const STAFF_CHECKS = [
  "No holes, tears or broken seams",
  "No stains or marks",
  "Pilling is light or none",
  "Care label present and readable",
]

const CHANGE_REASONS = [
  "More wear than the photos showed",
  "Less wear than the photos showed",
  "Stain or damage found",
  "Care label missing",
]

const GRADES: Grade[] = ["like-new", "very-good", "good", "worn-out"]

export function GradeAssist() {
  const product = getProduct(SAMPLE.productId)
  const formId = useId()
  const [checks, setChecks] = useState<boolean[]>(STAFF_CHECKS.map(() => false))
  const [mode, setMode] = useState<"review" | "change" | "done">("review")
  const [grade, setGrade] = useState<Grade>(SAMPLE.suggested)
  const [reason, setReason] = useState("")
  const [error, setError] = useState(false)

  const credit = buybackFor(SAMPLE.pricePaid, grade)
  const changed = grade !== SAMPLE.suggested

  return (
    <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2">
      {/* Item and customer photos */}
      <section aria-labelledby="item-h" className="min-w-0">
        <h2 id="item-h" className="text-xl">{product?.name ?? "Returned item"}</h2>
        <dl className="mt-2 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-[15px]">
          <dt className="text-muted-foreground">Reference</dt>
          <dd className="font-semibold">{SAMPLE.reference}</dd>
          <dt className="text-muted-foreground">Colour, size</dt>
          <dd>{SAMPLE.colour}, {SAMPLE.size}</dd>
          <dt className="text-muted-foreground">Bought</dt>
          <dd>{SAMPLE.purchased} for {formatPrice(SAMPLE.pricePaid)}</dd>
          <dt className="text-muted-foreground">Customer said</dt>
          <dd>{GRADE_LABELS[SAMPLE.customerGrade]}</dd>
        </dl>
        <ul className="mt-5 grid grid-cols-2 gap-3">
          {SAMPLE.photos.map((p) => (
            <li key={p.label}>
              <div role="img" aria-label={`${p.label}, sample colour block`} className="aspect-[4/5] w-full border border-border" style={{ backgroundColor: p.hex }} />
              <p className="mt-1.5 text-sm text-muted-foreground">{p.label}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* Suggestion, checks and decision */}
      <section aria-labelledby="grade-h" className="min-w-0">
        <div className="border border-border p-5">
          <h2 id="grade-h" className="text-[15px] font-normal text-muted-foreground">Suggested grade</h2>
          <p className="font-heading text-[28px] font-semibold leading-tight">{GRADE_LABELS[SAMPLE.suggested]}</p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-[15px]">
            {SAMPLE.reasons.map((r) => <li key={r}>{r}</li>)}
          </ul>
        </div>

        <fieldset className="mt-6">
          <legend className="text-base font-semibold">Staff check</legend>
          <div className="mt-3 flex flex-col gap-2">
            {STAFF_CHECKS.map((c, i) => (
              <label key={c} className="flex min-h-12 cursor-pointer items-center gap-3 rounded-sm border border-input px-4 has-[:checked]:border-foreground has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ring">
                <input
                  type="checkbox"
                  checked={checks[i]}
                  disabled={mode === "done"}
                  onChange={(e) => setChecks((prev) => prev.map((v, j) => (j === i ? e.target.checked : v)))}
                  className="size-5 shrink-0 accent-[#111418]"
                />
                <span className="text-[15px]">{c}</span>
              </label>
            ))}
          </div>
        </fieldset>

        {mode === "change" && (
          <form
            id={formId}
            className="mt-6 flex flex-col gap-5 border border-border p-5"
            onSubmit={(e) => {
              e.preventDefault()
              if (!reason) { setError(true); return }
              setError(false)
              setMode("done")
            }}
          >
            <fieldset>
              <legend className="text-base font-semibold">New grade</legend>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {GRADES.map((g) => (
                  <label key={g} className="flex min-h-12 cursor-pointer items-center gap-3 rounded-sm border border-input px-3 has-[:checked]:border-2 has-[:checked]:border-foreground has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ring">
                    <input type="radio" name="grade" value={g} checked={grade === g} onChange={() => setGrade(g)} className="size-5 shrink-0 accent-[#111418]" />
                    <span className="text-[15px]">{GRADE_LABELS[g]}</span>
                  </label>
                ))}
              </div>
            </fieldset>
            <div className="flex flex-col gap-1.5">
              <label htmlFor={`${formId}-reason`} className="text-base font-semibold">Reason for the change</label>
              <select
                id={`${formId}-reason`}
                value={reason}
                onChange={(e) => { setReason(e.target.value); setError(false) }}
                aria-invalid={error || undefined}
                aria-describedby={error ? `${formId}-err` : undefined}
                className={`h-12 w-full rounded-sm border bg-background px-3 text-base focus-visible:border-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring ${error ? "border-sale" : "border-input"}`}
              >
                <option value="">Choose a reason</option>
                {CHANGE_REASONS.map((r) => <option key={r}>{r}</option>)}
              </select>
              {error && <p id={`${formId}-err`} role="alert" className="text-sm font-medium text-sale">Pick a reason. The customer is told why the grade changed.</p>}
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button type="submit">Save new grade</Button>
              <Button type="button" variant="outline" onClick={() => { setGrade(SAMPLE.suggested); setReason(""); setError(false); setMode("review") }}>
                Cancel
              </Button>
            </div>
          </form>
        )}

        {/* Credit for the grade selected */}
        <div className="mt-6 border border-border bg-surface p-5" aria-live="polite">
          <p className="text-[15px] text-muted-foreground">Credit to pay for {GRADE_LABELS[grade]}</p>
          {grade === "worn-out" ? (
            <p className="mt-1 text-base">No credit. Take it free for recycling.</p>
          ) : (
            <p className="mt-1">
              <span className="text-2xl font-semibold">{formatPrice(credit.value)}</span>
              <span className="ml-2 text-[15px] text-muted-foreground">or {formatPrice(credit.preloved)} on Pre-loved</span>
            </p>
          )}
        </div>

        {mode === "review" && (
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Button onClick={() => setMode("done")}>Confirm grade</Button>
            <Button variant="outline" onClick={() => setMode("change")}>Change grade</Button>
          </div>
        )}

        {mode === "done" && (
          <div role="status" className="mt-6 border border-border p-5">
            <p className="flex items-center gap-2 text-base font-semibold text-success">
              <Check aria-hidden className="size-5" strokeWidth={2} />
              Grade saved: {GRADE_LABELS[grade]}
            </p>
            <p className="mt-1 text-[15px] text-muted-foreground">
              {changed ? `Changed from ${GRADE_LABELS[SAMPLE.suggested]}. Reason sent to the customer: ${reason}.` : "Matches the suggestion."}{" "}
              {checks.filter(Boolean).length} of {STAFF_CHECKS.length} checks ticked. Demo only: nothing was saved.
            </p>
            <Button variant="outline" className="mt-4" onClick={() => { setMode("review"); setGrade(SAMPLE.suggested); setReason(""); setChecks(STAFF_CHECKS.map(() => false)) }}>
              Start again
            </Button>
          </div>
        )}
      </section>
    </div>
  )
}
