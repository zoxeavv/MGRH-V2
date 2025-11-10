import Image from "next/image"
import Link from "next/link"

import { Button } from "@/components/ui/button"

export function UpgradeBanner() {
  return (
    <div className="relative mt-6 overflow-hidden rounded-2xl bg-brand/5 p-4 text-sm shadow-card">
      <div className="flex flex-col gap-3">
        <p className="max-w-[12rem] text-sm font-medium text-foreground">New here? Create an account in seconds.</p>
        <Button asChild size="sm">
          <Link href="/authentication/register">Sign up</Link>
        </Button>
      </div>
      <Image
        src="/images/backgrounds/rocket.png"
        alt=""
        width={120}
        height={120}
        className="pointer-events-none absolute -right-1 -top-6 h-24 w-24 object-contain drop-shadow"
      />
    </div>
  )
}
