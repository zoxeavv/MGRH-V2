import { getSession } from '@/lib/auth/session';
import { getOrganizationByUserId } from '@/lib/db/queries/organizations';
import { getClientsByOrganizationId } from '@/lib/db/queries/clients';
import { redirect } from 'next/navigation';
import { ClientsTable } from './ClientsTable';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Plus, Upload } from 'lucide-react';

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
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/clients/import">
              <Upload className="mr-2 h-4 w-4" />
              Import CSV
            </Link>
          </Button>
        </div>
      </div>
      <ClientsTable initialClients={clientsList} organizationId={orgData.organization.id} />
    </div>
  );
}
