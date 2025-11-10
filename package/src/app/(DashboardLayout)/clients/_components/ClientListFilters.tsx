'use client';

import SearchIcon from '@mui/icons-material/Search';
import { Box, Button, MenuItem, Stack, TextField } from '@mui/material';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useTransition } from 'react';

const statusOptions = [
  { value: '', label: 'Tous les statuts' },
  { value: 'lead', label: 'Lead' },
  { value: 'active', label: 'Actif' },
  { value: 'inactive', label: 'Inactif' },
  { value: 'archived', label: 'Archivé' },
];

const sortOptions = [
  { value: 'name', label: 'Nom (A-Z)' },
  { value: 'created_at', label: 'Date de création' },
];

export function ClientListFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [query, setQuery] = useState(() => searchParams.get('q') ?? '');
  const [status, setStatus] = useState(() => searchParams.get('status') ?? '');
  const [sort, setSort] = useState(() => searchParams.get('sort') ?? 'name');

  const applyFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    if (query) {
      params.set('q', query);
    } else {
      params.delete('q');
    }

    if (status) {
      params.set('status', status);
    } else {
      params.delete('status');
    }

    if (sort) {
      params.set('sort', sort);
    } else {
      params.delete('sort');
    }

    params.set('page', '1');

    startTransition(() => {
      router.replace(`/clients?${params.toString()}`);
    });
  };

  return (
    <Stack
      direction={{ xs: 'column', md: 'row' }}
      spacing={2}
      sx={{ alignItems: { md: 'center' }, justifyContent: 'space-between' }}
    >
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <TextField
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          size="small"
          placeholder="Rechercher un client"
          InputProps={{
            startAdornment: <SearchIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />,
          }}
        />
        <TextField
          select
          size="small"
          label="Statut"
          value={status}
          onChange={(event) => setStatus(event.target.value)}
          sx={{ minWidth: 180 }}
        >
          {statusOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          size="small"
          label="Tri"
          value={sort}
          onChange={(event) => setSort(event.target.value)}
          sx={{ minWidth: 160 }}
        >
          {sortOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      </Box>
      <Button variant="contained" onClick={applyFilters} disabled={isPending}>
        Filtrer
      </Button>
    </Stack>
  );
}
