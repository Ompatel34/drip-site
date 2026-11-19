import type { Metadata } from "next"

import { ContentPage } from "@/components/site/content-page"
import { WishlistGrid } from "./wishlist-grid"

export const metadata: Metadata = { title: "Favourites | Drip" }

export default function WishlistPage() {
  return (
    <ContentPage
      title="Favourites"
      intro="Items you have saved. They stay here on this device until you remove them."
      wide
    >
      <WishlistGrid />
    </ContentPage>
  )
}
