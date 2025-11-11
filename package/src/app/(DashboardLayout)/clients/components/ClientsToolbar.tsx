'use client';

import React from 'react';
import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Tooltip,
} from '@mui/material';
import { IconFilterOff, IconPlus, IconUpload, IconSearch } from '@tabler/icons-react';

type ClientsToolbarProps = {
  searchQuery: string;
  onSearchQueryChange: (value: string) => void;
  onOpenCreateDialog: () => void;
  onOpenImportDialog: () => void;
  hasActiveFilters: boolean;
  onClearFilters: () => void;
};

export default function ClientsToolbar({
  searchQuery,
  onSearchQueryChange,
  onOpenCreateDialog,
  onOpenImportDialog,
  hasActiveFilters,
  onClearFilters,
}: ClientsToolbarProps) {
  return (
    <Stack
      direction={{ xs: 'column', md: 'row' }}
      spacing={2}
      alignItems={{ xs: 'stretch', md: 'center' }}
      justifyContent="space-between"
    >
      <Box sx={{ flexGrow: 1 }}>
        <TextField
          fullWidth
          placeholder="Search clients by name, company, email, or phone"
          value={searchQuery}
          onChange={(event) => onSearchQueryChange(event.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <IconSearch size={18} />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <Stack direction="row" spacing={1} justifyContent="flex-end">
        {hasActiveFilters ? (
          <Tooltip title="Clear filters">
            <IconButton onClick={onClearFilters}>
              <IconFilterOff size={18} />
            </IconButton>
          </Tooltip>
        ) : null}

        <Button
          variant="outlined"
          color="primary"
          startIcon={<IconUpload size={18} />}
          onClick={onOpenImportDialog}
        >
          Import
        </Button>

        <Button
          variant="contained"
          color="primary"
          startIcon={<IconPlus size={18} />}
          onClick={onOpenCreateDialog}
        >
          New Client
        </Button>
      </Stack>
    </Stack>
  );
}
