import Link from "next/link"
import { usePathname } from "next/navigation"
import { useMemo } from "react"

import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { Logo } from "../shared/logo/Logo"
import { UpgradeBanner } from "./Updrade"
import { navSections } from "./MenuItems"

type SidebarProps = {
  onNavigate?: () => void
  showLogo?: boolean
}

export function Sidebar({ onNavigate, showLogo = false }: SidebarProps) {
  const pathname = usePathname()

  const items = useMemo(() => navSections, [])

  return (
    <aside className="flex h-full w-full flex-col overflow-y-auto border-r border-border bg-card/60 px-4 py-6 text-sm backdrop-blur-lg">
      <div className={cn("mb-6", showLogo ? "block" : "hidden lg:block")}>
        <Logo />
      </div>
      <nav aria-label="Primary" className="flex flex-1 flex-col gap-6">
        {items.map((section) => (
          <div key={section.id}>
            <p className="mb-2 px-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground/80">
              {section.label}
            </p>
            <ul className="space-y-1">
              {section.items.map((item) => {
                const isActive = pathname === item.href
                const Icon = item.icon

                return (
                  <li key={item.id}>
                    <Link
                      href={item.href}
                      onClick={onNavigate}
                      className="group flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      data-active={isActive}
                      aria-current={isActive ? "page" : undefined}
                    >
                      <span
                        className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted/70 text-muted-foreground transition group-data-[active=true]:bg-brand/10 group-data-[active=true]:text-brand"
                        aria-hidden
                      >
                        <Icon className="h-4 w-4" />
                      </span>
                      <span className="flex-1">{item.title}</span>
                      {isActive ? <Badge variant="info">Active</Badge> : null}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </nav>
      <UpgradeBanner />
    </aside>
  )
}