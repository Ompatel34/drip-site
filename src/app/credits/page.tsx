import type { Metadata } from "next"
import Link from "next/link"

import { ContentPage } from "@/components/site/content-page"
import { Photo } from "@/components/site/photo"
import { allImages } from "@/lib/images"
import { getProduct } from "@/lib/products"

export const metadata: Metadata = { title: "Photo credits | Drip" }

const groupOf = (key: string) =>
  key.startsWith("product:") ? "Products" : key.startsWith("category:") ? "Homepage" : "Our story"

const labelOf = (key: string) => {
  const [kind, id] = key.split(":")
  if (kind === "product") return getProduct(id)?.name ?? id
  if (kind === "category") return `${id[0].toUpperCase()}${id.slice(1)} category tile`
  return id === "fabric" ? "How Drip makes clothes" : "About Drip"
}

const hrefOf = (key: string) => {
  const [kind, id] = key.split(":")
  if (kind === "product") return `/product/${id}`
  if (kind === "category") return `/shop?dept=${id}`
  return id === "fabric" ? "/materials" : "/about"
}

export default function CreditsPage() {
  const images = allImages()
  const groups = ["Products", "Homepage", "Our story"]
    .map((name) => ({ name, items: images.filter((c) => groupOf(c.key) === name) }))
    .filter((g) => g.items.length > 0)

  return (
    <ContentPage
      title="Photo credits"
      intro={
        <>
          Photos are from{" "}
          <a href="https://unsplash.com/?utm_source=drip_prototype&utm_medium=referral" className="text-foreground underline underline-offset-4" rel="noopener">
            Unsplash
          </a>{" "}
          and used under the Unsplash licence. Thank you to every photographer below. The garments in the photos are not Drip products.
        </>
      }
      wide
    >
      {groups.length === 0 ? (
        <p className="text-muted-foreground">No photos have been added yet. Products show a coloured placeholder for now.</p>
      ) : (
        groups.map((g) => (
          <section key={g.name} aria-labelledby={`g-${g.name}`} className="mt-10 first:mt-0">
            <h2 id={`g-${g.name}`} className="border-b border-border pb-3 text-xl">
              {g.name} <span className="text-base font-normal text-muted-foreground">({g.items.length})</span>
            </h2>
            <ul className="grid grid-cols-1 divide-y divide-border md:grid-cols-2 md:gap-x-8 md:divide-y-0">
              {g.items.map((c) => (
                <li key={c.key} className="flex min-w-0 items-center gap-4 border-border py-4 md:border-b">
                  <Photo imageKey={c.key} alt="" sizes="56px" className="aspect-[4/5] w-14 shrink-0" />
                  <div className="min-w-0 text-[15px]">
                    <Link href={hrefOf(c.key)} className="font-medium hover:underline hover:underline-offset-4">
                      {labelOf(c.key)}
                    </Link>
                    <p className="text-sm text-muted-foreground">
                      Photo by{" "}
                      <a href={c.photographerUrl} className="underline underline-offset-4" rel="noopener">
                        {c.photographer}
                      </a>{" "}
                      on{" "}
                      <a href={c.photoUrl} className="underline underline-offset-4" rel="noopener">
                        Unsplash
                      </a>
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        ))
      )}
    </ContentPage>
  )
}
