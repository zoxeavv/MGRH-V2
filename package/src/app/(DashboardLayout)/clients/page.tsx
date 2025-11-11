import { redirect } from "next/navigation";
import { eq, asc } from "drizzle-orm";
import { getSession, getActiveOrganization } from "@/lib/auth/session";
import { listClientsByOrganization } from "@/lib/db/queries/clients";
import ClientsLayout from "@/app/(DashboardLayout)/clients/components/ClientsLayout";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";

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
  const ownerRows = await db
    .select({
      id: users.id,
      name: users.fullName,
      email: users.email,
    })
    .from(users)
    .where(eq(users.organizationId, organization.id))
    .orderBy(asc(users.fullName));

  const owners = ownerRows.map((owner) => ({
    id: owner.id,
    name: owner.name ?? owner.email ?? "Unknown",
  }));

  const tagSet = new Set<string>();
  for (const client of clientRows) {
    for (const tag of client.tags ?? []) {
      if (tag) {
        tagSet.add(tag);
      }
    }
  }

  const tags = Array.from(tagSet).sort((a, b) => a.localeCompare(b));

  return (
    <ClientsLayout
      organization={organization}
      clients={clientRows}
      owners={owners}
      tags={tags}
    />
  );
}
