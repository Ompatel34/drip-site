import Link from "next/link"
import { cn } from "cn"

export function SectionHeading({
  id,
  eyebrow,
  title,
  link,
  className,
}: {
  id?: string
  eyebrow?: string
  title: string
  link?: { label: string; href: string }
  className?: string
}) {
  return (
    <div
      className={cn(
        "mb-8 flex flex-wrap items-end justify-between gap-4 lg:mb-10",
        className
      )}
    >
      <div>
        {eyebrow && (
          <p className="label-caps mb-3 text-muted-foreground">{eyebrow}</p>
        )}
        <h2 id={id} className="text-[28px] lg:text-4xl">{title}</h2>
      </div>
      {link && (
        <Link
          href={link.href}
          className="inline-flex min-h-12 items-center text-base font-medium underline underline-offset-4 hover:decoration-2"
        >
          {link.label}
        </Link>
      )}
    </div>
  )
}
