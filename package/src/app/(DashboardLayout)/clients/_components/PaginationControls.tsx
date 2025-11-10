'use client';

import { Pagination, Stack, Typography } from '@mui/material';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTransition } from 'react';

type PaginationControlsProps = {
  total: number;
  page: number;
  pageSize: number;
};

export function PaginationControls({ total, page, pageSize }: PaginationControlsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const pageCount = Math.max(1, Math.ceil(total / pageSize));

  const handleChange = (_: React.ChangeEvent<unknown>, value: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', String(value));
    startTransition(() => {
      router.replace(`/clients?${params.toString()}`);
    });
  };

  return (
    <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ xs: 'stretch', md: 'center' }}>
      <Typography variant="body2" color="text.secondary">
        {total} clients
      </Typography>
      <Pagination
        count={pageCount}
        page={page}
        onChange={handleChange}
        color="primary"
        disabled={isPending}
        sx={{ ml: { md: 'auto' } }}
      />
    </Stack>
  );
}
