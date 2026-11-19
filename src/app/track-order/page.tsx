import type { Metadata } from "next"

import { ContentPage } from "@/components/site/content-page"
import { TrackOrderForm } from "./track-order-form"

export const metadata: Metadata = { title: "Track order | Drip" }

export default function TrackOrderPage() {
  return (
    <ContentPage
      title="Track order"
      eyebrow="Placeholder"
      intro="Order tracking is a placeholder in this prototype. No real orders exist, so there is nothing to track."
    >
      <TrackOrderForm />
    </ContentPage>
  )
}
