import { DashboardShell } from "@/components/DashboardShell";
import { getSessionUser, getOrganizationContext } from "@/lib/auth/session";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getSessionUser();
  const organization = await getOrganizationContext();

  if (!user) {
    redirect("/authentication/login");
  }

  if (!organization) {
    redirect("/authentication/login");
  }

  return <DashboardShell>{children}</DashboardShell>;
}
