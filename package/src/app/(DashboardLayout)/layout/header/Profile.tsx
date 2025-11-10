"use client";

import Link from "next/link";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import {
  IconChevronDown,
  IconListCheck,
  IconMail,
  IconUser,
} from "@tabler/icons-react";

type ProfileMenuProps = {
  className?: string;
};

const ProfileMenu = ({ className }: ProfileMenuProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className={cn(
            "group flex items-center gap-3 rounded-full px-2 py-1 text-sm font-medium hover:bg-muted/80 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            className
          )}
          aria-label="Open profile menu"
        >
          <Avatar className="h-9 w-9 ring-2 ring-transparent transition group-hover:ring-brand">
            <AvatarImage src="/images/profile/user-1.jpg" alt="Amelia Taylor" />
            <AvatarFallback>AT</AvatarFallback>
          </Avatar>
          <div className="hidden text-left sm:block">
            <p className="text-sm font-semibold text-foreground">
              Amelia Taylor
            </p>
            <p className="text-xs text-muted-foreground">Product Designer</p>
          </div>
          <IconChevronDown className="hidden h-4 w-4 sm:block" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="w-56 rounded-xl shadow-card"
      >
        <DropdownMenuLabel className="text-xs uppercase text-muted-foreground">
          Account
        </DropdownMenuLabel>
        <DropdownMenuItem asChild>
          <Link href="/profile" className="flex items-center gap-2">
            <IconUser className="h-4 w-4 text-muted-foreground" />
            Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/inbox" className="flex items-center gap-2">
            <IconMail className="h-4 w-4 text-muted-foreground" />
            Messages
            <DropdownMenuShortcut>⇧⌘M</DropdownMenuShortcut>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/tasks" className="flex items-center gap-2">
            <IconListCheck className="h-4 w-4 text-muted-foreground" />
            Tasks
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/authentication/login" className="flex items-center gap-2">
            Sign out
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProfileMenu;
