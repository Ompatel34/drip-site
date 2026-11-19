import type { Metadata } from "next"
import Link from "next/link"

import { ContentPage, ContentSection } from "@/components/site/content-page"

export const metadata: Metadata = { title: "Privacy | Drip" }

export default function PrivacyPage() {
  return (
    <ContentPage
      title="Privacy"
      eyebrow="Placeholder"
      intro="A short privacy notice for this prototype store. Drip is fictional and this site collects no personal data."
    >
      <ContentSection id="stored" title="What is stored">
        <p>Your bag, favourites and cookie choice are saved in your own browser (localStorage) so they survive a page reload. They never leave your device.</p>
      </ContentSection>
      <ContentSection id="forms" title="Forms">
        <p>The newsletter, contact and checkout forms do not send anything anywhere. What you type is only used on the page and then discarded.</p>
      </ContentSection>
      <ContentSection id="third-parties" title="Third parties">
        <p>
          Product photos load from Unsplash&apos;s image servers, which can see your IP address like any website you visit. There is no analytics or advertising tracking. See{" "}
          <Link href="/cookies">Cookies</Link>.
        </p>
      </ContentSection>
    </ContentPage>
  )
}
