import type { Metadata } from "next"
import Link from "next/link"

import { ContentPage } from "@/components/site/content-page"
import { repairs, takeBack } from "@/lib/impact"
import { formatPrice } from "@/lib/products"
import { DELIVERY_OPTIONS, FREE_DELIVERY_THRESHOLD, RETURNS_DAYS } from "@/lib/store"

export const metadata: Metadata = { title: "FAQ | Drip" }

type QA = { q: string; a: React.ReactNode }

const { standard, express } = DELIVERY_OPTIONS

const sections: { id: string; title: string; items: QA[] }[] = [
  {
    id: "prototype",
    title: "About this prototype",
    items: [
      {
        q: "Can I really buy something here?",
        a: "No. Drip is a fictional brand and this is a prototype store. You can add items to your bag and go through checkout, but there is no payment step and no real order is created.",
      },
      {
        q: "Are the reviews and sustainability figures real?",
        a: "No. Reviews are labelled as sample reviews and all impact figures are labelled as sample data. They show how a real store could present this information.",
      },
      {
        q: "What happens to the details I type at checkout?",
        a: (
          <>
            Nothing is sent anywhere. Your order summary is kept in this browser tab only so the confirmation page can show it. See{" "}
            <Link href="/privacy">Privacy</Link>.
          </>
        ),
      },
    ],
  },
  {
    id: "delivery",
    title: "Delivery",
    items: [
      {
        q: "How much does delivery cost?",
        a: `${standard.label} costs ${formatPrice(standard.cost)} and is free on orders over ${formatPrice(FREE_DELIVERY_THRESHOLD)}. ${express.label} costs ${formatPrice(express.cost)}.`,
      },
      {
        q: "How long will my order take?",
        a: `${standard.label} takes ${standard.days}. ${express.label} takes ${express.days}. You choose at checkout.`,
      },
      {
        q: "Where do you deliver?",
        a: "To addresses in Ireland only. Please include your Eircode.",
      },
    ],
  },
  {
    id: "returns",
    title: "Returns",
    items: [
      {
        q: "How do I return something?",
        a: (
          <>
            Returns are free within {RETURNS_DAYS} days. Pack the item unworn with its labels and drop it at any post office using the free label. Full details are on the{" "}
            <Link href="/returns">Returns</Link> page.
          </>
        ),
      },
      {
        q: "Can I exchange for a different size?",
        a: "Return the item for a refund and place a new order for the size you need. That way you get the new size as quickly as possible.",
      },
    ],
  },
  {
    id: "sizing",
    title: "Sizing",
    items: [
      {
        q: "How do I find my size?",
        a: (
          <>
            Each product page has a fit note, such as &quot;Model is 178 cm and wears M&quot;. Our{" "}
            <Link href="/size-guide">size guide</Link> lists body measurements for XS to XXL.
          </>
        ),
      },
      {
        q: "Why is a size crossed out?",
        a: "That size is sold out. You can still choose another size or colour.",
      },
    ],
  },
  {
    id: "materials",
    title: "Materials, repairs and Pre-loved",
    items: [
      {
        q: "How do I know what something is made of?",
        a: (
          <>
            Every product page shows the fibre composition, where the fibre comes from, the % recycled content, the factory country and estimated water and CO2e per item. Read more on{" "}
            <Link href="/materials">Our materials</Link>.
          </>
        ),
      },
      {
        q: "Do you repair clothes?",
        a: `Yes. Seams, zips and buttons are repaired free for ${repairs.freeRepairMonths} months after purchase.`,
      },
      {
        q: "What is Pre-loved?",
        a: (
          <>
            Send back any Drip piece and get a €{takeBack.voucherEuro} voucher. We resell wearable pieces and recycle the rest. See{" "}
            <Link href="/pre-loved">Pre-loved</Link>.
          </>
        ),
      },
    ],
  },
]

export default function FaqPage() {
  return (
    <ContentPage
      title="FAQ"
      intro={
        <>
          Answers to common questions. Can&apos;t find what you need?{" "}
          <Link href="/contact" className="text-foreground underline underline-offset-4">
            Contact us
          </Link>
          .
        </>
      }
      wide
    >
      <nav aria-label="FAQ topics" className="mb-10">
        <ul className="flex flex-wrap gap-2">
          {sections.map((s) => (
            <li key={s.id}>
              <a href={`#${s.id}`} className="inline-flex min-h-11 items-center rounded-sm border border-border px-4 text-[15px] hover:border-foreground">
                {s.title}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="max-w-3xl">
        {sections.map((s) => (
          <section key={s.id} id={s.id} aria-labelledby={`${s.id}-h`} className="mb-12 scroll-mt-32">
            <h2 id={`${s.id}-h`} className="text-2xl">
              {s.title}
            </h2>
            <div className="mt-4 border-t border-border">
              {s.items.map((item) => (
                <details key={item.q} className="group border-b border-border">
                  <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-3 text-base font-semibold [&::-webkit-details-marker]:hidden">
                    {item.q}
                    <span aria-hidden className="text-xl font-normal transition-transform group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <div className="prose-drip pb-5 text-base">
                    <p>{item.a}</p>
                  </div>
                </details>
              ))}
            </div>
          </section>
        ))}
      </div>
    </ContentPage>
  )
}
