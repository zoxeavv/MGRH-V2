"use client";

import { useState } from "react";
import { SidebarItems } from "./SidebarItems";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

interface SidebarProps {
  isSidebarOpen: boolean;
  isMobileSidebarOpen: boolean;
  onSidebarClose: () => void;
}

export function Sidebar({
  isSidebarOpen,
  isMobileSidebarOpen,
  onSidebarClose,
}: SidebarProps) {
  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`
          fixed left-0 top-0 z-40 h-screen w-64 border-r bg-background transition-transform
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
        `}
      >
        <SidebarItems />
      </aside>

      {/* Mobile Sidebar */}
      <Sheet open={isMobileSidebarOpen} onOpenChange={onSidebarClose}>
        <SheetContent side="left" className="w-64 p-0">
          <SidebarItems />
        </SheetContent>
      </Sheet>
    </>
  );
}

export function SidebarToggle({
  onToggle,
}: {
  onToggle: () => void;
}) {
  return (
    <Button
      variant="ghost"
      size="icon"
      className="lg:hidden"
      onClick={onToggle}
    >
      <Menu className="h-5 w-5" />
      <span className="sr-only">Toggle sidebar</span>
    </Button>
  );
}
