import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import Logo from "../shared/logo/Logo";
import { Upgrade } from "./Updrade";
import { menuConfig } from "./MenuItems";

type SidebarItemsProps = {
  onNavigate?: () => void;
};

const SidebarItems = ({ onNavigate }: SidebarItemsProps) => {
  const pathname = usePathname();

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col">
      <div className="flex items-center justify-between px-4 py-6 pr-12">
        <Logo />
      </div>
      <nav
        aria-label="Primary"
        className="flex flex-1 flex-col gap-8 overflow-y-auto px-3 pb-6"
      >
        {menuConfig.map((section) => (
          <div key={section.id} className="space-y-3">
            <p className="px-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground/80">
              {section.label}
            </p>
            <ul className="space-y-1.5">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <li key={item.id}>
                    <Link
                      href={item.href}
                      onClick={onNavigate}
                      className={cn(
                        "group flex items-center justify-between gap-3 rounded-xl px-3 py-2 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                        isActive
                          ? "bg-brand-soft text-brand shadow-card"
                          : "text-muted-foreground hover:bg-muted/70 hover:text-foreground"
                      )}
                      aria-current={isActive ? "page" : undefined}
                    >
                      <span className="flex items-center gap-3">
                        <Icon
                          stroke={1.5}
                          className={cn(
                            "h-4 w-4 transition group-hover:scale-105",
                            isActive ? "text-brand" : "text-muted-foreground"
                          )}
                        />
                        {item.title}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
      <div className="px-4 pb-6">
        <Upgrade />
      </div>
    </div>
  );
};

export default SidebarItems;
