import { notFound } from 'next/navigation';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';

import { getActiveMembershipOrRedirect } from '@/lib/auth/session';
import { getOfferDetail } from '@/lib/db/queries/offers';

import OfferHeader from '../../components/OfferHeader';
import VersionList from '../../components/VersionList';
import ItemsTable from '../../components/ItemsTable';

type OfferDetailPageProps = {
  params: {
    id: string;
  };
};

const OfferDetailPage = async ({ params }: OfferDetailPageProps) => {
  const { organization } = await getActiveMembershipOrRedirect();
  const detail = await getOfferDetail(organization.id, params.id);

  if (!detail) {
    notFound();
  }

  return (
    <Stack spacing={3}>
      <OfferHeader
        offerId={detail.offer.id}
        title={detail.offer.title}
        summary={detail.offer.summary}
        clientName={detail.offer.client?.name ?? 'Unknown client'}
        isPublished={detail.offer.isPublished}
        total={detail.total}
      />

      <Grid container spacing={3}>
        <Grid xs={12} md={4}>
          <VersionList
            offerId={detail.offer.id}
            currentVersionId={detail.currentVersionId}
            versions={detail.versions.map((version) => ({
              ...version,
              createdAt: new Date(version.createdAt),
            }))}
          />
        </Grid>
        <Grid xs={12} md={8}>
          <ItemsTable
            offerId={detail.offer.id}
            items={detail.items.map((item) => ({
              ...item,
            }))}
          />
        </Grid>
      </Grid>
    </Stack>
  );
};

export default OfferDetailPage;
