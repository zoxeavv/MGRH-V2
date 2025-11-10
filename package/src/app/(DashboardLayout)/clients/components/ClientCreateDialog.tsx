'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Alert from '@mui/material/Alert';
import { IconPlus } from '@tabler/icons-react';

import { createClient } from '../actions';
import { clientStatusValues } from '@/lib/validation/clients';

const ClientCreateDialog = () => {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [isPending, startTransition] = React.useTransition();
  const [error, setError] = React.useState<string | null>(null);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const payload = {
      name: String(formData.get('name') ?? '').trim(),
      description: String(formData.get('description') ?? '').trim() || undefined,
      status: (formData.get('status') as string) ?? 'lead',
      contacts: [
        {
          name: String(formData.get('contactName') ?? '').trim() || undefined,
          email: String(formData.get('contactEmail') ?? '').trim() || undefined,
          phone: String(formData.get('contactPhone') ?? '').trim() || undefined,
        },
      ].filter((contact) => Object.values(contact).some(Boolean)),
      tags: String(formData.get('tags') ?? '')
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean),
    };

    startTransition(async () => {
      const result = await createClient(payload);
      if (result.success) {
        setError(null);
        setOpen(false);
        router.refresh();
      } else {
        setError(result.error);
      }
    });
  };

  return (
    <>
      <Button
        variant="contained"
        startIcon={<IconPlus size={18} stroke={1.6} />}
        onClick={() => setOpen(true)}
      >
        New client
      </Button>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create client</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent dividers>
            <Stack spacing={2}>
              {error ? <Alert severity="error">{error}</Alert> : null}

              <TextField name="name" label="Client name" required autoFocus />
              <TextField
                name="description"
                label="Description"
                multiline
                minRows={3}
                placeholder="Short context for your team"
              />

              <TextField select name="status" label="Status" defaultValue="lead">
                {clientStatusValues.map((status) => (
                  <MenuItem key={status} value={status}>
                    {status.replace('_', ' ')}
                  </MenuItem>
                ))}
              </TextField>

              <TextField name="tags" label="Tags" placeholder="Comma separated tags" />

              <Stack spacing={1} mt={2}>
                <TextField name="contactName" label="Primary contact name" />
                <TextField name="contactEmail" label="Primary contact email" type="email" />
                <TextField name="contactPhone" label="Primary contact phone" />
              </Stack>
            </Stack>
          </DialogContent>
          <DialogActions sx={{ px: 3, py: 2 }}>
            <Button onClick={() => setOpen(false)} disabled={isPending}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" disabled={isPending}>
              {isPending ? 'Creating…' : 'Create'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
};

export default ClientCreateDialog;

