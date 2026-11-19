import type { Metadata } from "next"

import { ContentPage } from "@/components/site/content-page"
import { CartView } from "./cart-view"

export const metadata: Metadata = { title: "Your bag | Drip", robots: { index: false } }

export default function CartPage() {
  return (
    <ContentPage title="Your bag" wide>
      <CartView />
    </ContentPage>
  )
}
