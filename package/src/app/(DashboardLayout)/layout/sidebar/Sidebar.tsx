"use client"

import * as React from "react"

import { Dialog, DialogContent } from "@/components/ui/dialog"

import SidebarItems from "./SidebarItems"

interface SidebarProps {
  mobileOpen: boolean
  onMobileOpenChange: React.Dispatch<React.SetStateAction<boolean>>
}

export function Sidebar({ mobileOpen, onMobileOpenChange }: SidebarProps) {
  React.useEffect(() => {
    const content = document.querySelector<HTMLElement>("[data-shell-content]")
    if (!content) {
      return
    }

    if (mobileOpen) {
      content.setAttribute("inert", "")
      content.setAttribute("aria-hidden", "true")
      document.body.style.setProperty("overflow", "hidden")
    } else {
      content.removeAttribute("inert")
      content.removeAttribute("aria-hidden")
      document.body.style.removeProperty("overflow")
    }

    return () => {
      content.removeAttribute("inert")
      content.removeAttribute("aria-hidden")
      document.body.style.removeProperty("overflow")
    }
  }, [mobileOpen])

  return (
    <>
      <aside className="relative hidden w-72 shrink-0 border-r border-border/60 bg-card/60 backdrop-blur lg:flex">
        <SidebarItems />
      </aside>

      <Dialog open={mobileOpen} onOpenChange={onMobileOpenChange}>
        <DialogContent
          className="left-0 top-0 m-0 h-dvh w-72 max-w-none translate-x-0 rounded-none border-r border-border bg-background p-0 text-left shadow-card sm:bottom-auto sm:right-auto sm:rounded-r-3xl"
          aria-label="Mobile navigation"
        >
          <SidebarItems onNavigate={() => onMobileOpenChange(false)} />
        </DialogContent>
      </Dialog>
    </>
  )
}

export default Sidebar
