import type { Metadata } from "next"
import Link from "next/link"

import { ContentPage, ContentSection } from "@/components/site/content-page"

export const metadata: Metadata = { title: "Accessibility | Drip" }

export default function AccessibilityPage() {
  return (
    <ContentPage
      title="Accessibility"
      intro="We aim for this site to meet WCAG 2.2 level AA so it is easy to use for everyone."
    >
      <ContentSection id="what" title="What we have done">
        <ul>
          <li>Text and controls meet AA colour contrast. Body text is 16px and nothing is smaller than 14px, except short labels like &quot;NEW&quot;.</li>
          <li>Every menu, button and form works with a keyboard, and focus is always visible.</li>
          <li>Menus open on click, tap or Enter, never on hover only.</li>
          <li>Buttons and tap targets are at least 48px tall.</li>
          <li>Moving parts, such as the clothing rail, can be paused and respect your reduced-motion setting.</li>
        </ul>
      </ContentSection>
      <ContentSection id="feedback" title="Feedback">
        <p>
          Found something hard to use? Tell us on the <Link href="/contact">contact page</Link>.
        </p>
      </ContentSection>
    </ContentPage>
  )
}
