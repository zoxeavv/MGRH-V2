'use client';

import React, { useMemo, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import {
  Alert,
  Snackbar,
  Stack,
  Typography,
} from '@mui/material';
import type { OrganizationSummary } from '@/lib/auth/session';
import type { ClientListItem } from '@/lib/db/queries/clients';
import ClientsDataTable from '@/app/(DashboardLayout)/clients/components/ClientsDataTable';
import ClientsToolbar from '@/app/(DashboardLayout)/clients/components/ClientsToolbar';
import ClientsFilters from '@/app/(DashboardLayout)/clients/components/ClientsFilters';
import ClientBulkActions from '@/app/(DashboardLayout)/clients/components/ClientBulkActions';
import ClientCreateDialog from '@/app/(DashboardLayout)/clients/components/ClientCreateDialog';
import ImportClientsDialog from '@/app/(DashboardLayout)/clients/components/ImportClientsDialog';
import {
  CLIENT_STATUS_VALUES,
  type ClientStatus,
  bulkUpdateClientStatus,
} from '@/app/(DashboardLayout)/clients/actions';

type OwnerOption = {
  id: string;
  name: string;
};

type ClientsLayoutProps = {
  organization: OrganizationSummary;
  clients: ClientListItem[];
  owners: OwnerOption[];
  tags: string[];
};

type Feedback = {
  status: 'success' | 'error';
  message: string;
};

const CLIENT_STATUS_LABELS: Record<ClientStatus, string> = {
  prospect: 'Prospect',
  active: 'Active',
  inactive: 'Inactive',
  archived: 'Archived',
};

export default function ClientsLayout({
  organization,
  clients,
  owners,
  tags,
}: ClientsLayoutProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilters, setStatusFilters] = useState<ClientStatus[]>([]);
  const [ownerFilters, setOwnerFilters] = useState<string[]>([]);
  const [tagFilters, setTagFilters] = useState<string[]>([]);
  const [selectedClientIds, setSelectedClientIds] = useState<string[]>([]);
  const [isBulkPending, startBulkTransition] = useTransition();
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [isCreateDialogOpen, setCreateDialogOpen] = useState(false);
  const [isImportDialogOpen, setImportDialogOpen] = useState(false);

  const statusOptions = CLIENT_STATUS_VALUES.map((status) => ({
    value: status,
    label: CLIENT_STATUS_LABELS[status],
  }));

  const ownerOptions = owners.map((owner) => ({
    value: owner.id,
    label: owner.name,
  }));

  const filteredClients = useMemo(() => {
    return clients.filter((client) => {
      const query = searchQuery.trim().toLowerCase();
      if (query.length > 0) {
        const haystack = [
          client.name,
          client.company,
          client.email,
          client.phone,
          client.ownerName,
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();
        if (!haystack.includes(query)) {
          return false;
        }
      }

      if (statusFilters.length > 0 && !statusFilters.includes(client.status as ClientStatus)) {
        return false;
      }

      if (ownerFilters.length > 0 && (!client.ownerId || !ownerFilters.includes(client.ownerId))) {
        return false;
      }

      if (tagFilters.length > 0) {
        const clientTags = new Set(client.tags ?? []);
        const tagMatch = tagFilters.every((tag) => clientTags.has(tag));
        if (!tagMatch) {
          return false;
        }
      }

      return true;
    });
  }, [clients, ownerFilters, searchQuery, statusFilters, tagFilters]);

  const handleToggleStatusFilter = (status: ClientStatus) => {
    setStatusFilters((prev) =>
      prev.includes(status) ? prev.filter((item) => item !== status) : [...prev, status]
    );
  };

  const handleToggleOwnerFilter = (ownerId: string) => {
    setOwnerFilters((prev) =>
      prev.includes(ownerId) ? prev.filter((id) => id !== ownerId) : [...prev, ownerId]
    );
  };

  const handleToggleTagFilter = (tag: string) => {
    setTagFilters((prev) =>
      prev.includes(tag) ? prev.filter((value) => value !== tag) : [...prev, tag]
    );
  };

  const handleClearFilters = () => {
    setStatusFilters([]);
    setOwnerFilters([]);
    setTagFilters([]);
    setSearchQuery('');
  };

  const handleToggleClientSelection = (clientId: string) => {
    setSelectedClientIds((prev) =>
      prev.includes(clientId)
        ? prev.filter((id) => id !== clientId)
        : [...prev, clientId]
    );
  };

  const handleToggleSelectAll = () => {
    if (selectedClientIds.length === filteredClients.length) {
      setSelectedClientIds([]);
    } else {
      setSelectedClientIds(filteredClients.map((client) => client.id));
    }
  };

  const handleBulkStatusChange = (status: ClientStatus) => {
    if (selectedClientIds.length === 0) {
      setFeedback({
        status: 'error',
        message: 'Select at least one client to update.',
      });
      return;
    }

    startBulkTransition(async () => {
      const result = await bulkUpdateClientStatus(selectedClientIds, status);
      setFeedback({
        status: result.status === 'success' ? 'success' : 'error',
        message: result.message ?? '',
      });
      if (result.status === 'success') {
        setSelectedClientIds([]);
        router.refresh();
      }
    });
  };

  const handleActionSuccess = (message: string) => {
    setFeedback({
      status: 'success',
      message,
    });
    setCreateDialogOpen(false);
    setImportDialogOpen(false);
    router.refresh();
  };

  return (
    <>
      <Stack spacing={3}>
        <Stack spacing={1}>
          <Typography variant="h4" component="h1" fontWeight={600}>
            Clients
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Manage customer relationships for {organization.name}. Use filters, search, and bulk
            actions to keep your pipeline in shape.
          </Typography>
        </Stack>

        <ClientsToolbar
          searchQuery={searchQuery}
          onSearchQueryChange={setSearchQuery}
          onOpenCreateDialog={() => setCreateDialogOpen(true)}
          onOpenImportDialog={() => setImportDialogOpen(true)}
          hasActiveFilters={
            statusFilters.length > 0 || ownerFilters.length > 0 || tagFilters.length > 0
          }
          onClearFilters={handleClearFilters}
        />

        <ClientsFilters
          statusOptions={statusOptions}
          selectedStatuses={statusFilters}
          onToggleStatus={handleToggleStatusFilter}
          ownerOptions={ownerOptions}
          selectedOwners={ownerFilters}
          onToggleOwner={handleToggleOwnerFilter}
          tagOptions={tags}
          selectedTags={tagFilters}
          onToggleTag={handleToggleTagFilter}
        />

        <ClientBulkActions
          disabled={isBulkPending || selectedClientIds.length === 0}
          selectedCount={selectedClientIds.length}
          onMarkActive={() => handleBulkStatusChange('active')}
          onMarkInactive={() => handleBulkStatusChange('inactive')}
          onMarkArchived={() => handleBulkStatusChange('archived')}
        />

        <ClientsDataTable
          organization={organization}
          clients={filteredClients}
          selectedClientIds={selectedClientIds}
          onToggleClient={handleToggleClientSelection}
          onToggleAll={handleToggleSelectAll}
        />
      </Stack>

      <ClientCreateDialog
        open={isCreateDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        owners={owners}
        onSuccess={(message) => handleActionSuccess(message)}
      />

      <ImportClientsDialog
        open={isImportDialogOpen}
        onClose={() => setImportDialogOpen(false)}
        onSuccess={(message) => handleActionSuccess(message)}
      />

      <Snackbar
        open={Boolean(feedback)}
        autoHideDuration={4000}
        onClose={() => setFeedback(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        {feedback ? (
          <Alert
            severity={feedback.status}
            onClose={() => setFeedback(null)}
            variant="filled"
            elevation={6}
          >
            {feedback.message}
          </Alert>
        ) : undefined}
      </Snackbar>
    </>
  );
}
