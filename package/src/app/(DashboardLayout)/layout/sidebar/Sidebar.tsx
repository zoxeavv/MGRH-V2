import * as React from "react";

import { Sheet, SheetContent } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

import SidebarItems from "./SidebarItems";

type SidebarProps = {
  isMobileOpen: boolean;
  onMobileOpenChange: (open: boolean) => void;
};

const Sidebar = ({ isMobileOpen, onMobileOpenChange }: SidebarProps) => {
  React.useEffect(() => {
    const main = document.getElementById("content");
    if (!main) {
      return;
    }

    if (isMobileOpen) {
      main.setAttribute("inert", "");
      main.setAttribute("aria-hidden", "true");
      document.body.style.setProperty("overflow", "hidden");
    } else {
      main.removeAttribute("inert");
      main.removeAttribute("aria-hidden");
      document.body.style.removeProperty("overflow");
    }

    return () => {
      main.removeAttribute("inert");
      main.removeAttribute("aria-hidden");
      document.body.style.removeProperty("overflow");
    };
  }, [isMobileOpen]);

  return (
    <>
      <aside
        className={cn(
          "hidden lg:sticky lg:top-0 lg:flex lg:h-dvh lg:w-[18rem] lg:flex-none lg:flex-col lg:border-r lg:border-border/80 lg:bg-card"
        )}
      >
        <SidebarItems />
      </aside>

      <Sheet open={isMobileOpen} onOpenChange={onMobileOpenChange}>
        <SheetContent
          side="left"
          aria-label="Primary navigation"
          className="flex h-dvh w-[calc(100vw-3rem)] max-w-xs flex-col overflow-hidden bg-card p-0 shadow-2xl sm:max-w-sm"
        >
          <SidebarItems onNavigate={() => onMobileOpenChange(false)} />
        </SheetContent>
      </Sheet>
    </>
  );
};

export default Sidebar;
