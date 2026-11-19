"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

import { Button } from "@/components/ui/button"

const KEY = "drip-cookie-notice-v1"

/** Non-blocking notice. The site only uses essential browser storage. */
export function CookieNotice() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    let dismissed = false
    try {
      dismissed = window.localStorage.getItem(KEY) === "dismissed"
    } catch {}
    // eslint-disable-next-line react-hooks/set-state-in-effect -- read once after mount
    if (!dismissed) setShow(true)
  }, [])

  if (!show) return null

  const dismiss = () => {
    try {
      window.localStorage.setItem(KEY, "dismissed")
    } catch {}
    setShow(false)
  }

  return (
    <div
      role="region"
      aria-label="Cookie notice"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-foreground bg-background"
    >
      <div className="page-container flex flex-col gap-4 py-4 md:flex-row md:items-center md:justify-between">
        <p className="measure text-[15px]">
          We only store your bag, favourites and this choice in your browser. No tracking or advertising cookies.{" "}
          <Link href="/cookies" className="underline underline-offset-4">
            Cookie policy
          </Link>
        </p>
        <Button onClick={dismiss} className="shrink-0">
          OK, got it
        </Button>
      </div>
    </div>
  )
}
