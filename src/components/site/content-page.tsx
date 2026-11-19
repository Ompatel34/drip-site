import Link from "next/link"

/** Shared shell for text pages: breadcrumb, H1, intro and readable column. */
export function ContentPage({
  title,
  intro,
  eyebrow,
  wide,
  children,
}: {
  title: string
  intro?: React.ReactNode
  eyebrow?: string
  /** Full-width children without text styling (grids, forms). */
  wide?: boolean
  children?: React.ReactNode
}) {
  return (
    <div className="page-container pt-10 pb-20 lg:pt-14 lg:pb-28">
      <nav aria-label="Breadcrumb" className="mb-6 text-sm text-muted-foreground">
        <ol className="flex gap-2">
          <li>
            <Link href="/" className="hover:text-foreground hover:underline">
              Home
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li aria-current="page" className="text-foreground">
            {title}
          </li>
        </ol>
      </nav>
      {eyebrow && <p className="label-caps mb-3 text-muted-foreground">{eyebrow}</p>}
      <h1 className="text-[32px] leading-tight lg:text-[40px]">{title}</h1>
      {intro && <div className="measure mt-4 text-base text-muted-foreground lg:text-lg">{intro}</div>}
      {children && (
        <div className={wide ? "mt-10" : "prose-drip mt-10 max-w-3xl"}>{children}</div>
      )}
    </div>
  )
}

/** A titled block inside a content page. */
export function ContentSection({
  id,
  title,
  children,
}: {
  id?: string
  title: string
  children: React.ReactNode
}) {
  return (
    <section id={id} aria-labelledby={id ? `${id}-h` : undefined} className="scroll-mt-32 border-t border-border py-8 first:border-t-0 first:pt-0">
      <h2 id={id ? `${id}-h` : undefined} className="text-2xl">
        {title}
      </h2>
      <div className="mt-3 space-y-3">{children}</div>
    </section>
  )
}

