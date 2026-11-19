import type { Metadata, Viewport } from "next"
import { Inter, Inter_Tight } from "next/font/google"

import { PromoStrip, PrototypeBanner } from "@/components/site/promo-strip"
import { SiteFooter } from "@/components/site/site-footer"
import { SiteHeader } from "@/components/site/site-header"
import { CookieNotice } from "@/components/site/cookie-notice"
import { MiniCart } from "@/components/site/mini-cart"
import { StoreProvider } from "@/components/site/store-provider"

import "./globals.css"

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
})

const interTight = Inter_Tight({
  variable: "--font-inter-tight",
  subsets: ["latin"],
  weight: ["600", "700"],
  display: "swap",
})

export const metadata: Metadata = {
  title: "Drip | Clothes made to last",
  description:
    "Women's, men's and unisex clothing, accessories and pre-loved pieces from Drip.",
}

export const viewport: Viewport = {
  themeColor: "#ffffff",
  colorScheme: "light",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en-IE" className={`${inter.variable} ${interTight.variable}`}>
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:bg-background focus:px-4 focus:py-3 focus:font-medium"
        >
          Skip to content
        </a>
        <StoreProvider>
          <PrototypeBanner />
          <PromoStrip />
          <SiteHeader />
          <main id="main">{children}</main>
          <SiteFooter />
          <MiniCart />
          <CookieNotice />
        </StoreProvider>
      </body>
    </html>
  )
}
