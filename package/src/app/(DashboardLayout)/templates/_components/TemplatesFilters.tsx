'use client';

import SearchIcon from '@mui/icons-material/Search';
import { Button, MenuItem, Stack, TextField } from '@mui/material';
import { useRouter, useSearchParams } from 'next/navigation';
import { useMemo, useState, useTransition } from 'react';

type TemplatesFiltersProps = {
  categories: Array<string | null>;
};

export function TemplatesFilters({ categories }: TemplatesFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(() => searchParams.get('q') ?? '');
  const [category, setCategory] = useState(() => searchParams.get('category') ?? '');
  const [isPending, startTransition] = useTransition();

  const uniqueCategories = useMemo(() => {
    const unique = new Set<string>();
    categories.forEach((cat) => {
      if (cat) unique.add(cat);
    });
    return Array.from(unique);
  }, [categories]);

  const applyFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    if (query) params.set('q', query);
    else params.delete('q');

    if (category) params.set('category', category);
    else params.delete('category');

    startTransition(() => {
      router.replace(`/templates?${params.toString()}`);
    });
  };

  return (
    <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ md: 'center' }}>
      <TextField
        size="small"
        placeholder="Rechercher un template"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        InputProps={{
          startAdornment: <SearchIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />,
        }}
      />
      <TextField
        select
        size="small"
        label="Catégorie"
        value={category}
        onChange={(event) => setCategory(event.target.value)}
        sx={{ minWidth: 180 }}
      >
        <MenuItem value="">Toutes</MenuItem>
        {uniqueCategories.map((cat) => (
          <MenuItem key={cat} value={cat}>
            {cat}
          </MenuItem>
        ))}
      </TextField>
      <Button variant="outlined" onClick={applyFilters} disabled={isPending} sx={{ alignSelf: { xs: 'stretch', md: 'center' } }}>
        Filtrer
      </Button>
    </Stack>
  );
}
