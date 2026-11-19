"use client"

import { useEffect, useRef, useState } from "react"
import { CheckCircle2 } from "lucide-react"
import { cn } from "cn"

import { Button } from "@/components/ui/button"

type Values = { name: string; email: string; topic: string; order: string; message: string }
type Field = keyof Values

const TOPICS = ["An order", "Delivery", "Returns", "Sizing", "Materials or Pre-loved", "Accessibility", "Something else"]
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

function validate(v: Values) {
  const e: Partial<Record<Field, string>> = {}
  if (!v.name.trim()) e.name = "Enter your name."
  if (!v.email.trim()) e.email = "Enter your email address."
  else if (!EMAIL.test(v.email.trim())) e.email = "Enter an email address like name@example.ie."
  if (!v.topic) e.topic = "Choose a topic."
  if (v.message.trim().length < 10) e.message = "Write a message of at least 10 characters."
  return e
}

const inputClass = (invalid: boolean) =>
  cn(
    "w-full rounded-sm border bg-background px-4 text-base text-foreground placeholder:text-muted-foreground",
    "focus-visible:border-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
    invalid ? "border-sale" : "border-input"
  )

export function ContactForm() {
  const empty: Values = { name: "", email: "", topic: "", order: "", message: "" }
  const [v, setV] = useState<Values>(empty)
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({})
  const [submitted, setSubmitted] = useState(false)
  const [sent, setSent] = useState(false)
  const [attempt, setAttempt] = useState(0)
  const firstErrorRef = useRef<HTMLElement | null>(null)
  const sentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (attempt) firstErrorRef.current?.focus()
  }, [attempt])
  useEffect(() => {
    if (sent) sentRef.current?.focus()
  }, [sent])

  const set = (k: Field, val: string) => {
    const next = { ...v, [k]: val }
    setV(next)
    if (submitted) setErrors(validate(next))
  }

  const describe = (k: Field) => (errors[k] ? `ct-${k}-error` : undefined)
  const err = (k: Field) =>
    errors[k] ? (
      <p id={`ct-${k}-error`} className="text-sm font-medium text-sale">
        {errors[k]}
      </p>
    ) : null

  if (sent) {
    return (
      <div ref={sentRef} tabIndex={-1} role="status" className="border border-success/40 bg-background p-6">
        <p className="flex items-center gap-2 text-lg font-semibold text-success">
          <CheckCircle2 aria-hidden className="size-6" strokeWidth={1.75} />
          Message sent
        </p>
        <p className="measure mt-2 text-base">
          Thanks, {v.name.trim().split(" ")[0]}. In a real store we would reply to {v.email.trim()} within 2 working days.
        </p>
        <p className="measure mt-2 text-[15px] text-muted-foreground">
          This is a prototype, so nothing was actually sent and your message has not been stored.
        </p>
        <Button
          variant="outline"
          className="mt-6"
          onClick={() => {
            setV(empty)
            setErrors({})
            setSubmitted(false)
            setSent(false)
          }}
        >
          Send another message
        </Button>
      </div>
    )
  }

  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault()
        setSubmitted(true)
        const errs = validate(v)
        setErrors(errs)
        const first = (Object.keys(errs) as Field[])[0]
        if (first) {
          firstErrorRef.current = document.getElementById(`ct-${first}`)
          setAttempt((n) => n + 1)
          return
        }
        setSent(true)
      }}
      className="grid max-w-2xl gap-5"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="ct-name" className="text-[15px] font-medium">Name</label>
          <input id="ct-name" autoComplete="name" value={v.name} onChange={(e) => set("name", e.target.value)} aria-invalid={errors.name ? true : undefined} aria-describedby={describe("name")} className={cn(inputClass(!!errors.name), "h-12")} />
          {err("name")}
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="ct-email" className="text-[15px] font-medium">Email address</label>
          <input id="ct-email" type="email" inputMode="email" autoComplete="email" value={v.email} onChange={(e) => set("email", e.target.value)} aria-invalid={errors.email ? true : undefined} aria-describedby={describe("email")} className={cn(inputClass(!!errors.email), "h-12")} />
          {err("email")}
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="ct-topic" className="text-[15px] font-medium">Topic</label>
          <select id="ct-topic" value={v.topic} onChange={(e) => set("topic", e.target.value)} aria-invalid={errors.topic ? true : undefined} aria-describedby={describe("topic")} className={cn(inputClass(!!errors.topic), "h-12")}>
            <option value="">Choose a topic</option>
            {TOPICS.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
          {err("topic")}
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="ct-order" className="text-[15px] font-medium">Order number (optional)</label>
          <input id="ct-order" placeholder="e.g. DRP-123456" value={v.order} onChange={(e) => set("order", e.target.value)} className={cn(inputClass(false), "h-12")} />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="ct-message" className="text-[15px] font-medium">Message</label>
        <textarea id="ct-message" rows={6} value={v.message} onChange={(e) => set("message", e.target.value)} aria-invalid={errors.message ? true : undefined} aria-describedby={describe("message")} className={cn(inputClass(!!errors.message), "py-3 leading-relaxed")} />
        {err("message")}
      </div>

      <Button type="submit" className="justify-self-start">
        Send message
      </Button>
    </form>
  )
}
