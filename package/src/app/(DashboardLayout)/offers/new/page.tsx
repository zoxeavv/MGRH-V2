import { getActiveMembershipOrRedirect } from '@/lib/auth/session';
import { listClientOptions } from '@/lib/db/queries/clients';
import { listTemplates } from '@/lib/db/queries/templates';

import OfferWizard from '../components/OfferWizard';

const OfferNewPage = async () => {
  const { organization } = await getActiveMembershipOrRedirect();
  const [clients, templates] = await Promise.all([
    listClientOptions(organization.id),
    listTemplates({ organizationId: organization.id }),
  ]);

  return (
    <OfferWizard
      clients={clients}
      templates={templates.map((template) => ({
        ...template,
        updatedAt: template.updatedAt.toISOString(),
      }))}
    />
  );
};

export default OfferNewPage;
