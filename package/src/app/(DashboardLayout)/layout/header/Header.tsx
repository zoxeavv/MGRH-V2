"use client"

import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import { ProfileMenu } from "./Profile"

import {
  IconBellRinging,
  IconChevronDown,
  IconMenu2,
  IconSearch,
} from "@tabler/icons-react"

type HeaderProps = {
  onToggleSidebar: () => void
}

export function Header({ onToggleSidebar }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/90 backdrop-blur">
      <div className="flex h-16 items-center gap-3 px-4 sm:px-6">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={onToggleSidebar}
          aria-label="Open navigation menu"
        >
          <IconMenu2 size={20} aria-hidden="true" />
        </Button>

        <Link
          href="/"
          className="flex items-center gap-2 text-sm font-semibold tracking-tight text-foreground lg:hidden"
          aria-label="Back to dashboard home"
        >
          <span className="rounded-full bg-primary/10 px-2 py-1 text-primary">
            MOD
          </span>
          Modernize
        </Link>

        <form
          role="search"
          className="relative hidden w-full max-w-md items-center gap-2 lg:flex"
          aria-label="Global site search"
        >
          <IconSearch
            size={18}
            className="absolute left-3 text-muted-foreground"
            aria-hidden="true"
          />
          <label htmlFor="global-search" className="sr-only">
            Search clients, templates, and settings
          </label>
          <Input
            id="global-search"
            type="search"
            placeholder="Search clients, templates, and settings"
            className="pl-9"
          />
        </form>

        <div className="ml-auto flex items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="relative"
            aria-label="View notifications"
          >
            <IconBellRinging size={20} aria-hidden="true" />
            <span className="absolute right-1 top-1 inline-flex size-2 rounded-full bg-accent" />
          </Button>

          <Button
            type="button"
            variant="secondary"
            className="hidden items-center gap-2 rounded-full border border-border/60 bg-secondary px-4 text-sm font-semibold text-foreground shadow-none transition hover:bg-secondary/80 sm:inline-flex"
          >
            New action
            <IconChevronDown size={16} aria-hidden="true" />
          </Button>

          <ProfileMenu />
        </div>
      </div>
    </header>
  )
}

export default Header
