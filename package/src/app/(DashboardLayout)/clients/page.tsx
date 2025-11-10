import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Link from 'next/link';

import { getActiveMembershipOrRedirect } from '@/lib/auth/session';
import { listClients } from '@/lib/db/queries/clients';

import ClientFilters from './components/ClientFilters';
import ClientTable from './components/ClientTable';
import ClientPagination from './components/ClientPagination';
import ClientCreateDialog from './components/ClientCreateDialog';

type ClientsPageProps = {
  searchParams: Record<string, string | string[] | undefined>;
};

const parseNumber = (value: string | string[] | undefined, defaultValue: number) => {
  if (!value) return defaultValue;
  const stringValue = Array.isArray(value) ? value[0] : value;
  const parsed = parseInt(stringValue, 10);
  return Number.isNaN(parsed) || parsed <= 0 ? defaultValue : parsed;
};

const ClientsPage = async ({ searchParams }: ClientsPageProps) => {
  const { organization } = await getActiveMembershipOrRedirect();

  const page = parseNumber(searchParams.page, 1);
  const search = typeof searchParams.q === 'string' ? searchParams.q : undefined;
  const sort =
    typeof searchParams.sort === 'string' && ['created_at', 'name', 'status'].includes(searchParams.sort)
      ? (searchParams.sort as 'created_at' | 'name' | 'status')
      : 'created_at';
  const direction =
    typeof searchParams.direction === 'string' && ['asc', 'desc'].includes(searchParams.direction)
      ? (searchParams.direction as 'asc' | 'desc')
      : 'desc';

  const result = await listClients({
    organizationId: organization.id,
    page,
    pageSize: 10,
    search,
    sort,
    direction,
  });

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
            Clients
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage relationships, notes, tasks, and offers for each account.
          </Typography>
        </Stack>
        <Stack direction="row" spacing={1}>
          <Button component={Link} href="/clients/import" variant="outlined">
            Import CSV
          </Button>
          <ClientCreateDialog />
        </Stack>
      </Stack>

      <ClientFilters search={search} sort={sort} direction={direction} />

      <ClientTable clients={result.items} />

      <ClientPagination page={result.page} pageCount={result.pageCount} />
    </Stack>
  );
};

export default ClientsPage;
