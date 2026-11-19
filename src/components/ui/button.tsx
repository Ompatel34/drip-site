import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"
import { Slot } from "radix-ui"

/*
 * Drip buttons: min 48px tall, 2px corners, no shadows.
 * Primary = ink fill / white bold text, hover #2A2E33.
 * Secondary (outline) = white with 1px ink border.
 */
const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 rounded-sm border border-transparent text-base whitespace-nowrap transition-colors select-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-5",
  {
    variants: {
      variant: {
        default:
          "bg-primary font-semibold text-primary-foreground hover:bg-primary-hover",
        outline:
          "border-foreground bg-background font-semibold text-foreground hover:bg-surface",
        ghost: "font-medium text-foreground hover:bg-surface",
        link: "h-auto px-0 font-medium text-foreground underline underline-offset-4 hover:decoration-2",
      },
      size: {
        default: "h-12 px-6",
        lg: "h-14 px-8",
        block: "h-12 w-full px-6",
        icon: "size-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
