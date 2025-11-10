import Link from "next/link"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { IconBellRinging, IconMenu2, IconMoonStars, IconSearch, IconSun, IconUser } from "@tabler/icons-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

type HeaderProps = {
  onOpenSidebar: () => void
}

export function Header({ onOpenSidebar }: HeaderProps) {
  const { setTheme, theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const isDark = theme === "dark"

  return (
    <header className="sticky inset-x-0 top-0 z-40 border-b border-border bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center justify-between gap-3 px-4 py-4 lg:px-6">
        <div className="flex flex-1 items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 lg:hidden"
            aria-label="Open navigation"
            onClick={onOpenSidebar}
          >
            <IconMenu2 className="h-4 w-4" aria-hidden />
          </Button>
          <div className="relative flex-1 max-w-md">
            <IconSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
            <Input
              type="search"
              placeholder="Search clients, offers, templates..."
              aria-label="Search"
              className="h-10 w-full rounded-xl bg-muted/40 pl-10 pr-4 text-sm"
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="relative h-10 w-10 rounded-lg text-muted-foreground hover:text-foreground"
                  aria-label="View notifications"
                >
                  <IconBellRinging className="h-5 w-5" aria-hidden />
                  <span className="absolute right-2 top-2 inline-flex h-2 w-2 animate-ping rounded-full bg-primary" />
                  <span className="absolute right-2 top-2 inline-flex h-2 w-2 rounded-full bg-primary" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom" align="center">
                <p>Notifications</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <Button
            variant="ghost"
            size="sm"
            className="h-10 w-10 rounded-lg text-muted-foreground hover:text-foreground"
            aria-label="Toggle theme"
            onClick={() => setTheme(isDark ? "light" : "dark")}
          >
            {mounted ? (
              isDark ? <IconSun className="h-5 w-5" aria-hidden /> : <IconMoonStars className="h-5 w-5" aria-hidden />
            ) : (
              <IconSun className="h-5 w-5" aria-hidden />
            )}
          </Button>
          <Button asChild variant="secondary" size="sm" className="hidden md:inline-flex">
            <Link href="/authentication/login">Login</Link>
          </Button>
          <ProfileMenu />
        </div>
      </div>
    </header>
  )
}

function ProfileMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="flex h-10 items-center gap-3 rounded-full px-2 text-sm text-foreground hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          aria-label="Open profile menu"
        >
          <Avatar className="h-9 w-9">
            <AvatarImage src="/images/profile/user-1.jpg" alt="Jane Cooper" />
            <AvatarFallback>
              <IconUser className="h-4 w-4" aria-hidden />
            </AvatarFallback>
          </Avatar>
          <span className="hidden flex-col text-left leading-tight md:flex">
            <span className="text-sm font-semibold">Jane Cooper</span>
            <span className="text-xs text-muted-foreground">Design Lead</span>
          </span>
          <Badge variant="info" className="hidden md:inline-flex">
            Pro
          </Badge>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="min-w-[220px]" align="end">
        <DropdownMenuLabel className="space-y-1">
          <p className="text-sm font-medium">Jane Cooper</p>
          <p className="text-xs text-muted-foreground">jane.cooper@example.com</p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/profile">Profile</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/notifications">Notifications</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/settings">Settings</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/authentication/login" className="text-destructive">
            Logout
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
