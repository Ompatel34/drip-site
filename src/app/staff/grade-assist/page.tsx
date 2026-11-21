import type { Metadata } from "next"

import { GradeAssist } from "./grade-assist"

export const metadata: Metadata = { title: "Staff demo: Grade Assist | Drip", robots: { index: false } }

export default function GradeAssistPage() {
  return (
    <div className="page-container pt-10 pb-20 lg:pt-14 lg:pb-28">
      <div className="mx-auto max-w-5xl">
        <p role="note" className="mb-6 border border-foreground bg-surface px-4 py-3 text-[15px]">
          <span className="font-semibold">Staff demo.</span> This shows the in-store Grade Assist tool. It is a prototype: the
          item, photos and suggestion are sample data and nothing is saved.
        </p>
        <p className="label-caps mb-3 text-muted-foreground">Grade Assist · Returns desk</p>
        <h1 className="text-[32px] leading-tight lg:text-[40px]">Grade a returned item</h1>
        <GradeAssist />
      </div>
    </div>
  )
}
