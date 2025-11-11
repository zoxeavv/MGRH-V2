import { getSession } from '@/lib/auth/session';
import { getOrganizationByUserId } from '@/lib/db/queries/organizations';
import { redirect } from 'next/navigation';
import { ImportClientForm } from '../ImportClientForm';

export default async function ImportClientsPage() {
  const session = await getSession();
  
  if (!session?.user) {
    redirect('/authentication/login');
  }

  const orgData = await getOrganizationByUserId(session.user.id);
  
  if (!orgData) {
    redirect('/authentication/login');
  }

  return (
    <ImportClientForm
      organizationId={orgData.organization.id}
      userId={session.user.id}
    />
  );
}
