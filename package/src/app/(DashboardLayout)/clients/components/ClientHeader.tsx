'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Avatar from '@mui/material/Avatar';

import StatusChip from '@/components/StatusChip';
import { updateClientStatus } from '../actions';
import { clientStatusValues } from '@/lib/validation/clients';

type ClientContact = {
  name?: string;
  email?: string;
  phone?: string;
  title?: string;
};

type ClientHeaderProps = {
  client: {
    id: string;
    status: string;
    tags: string[];
    contacts: ClientContact[];
  };
};

const ClientHeader = ({ client }: ClientHeaderProps) => {
  const router = useRouter();
  const [status, setStatus] = React.useState(client.status);
  const [isPending, startTransition] = React.useTransition();

  const handleStatusChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nextStatus = event.target.value;
    setStatus(nextStatus);

    startTransition(async () => {
      const result = await updateClientStatus({
        clientId: client.id,
        status: nextStatus as (typeof clientStatusValues)[number],
      });

      if (!result.success) {
        setStatus(client.status);
      } else {
        router.refresh();
      }
    });
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Stack spacing={3}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
          <StatusChip context="client" status={status} />
          <TextField
            select
            size="small"
            value={status}
            onChange={handleStatusChange}
            disabled={isPending}
            label="Update status"
            sx={{ minWidth: 180 }}
          >
            {clientStatusValues.map((value) => (
              <MenuItem key={value} value={value}>
                {value.replace('_', ' ')}
              </MenuItem>
            ))}
          </TextField>
        </Stack>

        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          {client.tags.map((tag) => (
            <Chip key={tag} label={tag} color="primary" variant="outlined" />
          ))}
          {client.tags.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              No tags yet
            </Typography>
          ) : null}
        </Stack>

        <Stack spacing={1}>
          <Typography variant="subtitle2" color="text.secondary">
            Contacts
          </Typography>
          {client.contacts.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              No contacts recorded.
            </Typography>
          ) : (
            client.contacts.map((contact, index) => (
              <Stack key={`${contact.email ?? contact.name ?? index}`} direction="row" spacing={2} alignItems="center">
                <Avatar sx={{ width: 36, height: 36 }}>
                  {(contact.name ?? contact.email ?? '?')
                    .toString()
                    .charAt(0)
                    .toUpperCase()}
                </Avatar>
                <Stack spacing={0.25}>
                  <Typography variant="subtitle2">{contact.name ?? contact.email ?? 'Contact'}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {contact.title ?? ''}
                  </Typography>
                  <Stack direction="row" spacing={1}>
                    {contact.email ? (
                      <Typography variant="body2" color="text.secondary">
                        {contact.email}
                      </Typography>
                    ) : null}
                    {contact.phone ? (
                      <Typography variant="body2" color="text.secondary">
                        {contact.phone}
                      </Typography>
                    ) : null}
                  </Stack>
                </Stack>
              </Stack>
            ))
          )}
        </Stack>
      </Stack>
    </Paper>
  );
};

export default ClientHeader;

