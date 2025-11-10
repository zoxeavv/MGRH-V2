
"use client"

import { useEffect } from "react"

import { Dialog, DialogContent } from "@/components/ui/dialog"

import { SidebarItems } from "./SidebarItems"

type SidebarProps = {
  mobileOpen: boolean
  onMobileOpenChange: (open: boolean) => void
}

export function Sidebar({ mobileOpen, onMobileOpenChange }: SidebarProps) {
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.setProperty("overflow", "hidden")
    } else {
      document.body.style.removeProperty("overflow")
    }
    return () => {
      document.body.style.removeProperty("overflow")
    }
  }, [mobileOpen])

  return (
    <>
      <aside
        className="hidden w-[280px] shrink-0 border-r border-border bg-card/60 lg:flex lg:flex-col"
        aria-label="Primary"
      >
        <SidebarItems />
      </aside>

      <Dialog open={mobileOpen} onOpenChange={onMobileOpenChange}>
        <DialogContent
          className="inset-y-0 left-0 flex w-[min(88vw,320px)] transform-none overflow-hidden border-0 bg-background p-0 text-foreground shadow-lg sm:rounded-none"
          overlayClassName="bg-background/80 backdrop-blur-sm"
          aria-label="Mobile navigation"
        >
          <SidebarItems onNavigate={() => onMobileOpenChange(false)} />
        </DialogContent>
      </Dialog>
    </>
  )
}

export default Sidebar