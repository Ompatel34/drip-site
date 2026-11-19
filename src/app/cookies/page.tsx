import type { Metadata } from "next"

import { ContentPage, ContentSection } from "@/components/site/content-page"

export const metadata: Metadata = { title: "Cookies | Drip" }

export default function CookiesPage() {
  return (
    <ContentPage
      title="Cookies"
      eyebrow="Placeholder"
      intro="This prototype uses no tracking or advertising cookies."
    >
      <ContentSection id="used" title="What we use">
        <ul>
          <li><strong>Bag:</strong> remembers the items in your bag.</li>
          <li><strong>Favourites:</strong> remembers the items you saved.</li>
          <li><strong>Cookie notice:</strong> remembers that you closed the notice.</li>
        </ul>
        <p>These are stored in your browser&apos;s localStorage, not sent to a server, and are essential for the bag and favourites to work.</p>
      </ContentSection>
      <ContentSection id="clear" title="Clearing them">
        <p>Clear this site&apos;s data in your browser settings to remove them. Your bag and favourites will be emptied.</p>
      </ContentSection>
    </ContentPage>
  )
}
