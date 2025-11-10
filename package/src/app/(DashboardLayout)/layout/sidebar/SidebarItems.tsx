"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"

import { Upgrade } from "./Updrade"
import { sidebarNav } from "./MenuItems"

type SidebarItemsProps = {
  onNavigate?: () => void
}

export function SidebarItems({ onNavigate }: SidebarItemsProps) {
  const pathname = usePathname()

  return (
    <div className="flex h-full flex-col">
      <Link
        href="/"
        className="flex items-center gap-3 px-6 pb-6 pt-8 text-lg font-semibold tracking-tight"
        onClick={onNavigate}
      >
        <Image
          src="/images/logos/dark-logo.svg"
          alt="Modernize logo"
          width={32}
          height={32}
          priority
          className="h-8 w-8"
        />
        <span className="text-slate-900 dark:text-slate-100">Modernize</span>
      </Link>

      <nav aria-label="Main navigation" className="flex-1 overflow-y-auto px-2">
        <ul className="space-y-2" role="list">
          {sidebarNav.map((item) => {
            if (item.type === "label") {
              return (
                <li
                  key={item.id}
                  className="px-4 pt-6 text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                >
                  {item.label}
                </li>
              )
            }

            const Icon = item.icon
            const isActive = pathname === item.href

            return (
              <li key={item.id}>
                <Link
                  href={item.href}
                  onClick={onNavigate}
                  className={cn(
                    "group flex items-center gap-3 rounded-xl px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                  aria-current={isActive ? "page" : undefined}
                >
                  <Icon
                    size={18}
                    stroke={1.75}
                    className="text-muted-foreground group-hover:text-foreground"
                    aria-hidden="true"
                  />
                  <span>{item.title}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      <div className="px-4 pb-8 pt-4">
        <Upgrade />
      </div>
    </div>
  )
}

export default SidebarItems
