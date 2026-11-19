import type { Metadata } from "next"
import Link from "next/link"

import { ContentPage, ContentSection } from "@/components/site/content-page"
import { formatPrice } from "@/lib/products"
import { DELIVERY_OPTIONS, FREE_DELIVERY_THRESHOLD } from "@/lib/store"

export const metadata: Metadata = { title: "Shipping | Drip" }

export default function ShippingPage() {
  const { standard, express } = DELIVERY_OPTIONS
  return (
    <ContentPage
      title="Shipping"
      intro="Delivery options and costs for orders in Ireland. This is a prototype store, so nothing is actually shipped."
    >
      <ContentSection id="options" title="Delivery options">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-[15px]">
            <thead>
              <tr className="border-b border-foreground">
                <th scope="col" className="py-3 pr-4 font-semibold">Option</th>
                <th scope="col" className="py-3 pr-4 font-semibold">Arrives in</th>
                <th scope="col" className="py-3 pr-4 font-semibold">Cost</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border">
                <th scope="row" className="py-3 pr-4 font-semibold">{standard.label}</th>
                <td className="py-3 pr-4 text-muted-foreground">{standard.days}</td>
                <td className="py-3 pr-4 text-muted-foreground">
                  {formatPrice(standard.cost)}, free over {formatPrice(FREE_DELIVERY_THRESHOLD)}
                </td>
              </tr>
              <tr className="border-b border-border">
                <th scope="row" className="py-3 pr-4 font-semibold">{express.label}</th>
                <td className="py-3 pr-4 text-muted-foreground">{express.days}</td>
                <td className="py-3 pr-4 text-muted-foreground">{formatPrice(express.cost)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </ContentSection>
      <ContentSection id="where" title="Where we deliver">
        <p>We deliver to addresses in Ireland only. Please include your Eircode so the courier can find you first time.</p>
      </ContentSection>
      <ContentSection id="tracking" title="Tracking">
        <p>
          You would get a tracking link by email once an order leaves the warehouse. See{" "}
          <Link href="/track-order">Track order</Link>.
        </p>
      </ContentSection>
    </ContentPage>
  )
}
