import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { getActiveMembershipOrRedirect } from '@/lib/auth/session';
import { listOffers } from '@/lib/db/queries/offers';

import DataTable from '@/components/DataTable';
import StatusChip from '@/components/StatusChip';
import Link from 'next/link';
import Button from '@mui/material/Button';

const OffersPage = async () => {
  const { organization } = await getActiveMembershipOrRedirect();
  const offers = await listOffers(organization.id);

  return (
    <Stack spacing={3}>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'flex-start', sm: 'center' }}
        spacing={2}
      >
        <Stack spacing={0.5}>
          <Typography variant="h4" fontWeight={700}>
            Offers
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Track proposals, versions, and revenue impact.
          </Typography>
        </Stack>
        <Button component={Link} href="/offers/new" variant="contained">
          New offer
        </Button>
      </Stack>

      <DataTable
        data={offers}
        columns={[
          {
            accessorKey: 'title',
            header: 'Offer',
            cell: ({ row }) => (
              <Stack spacing={0.5}>
                <Typography variant="subtitle2" fontWeight={600}>
                  {row.original.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {row.original.clientName ?? 'Unknown client'}
                </Typography>
              </Stack>
            ),
          },
          {
            accessorKey: 'isPublished',
            header: 'Status',
            cell: ({ row }) => (
              <StatusChip context="offer" status={row.original.isPublished ? 'published' : 'draft'} />
            ),
          },
          {
            accessorKey: 'updatedAt',
            header: 'Updated',
            cell: ({ row }) => (
              <Typography variant="body2" color="text.secondary">
                {new Intl.DateTimeFormat('en', {
                  dateStyle: 'medium',
                  timeStyle: 'short',
                }).format(row.original.updatedAt)}
              </Typography>
            ),
          },
        ]}
        onRowClick={(offer) => {
          window.location.href = `/offers/${offer.id}`;
        }}
        emptyState={
          <Typography variant="body2" color="text.secondary">
            No offers yet. Use a template to create your first proposal.
          </Typography>
        }
      />
    </Stack>
  );
};

export default OffersPage;
