import Image from "next/image"
import Link from "next/link"

import { Button } from "@/components/ui/button"

type UpgradeProps = {
  onNavigate?: () => void
}

export const Upgrade = ({ onNavigate }: UpgradeProps) => {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-brand-soft/80 p-5 shadow-card ring-1 ring-brand/10">
      <div className="flex items-center gap-4">
        <div className="space-y-2">
          <p className="text-sm font-semibold text-brand">Need an account?</p>
          <p className="text-xs text-muted-foreground">
            Create your workspace to invite teammates and share dashboards.
          </p>
          <Button
            asChild
            size="sm"
            className="bg-brand text-brand-foreground hover:bg-brand/90"
            onClick={onNavigate}
          >
            <Link href="/authentication/register">Sign up</Link>
          </Button>
        </div>
        <div className="relative h-20 w-20 shrink-0">
          <Image
            src="/images/backgrounds/rocket.png"
            alt="Launch illustration"
            fill
            sizes="80px"
            className="object-contain"
            priority
          />
        </div>
      </div>
    </div>
  )
}
