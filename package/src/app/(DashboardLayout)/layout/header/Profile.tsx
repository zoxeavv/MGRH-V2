"use client"

import Link from "next/link"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import {
  IconListCheck,
  IconLogout,
  IconMail,
  IconUser,
} from "@tabler/icons-react"

export function ProfileMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative h-10 w-10 rounded-full border border-border/60"
          aria-label="Open profile menu"
        >
          <Avatar className="h-10 w-10">
            <AvatarImage
              src="/images/profile/user-1.jpg"
              alt="Taylor Swift portrait"
            />
            <AvatarFallback className="bg-primary/10 text-sm font-semibold text-primary">
              TS
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-60 rounded-2xl border border-border/60 shadow-card"
      >
        <DropdownMenuLabel className="flex flex-col gap-1">
          <span className="text-sm font-semibold text-foreground">
            Taylor Swift
          </span>
          <span className="text-xs text-muted-foreground">
            taylor@modernize.io
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link
            href="/profile"
            className="flex w-full items-center gap-2 text-sm"
          >
            <IconUser size={16} aria-hidden="true" /> View profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link
            href="/inbox"
            className="flex w-full items-center gap-2 text-sm"
          >
            <IconMail size={16} aria-hidden="true" /> Inbox
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link
            href="/tasks"
            className="flex w-full items-center gap-2 text-sm"
          >
            <IconListCheck size={16} aria-hidden="true" /> Tasks
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link
            href="/authentication/login"
            className="flex w-full items-center gap-2 text-sm font-medium text-destructive"
          >
            <IconLogout size={16} aria-hidden="true" /> Log out
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default ProfileMenu
