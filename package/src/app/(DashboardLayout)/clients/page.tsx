import { getSession } from '@/lib/auth/session';
import { getOrganizationByUserId } from '@/lib/db/queries/organizations';
import { getClientsByOrganizationId } from '@/lib/db/queries/clients';
import { redirect } from 'next/navigation';
import { ClientsTable } from './ClientsTable';

export default async function ClientsPage() {
  const session = await getSession();
  
  if (!session?.user) {
    redirect('/authentication/login');
  }

  const orgData = await getOrganizationByUserId(session.user.id);
  
  if (!orgData) {
    redirect('/authentication/login');
  }

  const clientsList = await getClientsByOrganizationId(orgData.organization.id);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Clients</h1>
          <p className="text-muted-foreground">Manage your client relationships</p>
        </div>
      </div>
      <ClientsTable initialClients={clientsList} organizationId={orgData.organization.id} />
    </div>
  );
}
