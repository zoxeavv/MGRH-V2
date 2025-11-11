"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";
import menuGroups, { type NavigationItem } from "./MenuItems";
import { IconPoint } from "@tabler/icons-react";
import Logo from "../shared/logo/Logo";

export function SidebarItems() {
  const pathname = usePathname();

  const renderMenuItem = (item: NavigationItem) => {
    const Icon = item.icon ?? IconPoint;
    const isActive = pathname === item.href;

    return (
      <Link
        key={item.id}
        href={item.href}
        className={cn(
          "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
          isActive
            ? "bg-primary text-primary-foreground"
            : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
        )}
      >
        <Icon size={20} stroke={1.5} />
        {item.title}
      </Link>
    );
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center border-b px-6">
        <Logo />
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto p-4">
        {menuGroups.map((group) => (
          <div key={group.id} className="space-y-1">
            <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {group.title}
            </div>
            {group.items.map(renderMenuItem)}
          </div>
        ))}
      </nav>
    </div>
  );
}
