import * as React from "react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { cn } from "@/lib/utils"

import { ProfileMenu } from "./Profile"

import {
  IconBellRinging,
  IconMenu2,
  IconSearch,
} from "@tabler/icons-react"

type HeaderProps = {
  onOpenMobileSidebar: () => void
  menuButtonRef?: (node: HTMLButtonElement | null) => void
}

export const Header = ({ onOpenMobileSidebar, menuButtonRef }: HeaderProps) => {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur">
      <div className="flex h-16 items-center gap-3 px-4 sm:px-6">
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-full text-muted-foreground hover:text-foreground lg:hidden"
            onClick={onOpenMobileSidebar}
            aria-label="Open main navigation"
            ref={menuButtonRef}
          >
            <IconMenu2 className="h-5 w-5" stroke={1.75} aria-hidden="true" />
          </Button>

          <form
            role="search"
            className="hidden items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-sm shadow-sm lg:flex"
          >
            <IconSearch className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
            <label htmlFor="global-search" className="sr-only">
              Search
            </label>
            <Input
              id="global-search"
              type="search"
              placeholder="Search..."
              className={cn(
                "h-auto w-[240px] border-0 bg-transparent px-0 text-sm focus-visible:ring-0 focus-visible:ring-offset-0",
                "placeholder:text-muted-foreground/80"
              )}
            />
          </form>
        </div>

        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="relative h-10 w-10 rounded-full text-muted-foreground hover:text-foreground"
            aria-label="View notifications"
          >
            <IconBellRinging className="h-5 w-5" stroke={1.75} aria-hidden="true" />
            <span className="absolute right-3 top-3 inline-flex h-2.5 w-2.5 rounded-full bg-brand" />
          </Button>
          <ThemeToggle />
          <Button
            asChild
            variant="secondary"
            size="sm"
            className="hidden rounded-full px-4 font-medium sm:inline-flex"
          >
            <Link href="/authentication/login">Login</Link>
          </Button>
          <ProfileMenu />
        </div>
      </div>
    </header>
  )
}

export default Header
