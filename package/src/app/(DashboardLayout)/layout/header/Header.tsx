"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  IconBellRinging,
  IconMenu2,
  IconSearch,
} from "@tabler/icons-react";

import ProfileMenu from "./Profile";

type HeaderProps = {
  onToggleSidebar: () => void;
  className?: string;
};

const Header = ({ onToggleSidebar, className }: HeaderProps) => {
  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b border-border/80 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60",
        className
      )}
    >
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center gap-3 px-4">
        <Button
          variant="ghost"
          size="icon"
          className="shrink-0 lg:hidden"
          onClick={onToggleSidebar}
          aria-label="Open navigation"
        >
          <IconMenu2 className="h-5 w-5" />
        </Button>

        <form
          role="search"
          className="relative hidden flex-1 items-center sm:flex"
        >
          <label htmlFor="global-search" className="sr-only">
            Search
          </label>
          <IconSearch className="pointer-events-none absolute left-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="global-search"
            name="query"
            placeholder="Search clients, projects, or tasks…"
            className="w-full max-w-md rounded-full pl-9"
            autoComplete="off"
          />
        </form>

        <div className="ml-auto flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="relative"
            aria-label="View notifications"
          >
            <IconBellRinging className="h-5 w-5" />
            <span className="absolute right-2 top-2 inline-flex h-2 w-2 rounded-full bg-accent shadow ring-2 ring-background" />
          </Button>
          <Button
            variant="secondary"
            size="sm"
            asChild
            className="hidden sm:inline-flex"
          >
            <Link href="/authentication/login">Log in</Link>
          </Button>
          <ProfileMenu />
        </div>
      </div>
    </header>
  );
};

export default Header;
