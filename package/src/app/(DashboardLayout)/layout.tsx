"use client"

import * as React from "react"

import Header from "@/app/(DashboardLayout)/layout/header/Header"
import Sidebar from "@/app/(DashboardLayout)/layout/sidebar/Sidebar"

type DashboardLayoutProps = {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = React.useState(false)

  return (
    <div className="relative flex min-h-dvh w-full bg-background lg:bg-background/95">
      <Sidebar
        mobileOpen={mobileSidebarOpen}
        onMobileOpenChange={setMobileSidebarOpen}
      />

      <div
        data-shell-content
        className="flex flex-1 flex-col bg-background/70 backdrop-blur-sm transition-[filter]"
      >
        <Header onToggleSidebar={() => setMobileSidebarOpen(true)} />
        <main
          id="shell-content"
          tabIndex={-1}
          className="flex-1 overflow-y-auto pb-10 focus:outline-none"
        >
          <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
