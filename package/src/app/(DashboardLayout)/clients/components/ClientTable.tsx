'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { ColumnDef } from '@tanstack/react-table';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import DataTable from '@/components/DataTable';
import StatusChip from '@/components/StatusChip';
import type { ClientListItem } from '@/lib/db/queries/clients';

type ClientTableProps = {
  clients: ClientListItem[];
};

const ClientTable = ({ clients }: ClientTableProps) => {
  const router = useRouter();

  const columns = React.useMemo<ColumnDef<ClientListItem>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'Client',
        cell: ({ row }) => (
          <Stack spacing={0.5}>
            <Typography variant="subtitle2" fontWeight={600}>
              {row.original.name}
            </Typography>
            {row.original.description ? (
              <Typography variant="body2" color="text.secondary" noWrap>
                {row.original.description}
              </Typography>
            ) : null}
          </Stack>
        ),
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => <StatusChip context="client" status={row.original.status} />,
      },
      {
        accessorKey: 'tags',
        header: 'Tags',
        cell: ({ row }) => {
          const tags = row.original.tags;

          if (!tags || tags.length === 0) {
            return <Typography variant="body2" color="text.secondary">—</Typography>;
          }

          return (
            <Stack direction="row" spacing={0.5}>
              {tags.slice(0, 3).map((tag) => (
                <Chip key={tag} label={tag} size="small" variant="outlined" />
              ))}
              {tags.length > 3 ? (
                <Chip label={`+${tags.length - 3}`} size="small" variant="outlined" />
              ) : null}
            </Stack>
          );
        },
      },
      {
        accessorKey: 'updatedAt',
        header: 'Updated',
        cell: ({ row }) => (
          <Typography variant="body2" color="text.secondary">
            {new Intl.DateTimeFormat('en', { dateStyle: 'medium' }).format(row.original.updatedAt)}
          </Typography>
        ),
      },
    ],
    [],
  );

  return (
    <DataTable
      columns={columns}
      data={clients}
      onRowClick={(client) => router.push(`/clients/${client.id}`)}
      emptyState={
        <Stack spacing={1.5} alignItems="center" py={8}>
          <Typography variant="subtitle1" fontWeight={600}>
            No clients yet
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Import a CSV or create a client to get started.
          </Typography>
        </Stack>
      }
    />
  );
};

export default ClientTable;

