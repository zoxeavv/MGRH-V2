'use client';

import React, { useEffect } from 'react';
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from '@mui/material';
import { useActionState } from 'react';
import {
  CLIENT_STATUS_VALUES,
  type ClientActionState,
  createClientAction,
} from '@/app/(DashboardLayout)/clients/actions';

type OwnerOption = {
  id: string;
  name: string;
};

type ClientCreateDialogProps = {
  open: boolean;
  onClose: () => void;
  owners: OwnerOption[];
  onSuccess: (message: string) => void;
};

const INITIAL_STATE: ClientActionState = {
  status: 'idle',
  message: '',
};

const STATUS_LABELS: Record<string, string> = {
  prospect: 'Prospect',
  active: 'Active',
  inactive: 'Inactive',
  archived: 'Archived',
};

export default function ClientCreateDialog({
  open,
  onClose,
  owners,
  onSuccess,
}: ClientCreateDialogProps) {
  const [state, formAction, pending] = useActionState(createClientAction, INITIAL_STATE);

  useEffect(() => {
    if (state.status === 'success' && state.message) {
      onSuccess(state.message);
    }
  }, [onSuccess, state]);

  useEffect(() => {
    if (!open) {
      return;
    }

    if (state.status === 'success' || state.status === 'error') {
      // reset state if reopened
      // no direct API to reset useActionState, rely on re-render by closing dialog
    }
  }, [open, state]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <form action={formAction}>
        <DialogTitle>Create client</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2} mt={1}>
            {state.status === 'error' && state.message ? (
              <Alert severity="error">{state.message}</Alert>
            ) : null}

            <TextField
              name="name"
              label="Name"
              required
              fullWidth
              autoFocus
              disabled={pending}
            />

            <TextField
              name="company"
              label="Company"
              fullWidth
              disabled={pending}
            />

            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
              <TextField
                name="email"
                label="Email"
                type="email"
                fullWidth
                disabled={pending}
              />
              <TextField
                name="phone"
                label="Phone"
                fullWidth
                disabled={pending}
              />
            </Stack>

            <FormControl fullWidth disabled={pending}>
              <InputLabel id="client-status-label">Status</InputLabel>
              <Select
                labelId="client-status-label"
                label="Status"
                name="status"
                defaultValue="prospect"
              >
                {CLIENT_STATUS_VALUES.map((status) => (
                  <MenuItem key={status} value={status}>
                    {STATUS_LABELS[status]}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth disabled={pending}>
              <InputLabel id="client-owner-label">Owner</InputLabel>
              <Select
                labelId="client-owner-label"
                label="Owner"
                name="ownerId"
                defaultValue=""
              >
                <MenuItem value="">
                  <em>Unassigned</em>
                </MenuItem>
                {owners.map((owner) => (
                  <MenuItem key={owner.id} value={owner.id}>
                    {owner.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              name="tags"
              label="Tags (comma separated)"
              fullWidth
              placeholder="vip, enterprise, referral"
              disabled={pending}
            />

            <TextField
              name="notes"
              label="Notes"
              fullWidth
              multiline
              minRows={3}
              disabled={pending}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={pending}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={pending}>
            {pending ? 'Creating…' : 'Create client'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
