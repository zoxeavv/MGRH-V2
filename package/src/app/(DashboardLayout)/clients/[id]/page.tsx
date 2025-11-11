import { getSession } from '@/lib/auth/session';
import { getOrganizationByUserId } from '@/lib/db/queries/organizations';
import { getClientById } from '@/lib/db/queries/clients';
import { redirect, notFound } from 'next/navigation';
import { ClientDetailView } from './ClientDetailView';

export default async function ClientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getSession();
  
  if (!session?.user) {
    redirect('/authentication/login');
  }

  const orgData = await getOrganizationByUserId(session.user.id);
  
  if (!orgData) {
    redirect('/authentication/login');
  }

  const { id } = await params;
  const client = await getClientById(id, orgData.organization.id);

  if (!client) {
    notFound();
  }

  return <ClientDetailView client={client} organizationId={orgData.organization.id} />;
}
