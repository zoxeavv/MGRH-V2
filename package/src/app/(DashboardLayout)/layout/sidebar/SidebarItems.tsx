/* eslint-disable @next/next/no-img-element */
"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"

import { Upgrade } from "./Updrade"
import { menuItems } from "./MenuItems"

type SidebarItemsProps = {
  onNavigate?: () => void
}

export function SidebarItems({ onNavigate }: SidebarItemsProps) {
  const pathname = usePathname()

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-16 shrink-0 items-center gap-2 px-6">
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-semibold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          onClick={onNavigate}
        >
          <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-brand-soft text-brand">
            <Image
              src="/images/logos/dark-logo.svg"
              alt="Modernize logo"
              width={32}
              height={32}
              className="h-6 w-6"
              priority
            />
          </div>
          <span className="hidden text-base font-semibold sm:inline">Modernize</span>
        </Link>
      </div>

      <nav aria-label="Primary" className="flex-1 overflow-y-auto px-4 py-2">
        <ol className="space-y-3 text-sm">
          {menuItems.map((item) => {
            if (item.type === "section") {
              return (
                <li
                  key={`section-${item.label}`}
                  className="px-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground"
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
                  className={cn(
                    "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background hover:text-foreground",
                    isActive &&
                      "bg-brand-soft/60 text-brand shadow-sm ring-1 ring-inset ring-brand/40"
                  )}
                  aria-current={isActive ? "page" : undefined}
                  onClick={onNavigate}
                >
                  <Icon
                    size={18}
                    stroke={1.5}
                    className={cn(
                      "text-muted-foreground transition-colors group-hover:text-foreground",
                      isActive && "text-brand"
                    )}
                    aria-hidden="true"
                  />
                  <span>{item.title}</span>
                </Link>
              </li>
            )
          })}
        </ol>
      </nav>

      <div className="px-4 pb-6">
        <Upgrade onNavigate={onNavigate} />
      </div>
    </div>
  )
}

export default SidebarItems
