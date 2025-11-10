'use client';

import * as React from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Tooltip from '@mui/material/Tooltip';
import { IconSearch, IconSortAscending2, IconSortDescending2 } from '@tabler/icons-react';

type ClientFiltersProps = {
  search?: string;
  sort?: 'created_at' | 'name' | 'status';
  direction?: 'asc' | 'desc';
};

const sortOptions = [
  { value: 'created_at', label: 'Newest' },
  { value: 'name', label: 'Name' },
  { value: 'status', label: 'Status' },
];

const ClientFilters = ({ search, sort = 'created_at', direction = 'desc' }: ClientFiltersProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const [query, setQuery] = React.useState(search ?? '');
  const [sortField, setSortField] = React.useState(sort);
  const [sortDirection, setSortDirection] = React.useState(direction);

  const updateSearchParams = React.useCallback(
    (updates: Record<string, string | undefined>) => {
      const next = new URLSearchParams(params.toString());

      Object.entries(updates).forEach(([key, value]) => {
        if (!value) {
          next.delete(key);
        } else {
          next.set(key, value);
        }
      });

      next.set('page', '1');

      const queryString = next.toString();
      router.push(queryString ? `${pathname}?${queryString}` : pathname);
    },
    [params, pathname, router],
  );

  React.useEffect(() => {
    setQuery(search ?? '');
  }, [search]);

  React.useEffect(() => {
    setSortField(sort);
  }, [sort]);

  React.useEffect(() => {
    setSortDirection(direction);
  }, [direction]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    updateSearchParams({ q: query || undefined });
  };

  const handleSortChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value as 'created_at' | 'name' | 'status';
    setSortField(value);
    updateSearchParams({ sort: value, direction: sortDirection });
  };

  const toggleDirection = () => {
    const nextDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    setSortDirection(nextDirection);
    updateSearchParams({ sort: sortField, direction: nextDirection });
  };

  return (
    <Stack
      component="form"
      direction={{ xs: 'column', sm: 'row' }}
      spacing={2}
      onSubmit={handleSubmit}
      alignItems={{ xs: 'stretch', sm: 'center' }}
    >
      <TextField
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search clients"
        size="small"
        variant="outlined"
        sx={{ flex: 1 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <IconSearch size={18} stroke={1.6} />
            </InputAdornment>
          ),
        }}
      />

      <TextField
        select
        size="small"
        label="Sort by"
        value={sortField}
        onChange={handleSortChange}
        sx={{ minWidth: 160 }}
      >
        {sortOptions.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </TextField>

      <Tooltip title={sortDirection === 'asc' ? 'Ascending' : 'Descending'}>
        <IconButton color="primary" onClick={toggleDirection} sx={{ alignSelf: 'center' }}>
          {sortDirection === 'asc' ? (
            <IconSortAscending2 size={20} stroke={1.6} />
          ) : (
            <IconSortDescending2 size={20} stroke={1.6} />
          )}
        </IconButton>
      </Tooltip>
    </Stack>
  );
};

export default ClientFilters;

