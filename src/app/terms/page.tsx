import type { Metadata } from "next"

import { ContentPage, ContentSection } from "@/components/site/content-page"

export const metadata: Metadata = { title: "Terms | Drip" }

export default function TermsPage() {
  return (
    <ContentPage
      title="Terms"
      eyebrow="Placeholder"
      intro="Terms of use for this prototype store."
    >
      <ContentSection id="prototype" title="This is a prototype">
        <p>Drip is a fictional brand. All products, prices, reviews and sustainability details are made up for design and research purposes.</p>
      </ContentSection>
      <ContentSection id="orders" title="No sales">
        <p>Nothing on this site can be bought. Placing an order never creates a contract, takes a payment or ships goods.</p>
      </ContentSection>
      <ContentSection id="photos" title="Photos">
        <p>Photos are used under the Unsplash licence and credited to their photographers on the Photo credits page.</p>
      </ContentSection>
    </ContentPage>
  )
}
