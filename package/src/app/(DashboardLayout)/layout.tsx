import React from "react";
import DashboardShell from "@/components/layout/DashboardShell";
import menuGroups from "@/app/(DashboardLayout)/layout/sidebar/MenuItems";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardShell navGroups={menuGroups}>{children}</DashboardShell>;
}
