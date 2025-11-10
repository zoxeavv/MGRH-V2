import Image from "next/image"
import Link from "next/link"

export function Logo() {
  return (
    <Link
      href="/"
      className="flex h-12 items-center gap-2 rounded-lg px-2 text-lg font-semibold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      aria-label="Modernize home"
    >
      <Image src="/images/logos/dark-logo.svg" alt="" width={144} height={48} priority />
      <span className="sr-only">Modernize</span>
    </Link>
  )
}
  