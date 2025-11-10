import Link from 'next/link';
import Grid from '@mui/material/Unstable_Grid2';
import { Box, Chip, Stack, Typography } from '@mui/material';
import { notFound } from 'next/navigation';
import { getActiveMembershipOrRedirect } from '@/lib/auth/session';
import { listClients } from '@/lib/db/queries/clients';
import { DataTable } from '@/components/ui/DataTable';
import { StatusChip } from '@/components/ui/StatusChip';
import { ClientListFilters } from './_components/ClientListFilters';
import { NewClientDialog } from './_components/NewClientDialog';
import { PaginationControls } from './_components/PaginationControls';

type ClientsPageProps = {
  searchParams: {
    q?: string;
    status?: string;
    sort?: string;
    page?: string;
  };
};

const PAGE_SIZE = 10;

export default async function ClientsPage({ searchParams }: ClientsPageProps) {
  const { membership } = await getActiveMembershipOrRedirect();
  const page = Number(searchParams.page ?? '1');
  if (Number.isNaN(page) || page < 1) {
    notFound();
  }

  const search = searchParams.q ?? undefined;
  const status = (searchParams.status as 'lead' | 'active' | 'inactive' | 'archived' | undefined) ?? undefined;
  const sort = (searchParams.sort as 'name' | 'created_at' | undefined) ?? 'name';

  const clientsPage = await listClients({
    organizationId: membership.organization_id,
    search,
    status,
    sort,
    page,
    pageSize: PAGE_SIZE,
  });

  return (
    <Stack spacing={4}>
      <Box>
        <Typography variant="h4" fontWeight={700} mb={1}>
          Clients
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Gérez vos comptes, notes et tâches clients.
        </Typography>
      </Box>
      <Grid container spacing={2} alignItems="center">
        <Grid xs={12} md={8}>
          <ClientListFilters />
        </Grid>
        <Grid xs={12} md={4} sx={{ display: 'flex', justifyContent: { xs: 'stretch', md: 'flex-end' } }}>
          <NewClientDialog />
        </Grid>
      </Grid>
      <DataTable
        columns={[
          {
            key: 'name',
            header: 'Nom',
            render: (row) => (
              <Stack spacing={0.5}>
                <Typography
                  component={Link}
                  href={`/clients/${row.id}`}
                  variant="subtitle1"
                  sx={{ textDecoration: 'none', fontWeight: 600 }}
                >
                  {row.name}
                </Typography>
                {row.description ? (
                  <Typography variant="body2" color="text.secondary" noWrap>
                    {row.description}
                  </Typography>
                ) : null}
              </Stack>
            ),
          },
          {
            key: 'status',
            header: 'Statut',
            render: (row) => <StatusChip value={row.status} />,
          },
          {
            key: 'tags',
            header: 'Tags',
            render: (row) =>
              row.tags && row.tags.length > 0 ? (
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  {row.tags.map((tag) => (
                    <Chip key={tag} label={tag} size="small" />
                  ))}
                </Stack>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  —
                </Typography>
              ),
          },
          {
            key: 'updatedAt',
            header: 'Mis à jour',
            render: (row) =>
              row.updatedAt ? (
                <Typography variant="body2">
                  {new Intl.DateTimeFormat('fr-FR', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  }).format(new Date(row.updatedAt))}
                </Typography>
              ) : (
                '—'
              ),
          },
        ]}
        rows={clientsPage.data}
        getRowId={(row) => row.id}
      />
      <PaginationControls total={clientsPage.total} page={clientsPage.page} pageSize={clientsPage.pageSize} />
    </Stack>
  );
}
