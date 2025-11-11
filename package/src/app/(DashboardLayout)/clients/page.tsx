import { ClientsTable } from "@/components/clients/ClientsTable";
import { getClients } from "@/lib/db/queries/clients";
import { getOrganizationContext } from "@/lib/auth/session";
import { redirect } from "next/navigation";

export default async function ClientsPage() {
  const organization = await getOrganizationContext();
  if (!organization) {
    redirect("/authentication/login");
  }

  const clients = await getClients(organization.id);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Clients</h1>
          <p className="text-muted-foreground">
            Manage your client relationships
          </p>
        </div>
      </div>
      <ClientsTable initialClients={clients} organizationId={organization.id} />
    </div>
  );
}
