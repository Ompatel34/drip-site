"use client"

import { useId, useState } from "react"
import { Check } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function NewsletterForm() {
  const id = useId()
  const [done, setDone] = useState(false)

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        e.currentTarget.reset()
        setDone(true)
      }}
      className="flex flex-col gap-3"
    >
      <label htmlFor={id} className="text-sm font-medium">
        Email address
      </label>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Input
          id={id}
          type="email"
          name="email"
          autoComplete="email"
          required
          placeholder="you@example.com"
          onChange={() => done && setDone(false)}
        />
        <Button type="submit" className="sm:w-auto">
          Sign up
        </Button>
      </div>
      <p role="status" className="min-h-6 text-sm">
        {done && (
          <span className="inline-flex items-center gap-2 font-medium text-success">
            <Check aria-hidden className="size-4" />
            Thanks, you are on the list.
          </span>
        )}
      </p>
    </form>
  )
}
