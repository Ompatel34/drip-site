import Link from "next/link"

import { DripLogo } from "@/components/site/drip-logo"
import { footerGroups } from "@/lib/navigation"
import { PROTOTYPE_NOTICE } from "@/lib/store"

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="page-container py-16 lg:py-20">
        <div className="flex flex-wrap items-baseline justify-between gap-4 border-b border-border pb-8">
          <DripLogo className="text-[36px]" />
          <p className="inline-flex items-center gap-2 text-[15px] font-medium">
            <span aria-hidden className="inline-block size-2 bg-foreground" />
            Ireland (€)
          </p>
        </div>

        <nav aria-label="Footer" className="grid grid-cols-2 gap-x-6 gap-y-10 pt-10 lg:grid-cols-4">
          {footerGroups.map((group) => (
            <div key={group.title}>
              <h2 className="text-base">{group.title}</h2>
              <ul className="mt-3">
                {group.links.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="inline-flex min-h-11 items-center text-[15px] text-muted-foreground hover:text-foreground hover:underline hover:underline-offset-4"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>

      <div className="border-t border-border">
        <div className="page-container flex flex-col gap-2 py-6 text-sm text-muted-foreground sm:flex-row sm:justify-between">
          <p>© 2026 Drip. {PROTOTYPE_NOTICE}</p>
          <p className="flex flex-wrap gap-x-4">
            <span>Prices shown in euro and include VAT.</span>
            <Link href="/staff/grade-assist" className="underline underline-offset-4 hover:text-foreground">
              Staff demo: Grade Assist
            </Link>
          </p>
        </div>
      </div>
    </footer>
  )
}
