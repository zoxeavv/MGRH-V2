import { Typography } from '@mui/material';
import { getActiveMembershipOrRedirect } from '@/lib/auth/session';
import { listClientsForOrganization, listTemplatesForOrganization } from '@/lib/db/queries/offers';
import { OfferWizard } from '../_components/OfferWizard';

export default async function OfferNewPage() {
  const { membership } = await getActiveMembershipOrRedirect();
  const clients = await listClientsForOrganization(membership.organization_id);
  const templates = await listTemplatesForOrganization(membership.organization_id);

  return (
    <>
      <Typography variant="h4" fontWeight={700} mb={1}>
        Nouvelle offre
      </Typography>
      <Typography variant="body1" color="text.secondary" mb={4}>
        Sélectionnez un client, un template puis personnalisez les postes avant de créer votre offre.
      </Typography>
      <OfferWizard clients={clients} templates={templates} />
    </>
  );
}
