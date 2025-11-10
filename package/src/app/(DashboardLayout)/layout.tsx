"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Dialog, DialogClose, DialogContent } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

import { Header } from "./layout/header/Header"
import { Sidebar } from "./layout/sidebar/Sidebar"

type LayoutProps = {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: LayoutProps) {
  const pathname = usePathname()
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [returnFocus, setReturnFocus] = useState<HTMLElement | null>(null)

  const handleOpenMobileNav = () => {
    setReturnFocus(document.activeElement as HTMLElement | null)
    setMobileNavOpen(true)
  }

  const handleCloseMobileNav = () => {
    setMobileNavOpen(false)
  }

  useEffect(() => {
    if (!mobileNavOpen && returnFocus) {
      returnFocus.focus()
      setReturnFocus(null)
    }
  }, [mobileNavOpen, returnFocus])

  useEffect(() => {
    if (mobileNavOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }

    return () => {
      document.body.style.overflow = ""
    }
  }, [mobileNavOpen])

  useEffect(() => {
    setMobileNavOpen(false)
  }, [pathname])

  return (
    <div className="relative flex min-h-dvh bg-muted/20 text-foreground">
      <div className="hidden w-[280px] shrink-0 lg:block">
        <Sidebar />
      </div>
      <div
        className={cn("flex min-h-dvh flex-1 flex-col lg:pl-0", mobileNavOpen && "pointer-events-none select-none opacity-60")}
        aria-hidden={mobileNavOpen ? true : undefined}
        data-inert={mobileNavOpen ? "true" : undefined}
      >
        <Header onOpenSidebar={handleOpenMobileNav} />
        <main
          id="content"
          role="main"
          className="flex-1 px-4 py-6 focus-visible:outline-none focus-visible:ring-0 sm:px-6 lg:px-8"
        >
          <div className="mx-auto w-full max-w-6xl space-y-6">{children}</div>
        </main>
      </div>

      <Dialog open={mobileNavOpen} onOpenChange={(open) => (open ? setMobileNavOpen(true) : handleCloseMobileNav())}>
        <DialogContent
          aria-label="Navigation"
          className="fixed inset-y-0 left-0 z-50 flex h-full w-[85vw] max-w-xs flex-col overflow-hidden border-0 bg-background p-0 shadow-xl transition data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:slide-in-from-left data-[state=closed]:slide-out-to-left"
        >
          <div className="flex items-center justify-between border-b border-border px-4 py-4">
            <span className="text-sm font-semibold text-muted-foreground">Navigation</span>
            <DialogClose asChild>
              <Button variant="ghost" size="sm" className="rounded-full" onClick={handleCloseMobileNav}>
                Close
              </Button>
            </DialogClose>
          </div>
          <Sidebar onNavigate={handleCloseMobileNav} showLogo />
        </DialogContent>
      </Dialog>
    </div>
  )
}
