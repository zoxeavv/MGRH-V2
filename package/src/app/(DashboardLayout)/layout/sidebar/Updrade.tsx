import Image from "next/image"
import Link from "next/link"

import { Button } from "@/components/ui/button"

export const Upgrade = () => {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-brand-soft p-5 shadow-card dark:bg-primary/15">
      <div className="relative z-10 space-y-3">
        <p className="text-sm font-semibold leading-snug text-slate-900 dark:text-primary-foreground">
          Haven&apos;t created your account yet?
        </p>
        <Button
          asChild
          size="sm"
          className="bg-brand text-brand-foreground hover:bg-brand/90"
        >
          <Link href="/authentication/register">Sign Up</Link>
        </Button>
      </div>
      <Image
        src="/images/backgrounds/rocket.png"
        alt=""
        width={120}
        height={120}
        priority
        className="pointer-events-none absolute -right-4 bottom-0 h-24 w-24 object-contain opacity-90"
      />
    </div>
  )
}
