import type { Metadata } from "next"

import { ContentPage } from "@/components/site/content-page"
import { CheckoutForm } from "./checkout-form"

export const metadata: Metadata = { title: "Checkout | Drip", robots: { index: false } }

export default function CheckoutPage() {
  return (
    <ContentPage
      title="Checkout"
      intro="Fields are required unless marked optional. Nothing you enter is sent anywhere."
      wide
    >
      <CheckoutForm />
    </ContentPage>
  )
}
