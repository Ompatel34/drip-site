import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"
import { Slot } from "radix-ui"

/*
 * Small uppercase labels: 12px, 0.08em tracking, square corners.
 * "material" is the only badge allowed to use the moss accent.
 */
const badgeVariants = cva(
  "label-caps inline-flex h-6 w-fit shrink-0 items-center rounded-none border px-2 whitespace-nowrap",
  {
    variants: {
      variant: {
        default: "border-foreground bg-background text-foreground",
        solid: "border-foreground bg-foreground text-background",
        sale: "border-sale bg-sale text-white",
        material: "border-moss bg-background text-moss",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "span"

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
