"use client";

import * as React from "react";

import Header from "@/app/(DashboardLayout)/layout/header/Header";
import Sidebar from "@/app/(DashboardLayout)/layout/sidebar/Sidebar";

type DashboardLayoutProps = {
  children: React.ReactNode;
};

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isMobileSidebarOpen, setMobileSidebarOpen] = React.useState(false);

  const handleToggleSidebar = React.useCallback(() => {
    setMobileSidebarOpen((prev) => !prev);
  }, []);

  return (
    <div className="relative flex min-h-dvh w-full bg-muted/20">
      <Sidebar
        isMobileOpen={isMobileSidebarOpen}
        onMobileOpenChange={setMobileSidebarOpen}
      />

      <div className="flex min-h-dvh flex-1 flex-col">
        <Header onToggleSidebar={handleToggleSidebar} />
        <div className="relative flex flex-1 flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
