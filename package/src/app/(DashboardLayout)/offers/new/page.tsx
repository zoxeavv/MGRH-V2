import { getSession } from '@/lib/auth/session';
import { getOrganizationByUserId } from '@/lib/db/queries/organizations';
import { getClientsByOrganizationId } from '@/lib/db/queries/clients';
import { redirect } from 'next/navigation';
import { OfferWizard } from './OfferWizard';

export default async function NewOfferPage() {
  const session = await getSession();
  
  if (!session?.user) {
    redirect('/authentication/login');
  }

  const orgData = await getOrganizationByUserId(session.user.id);
  
  if (!orgData) {
    redirect('/authentication/login');
  }

  const clients = await getClientsByOrganizationId(orgData.organization.id);

  return (
    <OfferWizard
      organizationId={orgData.organization.id}
      userId={session.user.id}
      clients={clients}
    />
  );
}
