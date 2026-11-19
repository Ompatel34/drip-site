"use client"

import { useId, useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function TrackOrderForm() {
  const id = useId()
  const [checked, setChecked] = useState<string | null>(null)

  return (
    <form
      className="flex max-w-md flex-col gap-3"
      onSubmit={(e) => {
        e.preventDefault()
        const value = new FormData(e.currentTarget).get("order")
        setChecked(String(value ?? "").trim())
      }}
    >
      <label htmlFor={id} className="text-[15px] font-medium text-foreground">
        Order number
      </label>
      <Input id={id} name="order" required placeholder="e.g. DRP-123456" />
      <Button type="submit" className="self-start">
        Track order
      </Button>
      <p role="status" className="min-h-6 text-[15px]">
        {checked && (
          <span className="text-foreground">
            We couldn&apos;t find order {checked}. This is a prototype, so no real orders exist.
          </span>
        )}
      </p>
    </form>
  )
}
