import type { Metadata } from "next"

import { ContentPage } from "@/components/site/content-page"
import { Confirmation } from "./confirmation"

export const metadata: Metadata = { title: "Order confirmed | Drip", robots: { index: false } }

export default function OrderConfirmedPage() {
  return (
    <ContentPage title="Order confirmed" wide>
      <Confirmation />
    </ContentPage>
  )
}
