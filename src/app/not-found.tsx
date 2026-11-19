import Link from "next/link"

import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="page-container section-y">
      <p className="label-caps mb-3 text-muted-foreground">Error 404</p>
      <h1 className="text-[32px] lg:text-[44px]">We can&apos;t find that page</h1>
      <p className="measure mt-4 text-base text-muted-foreground lg:text-lg">
        The link may be broken, or the page may have moved. Try searching, or head back to the shop.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Button asChild>
          <Link href="/shop">Go to the shop</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/">Back to homepage</Link>
        </Button>
      </div>
    </div>
  )
}
