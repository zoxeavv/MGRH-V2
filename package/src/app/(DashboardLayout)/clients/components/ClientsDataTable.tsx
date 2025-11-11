'use client';

import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Chip,
  Checkbox,
  Stack,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import type { OrganizationSummary } from '@/lib/auth/session';
import type { ClientListItem } from '@/lib/db/queries/clients';

type ClientsDataTableProps = {
  organization: OrganizationSummary;
  clients: ClientListItem[];
  selectedClientIds: string[];
  onToggleClient: (clientId: string) => void;
  onToggleAll: () => void;
};

const statusColorMap: Record<string, 'default' | 'success' | 'warning' | 'error'> = {
  active: 'success',
  prospect: 'warning',
  inactive: 'default',
  archived: 'error',
};

export default function ClientsDataTable({
  organization,
  clients,
  selectedClientIds,
  onToggleClient,
  onToggleAll,
}: ClientsDataTableProps) {
  const allSelected = clients.length > 0 && selectedClientIds.length === clients.length;
  const indeterminate = selectedClientIds.length > 0 && !allSelected;

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h4" component="h1" fontWeight={600}>
          Clients
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          {organization.name} • {clients.length} client
          {clients.length === 1 ? '' : 's'}
        </Typography>
      </Box>

      <Card>
        <CardContent>
          <TableContainer component={Paper} elevation={0} sx={{ boxShadow: 'none' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox">
                    <Checkbox
                      indeterminate={indeterminate}
                      checked={allSelected}
                      onChange={onToggleAll}
                      inputProps={{ 'aria-label': 'Select all clients' }}
                    />
                  </TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Company</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Phone</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Owner</TableCell>
                  <TableCell>Tags</TableCell>
                  <TableCell align="right">Updated</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {clients.map((client) => (
                  <TableRow key={client.id} hover>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selectedClientIds.includes(client.id)}
                        onChange={() => onToggleClient(client.id)}
                        inputProps={{ 'aria-label': `Select ${client.name}` }}
                      />
                    </TableCell>
                    <TableCell>
                      <Stack spacing={0.5}>
                        <Typography fontWeight={600}>{client.name}</Typography>
                        {client.company ? (
                          <Typography variant="body2" color="text.secondary">
                            {client.company}
                          </Typography>
                        ) : null}
                      </Stack>
                    </TableCell>
                    <TableCell>{client.company ?? '—'}</TableCell>
                    <TableCell>{client.email ?? '—'}</TableCell>
                    <TableCell>{client.phone ?? '—'}</TableCell>
                    <TableCell>
                      <Chip
                        size="small"
                        label={client.status}
                        color={statusColorMap[client.status] ?? 'default'}
                        sx={{ textTransform: 'capitalize' }}
                      />
                    </TableCell>
                    <TableCell>{client.ownerName ?? 'Unassigned'}</TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1}>
                        {client.tags.length > 0 ? (
                          client.tags.map((tag) => (
                            <Chip key={tag} size="small" label={tag} variant="outlined" />
                          ))
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            —
                          </Typography>
                        )}
                      </Stack>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2" color="text.secondary">
                        {client.updatedAt
                          ? new Date(client.updatedAt).toLocaleDateString()
                          : '—'}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
                {clients.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8}>
                      <Stack
                        alignItems="center"
                        justifyContent="center"
                        spacing={1}
                        py={6}
                      >
                        <Typography variant="h6" fontWeight={600}>
                          No clients yet
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Import your first contacts or start with a manual entry. Bulk
                          import via CSV and automation hooks land in Phase 2.
                        </Typography>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ) : null}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Stack>
  );
}
