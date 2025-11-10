"use client"

import * as React from "react"

import { Header } from "@/app/(DashboardLayout)/layout/header/Header"
import { Sidebar } from "@/app/(DashboardLayout)/layout/sidebar/Sidebar"

type DashboardLayoutProps = {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = React.useState(false)
  const menuButtonRef = React.useRef<HTMLButtonElement | null>(null)
  const setMenuButtonRef = React.useCallback((node: HTMLButtonElement | null) => {
    menuButtonRef.current = node
  }, [])
  const contentRef = React.useRef<HTMLDivElement>(null)

  const handleMobileOpenChange = React.useCallback(
    (open: boolean) => {
      setMobileSidebarOpen(open)
      if (!open) {
        requestAnimationFrame(() => {
          menuButtonRef.current?.focus()
        })
      }
    },
    []
  )

  React.useEffect(() => {
    const contentEl = contentRef.current
    if (!contentEl) return

    contentEl.toggleAttribute("inert", mobileSidebarOpen)
    contentEl.setAttribute("aria-hidden", mobileSidebarOpen ? "true" : "false")
  }, [mobileSidebarOpen])

  return (
    <div className="flex min-h-dvh w-full bg-muted/30 text-foreground">
      <Sidebar mobileOpen={mobileSidebarOpen} onMobileOpenChange={handleMobileOpenChange} />
      <div className="flex min-h-dvh flex-1 flex-col lg:pl-0">
        <Header
          onOpenMobileSidebar={() => handleMobileOpenChange(true)}
          menuButtonRef={setMenuButtonRef}
        />
        <div
          ref={contentRef}
          className="flex flex-1 flex-col"
        >
          <main id="content" role="main" className="flex-1">
            <div className="mx-auto w-full max-w-7xl px-4 pb-12 pt-6 sm:px-6 lg:px-8">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
