'use client';

import * as React from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import InputAdornment from '@mui/material/InputAdornment';
import { IconSearch } from '@tabler/icons-react';

type TemplateFiltersProps = {
  categories: string[];
  selectedCategory?: string;
  search?: string;
};

const TemplateFilters = ({ categories, selectedCategory = 'all', search = '' }: TemplateFiltersProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const [query, setQuery] = React.useState(search);
  const [category, setCategory] = React.useState(selectedCategory);

  const updateParams = (updates: Record<string, string | undefined>) => {
    const next = new URLSearchParams(params.toString());

    Object.entries(updates).forEach(([key, value]) => {
      if (!value || value === 'all') {
        next.delete(key);
      } else {
        next.set(key, value);
      }
    });

    const queryString = next.toString();
    router.push(queryString ? `${pathname}?${queryString}` : pathname);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    updateParams({ q: query || undefined, category });
  };

  React.useEffect(() => {
    setQuery(search);
  }, [search]);

  React.useEffect(() => {
    setCategory(selectedCategory);
  }, [selectedCategory]);

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
        placeholder="Search templates"
        size="small"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <IconSearch size={18} stroke={1.6} />
            </InputAdornment>
          ),
        }}
        sx={{ flex: 1 }}
      />

      <TextField
        select
        size="small"
        label="Category"
        value={category}
        onChange={(event) => {
          const value = event.target.value;
          setCategory(value);
          updateParams({ category: value, q: query || undefined });
        }}
        sx={{ minWidth: 200 }}
      >
        <MenuItem value="all">All categories</MenuItem>
        {categories.map((item) => (
          <MenuItem key={item} value={item}>
            {item || 'Uncategorized'}
          </MenuItem>
        ))}
      </TextField>
    </Stack>
  );
};

export default TemplateFilters;

