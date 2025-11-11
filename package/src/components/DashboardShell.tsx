"use client";

import { useState } from "react";
import { Header } from "@/app/(DashboardLayout)/layout/header/Header";
import { Sidebar } from "@/app/(DashboardLayout)/layout/sidebar/Sidebar";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen w-full">
      <Sidebar
        isSidebarOpen={true}
        isMobileSidebarOpen={isMobileSidebarOpen}
        onSidebarClose={() => setMobileSidebarOpen(false)}
      />
      <div className="flex flex-1 flex-col lg:pl-64">
        <Header onToggleMobileSidebar={() => setMobileSidebarOpen(true)} />
        <main className="flex-1 p-4 lg:p-6">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
