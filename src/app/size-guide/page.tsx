import type { Metadata } from "next"

import { ContentPage, ContentSection } from "@/components/site/content-page"

export const metadata: Metadata = { title: "Size guide | Drip" }

const women = [
  ["XS", "6", "80", "62", "88"],
  ["S", "8", "84", "66", "92"],
  ["M", "10-12", "90", "72", "98"],
  ["L", "14", "96", "78", "104"],
  ["XL", "16", "102", "84", "110"],
  ["XXL", "18", "108", "90", "116"],
]

const men = [
  ["XS", "86", "70", "34"],
  ["S", "92", "76", "36"],
  ["M", "98", "82", "38"],
  ["L", "104", "88", "40"],
  ["XL", "110", "94", "42"],
  ["XXL", "116", "100", "44"],
]

function SizeTable({ caption, head, rows }: { caption: string; head: string[]; rows: string[][] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-left text-[15px]">
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr className="border-b border-foreground">
            {head.map((h) => (
              <th key={h} scope="col" className="py-3 pr-4 font-semibold">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r[0]} className="border-b border-border">
              {r.map((c, i) =>
                i === 0 ? (
                  <th key={i} scope="row" className="py-3 pr-4 font-semibold">{c}</th>
                ) : (
                  <td key={i} className="py-3 pr-4 text-muted-foreground">{c}</td>
                )
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default function SizeGuidePage() {
  return (
    <ContentPage
      title="Size guide"
      intro="Body measurements in centimetres. If you are between sizes, choose the larger size for a relaxed fit. Each product page also has fit notes."
    >
      <ContentSection id="women" title="Women">
        <SizeTable
          caption="Women's sizes"
          head={["Size", "IE/UK", "Bust", "Waist", "Hips"]}
          rows={women}
        />
      </ContentSection>
      <ContentSection id="men" title="Men">
        <SizeTable caption="Men's sizes" head={["Size", "Chest", "Waist", "Collar"]} rows={men} />
      </ContentSection>
      <ContentSection id="unisex" title="Unisex">
        <p>Unisex pieces follow the men&apos;s chart. Women may want to size down one.</p>
      </ContentSection>
      <ContentSection id="accessories" title="Accessories">
        <p>Tote bags, beanies and scarves are one size. Socks come in one size that fits IE/UK shoe sizes 4-11.</p>
      </ContentSection>
      <ContentSection id="measure" title="How to measure">
        <ul>
          <li><strong>Bust or chest:</strong> around the fullest part, keeping the tape level.</li>
          <li><strong>Waist:</strong> around your natural waistline, the narrowest part.</li>
          <li><strong>Hips:</strong> around the fullest part, about 20 cm below the waist.</li>
        </ul>
      </ContentSection>
    </ContentPage>
  )
}
