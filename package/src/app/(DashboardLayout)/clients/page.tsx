import { redirect } from "next/navigation";
import { getSession, getActiveOrganization } from "@/lib/auth/session";
import { listClientsByOrganization } from "@/lib/db/queries/clients";
import ClientsDataTable from "@/app/(DashboardLayout)/clients/components/ClientsDataTable";

export default async function ClientsPage() {
  const session = await getSession();
  if (!session) {
    redirect("/authentication/login?redirectTo=/clients");
  }

  const organization = await getActiveOrganization();
  if (!organization) {
    return null;
  }

  const clientRows = await listClientsByOrganization(organization.id);

  return (
    <ClientsDataTable
      organization={organization}
      clients={clientRows}
    />
  );
}
