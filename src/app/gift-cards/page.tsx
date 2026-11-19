import type { Metadata } from "next"
import Link from "next/link"

import { ContentPage, ContentSection } from "@/components/site/content-page"

export const metadata: Metadata = { title: "Gift cards | Drip" }

export default function GiftCardsPage() {
  return (
    <ContentPage
      title="Gift cards"
      eyebrow="Placeholder"
      intro="Gift cards are a placeholder in this prototype. They cannot be bought or redeemed."
    >
      <ContentSection id="idea" title="How they would work">
        <ul>
          <li>Digital gift cards from €15 to €120, sent by email.</li>
          <li>Valid for five years on all full-price and sale items.</li>
          <li>Redeemable at checkout alongside a delivery address.</li>
        </ul>
        <p>
          In the meantime, you can <Link href="/shop">browse the shop</Link> or save items to your{" "}
          <Link href="/wishlist">favourites</Link>.
        </p>
      </ContentSection>
    </ContentPage>
  )
}
