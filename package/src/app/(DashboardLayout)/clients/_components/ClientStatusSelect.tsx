'use client';

import { MenuItem, TextField } from '@mui/material';
import { useState, useTransition } from 'react';
import { updateClientStatus } from '../actions';

const statusOptions = [
  { value: 'lead', label: 'Lead' },
  { value: 'active', label: 'Actif' },
  { value: 'inactive', label: 'Inactif' },
  { value: 'archived', label: 'Archivé' },
];

type ClientStatusSelectProps = {
  clientId: string;
  initialStatus: 'lead' | 'active' | 'inactive' | 'archived';
};

export function ClientStatusSelect({ clientId, initialStatus }: ClientStatusSelectProps) {
  const [value, setValue] = useState(initialStatus);
  const [isPending, startTransition] = useTransition();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nextStatus = event.target.value as 'lead' | 'active' | 'inactive' | 'archived';
    setValue(nextStatus);
    startTransition(async () => {
      await updateClientStatus({ id: clientId, status: nextStatus });
    });
  };

  return (
    <TextField
      select
      size="small"
      label="Statut"
      value={value}
      onChange={handleChange}
      disabled={isPending}
      sx={{ minWidth: 160 }}
    >
      {statusOptions.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </TextField>
  );
}
