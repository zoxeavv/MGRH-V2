'use client';

import React, { useEffect, useRef } from 'react';
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from '@mui/material';
import { useActionState } from 'react';
import type { ClientActionState } from '@/app/(DashboardLayout)/clients/actions';
import { importClientsAction } from '@/app/(DashboardLayout)/clients/actions';

type ImportClientsDialogProps = {
  open: boolean;
  onClose: () => void;
  onSuccess: (message: string) => void;
};

const INITIAL_STATE: ClientActionState = {
  status: 'idle',
  message: '',
};

export default function ImportClientsDialog({
  open,
  onClose,
  onSuccess,
}: ImportClientsDialogProps) {
  const [state, formAction, pending] = useActionState(importClientsAction, INITIAL_STATE);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (state.status === 'success' && state.message) {
      onSuccess(state.message);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }, [onSuccess, state]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <form action={formAction} encType="multipart/form-data">
        <DialogTitle>Import clients from CSV</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2} mt={1}>
            {state.status === 'error' && state.message ? (
              <Alert severity="error">{state.message}</Alert>
            ) : (
              <Alert severity="info">
                Use a UTF-8 encoded CSV with headers such as <strong>name</strong>,{' '}
                <strong>company</strong>, <strong>email</strong>, <strong>phone</strong>,{' '}
                <strong>status</strong>, <strong>tags</strong>, and <strong>notes</strong>. Unknown
                columns are ignored.
              </Alert>
            )}

            <Button
              component="label"
              variant="outlined"
              color="primary"
              disabled={pending}
            >
              Choose CSV file
              <input
                ref={fileInputRef}
                type="file"
                name="file"
                accept=".csv,text/csv"
                hidden
                required
              />
            </Button>

            <Typography variant="body2" color="text.secondary">
              Each row should include at least a <strong>name</strong>. Tags can be comma or
              semicolon separated.
            </Typography>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={pending}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={pending}>
            {pending ? 'Importing…' : 'Import clients'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
