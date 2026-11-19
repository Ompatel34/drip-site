import type { Metadata } from "next"
import Link from "next/link"

import { ContentPage } from "@/components/site/content-page"
import { ContactForm } from "./contact-form"

export const metadata: Metadata = { title: "Contact | Drip" }

export default function ContactPage() {
  return (
    <ContentPage
      title="Contact"
      intro="Questions about an order, a product or this site? Send us a message. This is a prototype, so messages are not actually sent."
      wide
    >
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-6">
        <div className="min-w-0 lg:col-span-7">
          <ContactForm />
        </div>
        <aside className="min-w-0 lg:col-span-4 lg:col-start-9">
          <div className="border border-border bg-surface p-6">
            <h2 className="text-xl">Before you write</h2>
            <ul className="mt-3 space-y-2 text-[15px]">
              <li><Link href="/faq" className="underline underline-offset-4">FAQ</Link></li>
              <li><Link href="/shipping" className="underline underline-offset-4">Shipping</Link></li>
              <li><Link href="/returns" className="underline underline-offset-4">Returns</Link></li>
              <li><Link href="/size-guide" className="underline underline-offset-4">Size guide</Link></li>
            </ul>
            <h2 className="mt-6 text-xl">Customer care hours</h2>
            <p className="mt-2 text-[15px] text-muted-foreground">
              Monday to Friday, 9:00 to 17:30. We aim to reply within 2 working days. (Placeholder)
            </p>
          </div>
        </aside>
      </div>
    </ContentPage>
  )
}
