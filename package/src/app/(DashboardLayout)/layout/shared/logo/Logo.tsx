import Image from "next/image"
import Link from "next/link"

const Logo = () => {
  return (
    <Link
      href="/"
      aria-label="Modernize dashboard"
      className="flex h-16 w-40 items-center justify-center rounded-xl transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
    >
      <Image
        src="/images/logos/dark-logo.svg"
        alt="Modernize"
        height={64}
        width={164}
        priority
        className="h-12 w-auto"
      />
    </Link>
  )
}

export default Logo
  