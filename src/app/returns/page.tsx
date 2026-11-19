import type { Metadata } from "next"
import Link from "next/link"

import { ContentPage, ContentSection } from "@/components/site/content-page"
import { RETURNS_DAYS } from "@/lib/store"

export const metadata: Metadata = { title: "Returns | Drip" }

export default function ReturnsPage() {
  return (
    <ContentPage
      title="Returns"
      intro={`Returns are free within ${RETURNS_DAYS} days of delivery. This is a prototype store, so there is nothing to return.`}
    >
      <ContentSection id="how" title="How to return">
        <ul>
          <li>Pack the items unworn, unwashed and with their labels on.</li>
          <li>Print the free returns label from your order email.</li>
          <li>Drop the parcel at any post office in Ireland.</li>
        </ul>
      </ContentSection>
      <ContentSection id="refunds" title="Refunds">
        <p>In a real store, refunds would be issued within 14 days of us receiving your return, including the standard delivery charge if you return the whole order. This prototype takes no payments, so there is nothing to refund.</p>
      </ContentSection>
      <ContentSection id="pre-loved" title="Pre-loved items">
        <p>
          Pre-loved pieces can be returned in the same way. Want to give us clothes you no longer wear? See{" "}
          <Link href="/pre-loved">Pre-loved take-back</Link>.
        </p>
      </ContentSection>
    </ContentPage>
  )
}
