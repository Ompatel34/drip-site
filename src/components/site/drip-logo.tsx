import { cn } from "cn"

/** Drip brand blue, taken from the supplied logo. Used only for the logo. */
export const DRIP_BLUE = "#2038FF"

/**
 * The Drip logo: lowercase "drip" in a heavy condensed face (Anton) with a
 * water drop as the dot of the i. Built as text + vector so it stays sharp at
 * any size (the supplied PNG is only 100 px wide).
 * Height is set with `className` font size, e.g. "text-[34px]".
 */
export function DripLogo({ className, label = "Drip" }: { className?: string; label?: string }) {
  return (
    <span
      role="img"
      aria-label={label}
      className={cn("inline-flex items-baseline font-logo leading-[0.85] lowercase select-none", className)}
      style={{ color: DRIP_BLUE }}
    >
      <span aria-hidden>dr</span>
      <span aria-hidden className="relative inline-block">
        {/* dotless i, with the drop drawn above it */}
        ı
        <svg
          aria-hidden
          viewBox="0 0 24 32"
          className="absolute left-1/2 h-[0.36em] w-auto -translate-x-1/2"
          style={{ bottom: "1.12em" }}
          fill="currentColor"
        >
          <path d="M12 0C12 0 1.5 13.2 1.5 20.5a10.5 10.5 0 0 0 21 0C22.5 13.2 12 0 12 0Z" />
        </svg>
      </span>
      <span aria-hidden>p</span>
    </span>
  )
}

/** Favicon / app icon shape (the drop on its own). */
export const DROP_PATH = "M12 0C12 0 1.5 13.2 1.5 20.5a10.5 10.5 0 0 0 21 0C22.5 13.2 12 0 12 0Z"
