import Grid from '@mui/material/Unstable_Grid2';
import { notFound } from 'next/navigation';
import { Stack, Typography } from '@mui/material';
import { getActiveMembershipOrRedirect } from '@/lib/auth/session';
import {
  getOfferDetail,
  listOfferItemsByVersion,
  listOfferVersions,
} from '@/lib/db/queries/offers';
import { OfferHeader } from '../_components/OfferHeader';
import { OfferVersionsPanel } from '../_components/OfferVersionsPanel';
import { OfferItemsTable } from '../_components/OfferItemsTable';

type OfferDetailPageProps = {
  params: { id: string };
};

export default async function OfferDetailPage({ params }: OfferDetailPageProps) {
  const { membership } = await getActiveMembershipOrRedirect();

  const offer = await getOfferDetail(membership.organization_id, params.id);
  if (!offer) {
    notFound();
  }

  const versions = await listOfferVersions(offer.id);
  const currentVersionId = offer.currentVersionId ?? versions[0]?.id;

  const currentItems = currentVersionId
    ? await listOfferItemsByVersion(currentVersionId)
    : [];

  return (
    <Stack spacing={4}>
      <OfferHeader
        offerId={offer.id}
        title={offer.title}
        clientName={offer.clientName}
        isPublished={offer.isPublished}
      />
      <Grid container spacing={3}>
        <Grid xs={12} md={4}>
          <OfferVersionsPanel
            offerId={offer.id}
            versions={versions.map((version) => ({
              id: version.id,
              versionNumber: version.versionNumber,
              title: version.title,
              summary: version.summary,
              createdAt: version.createdAt?.toISOString() ?? new Date().toISOString(),
            }))}
          />
        </Grid>
        <Grid xs={12} md={8}>
          <OfferItemsTable
            items={currentItems.map((item) => ({
              id: item.id,
              name: item.name,
              description: item.description,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
            }))}
          />
        </Grid>
      </Grid>
    </Stack>
  );
}
