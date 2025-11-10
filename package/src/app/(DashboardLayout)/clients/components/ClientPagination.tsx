'use client';

import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

type ClientPaginationProps = {
  page: number;
  pageCount: number;
};

const ClientPagination = ({ page, pageCount }: ClientPaginationProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const handleChange = (_: React.ChangeEvent<unknown>, value: number) => {
    const next = new URLSearchParams(params.toString());
    next.set('page', value.toString());
    const queryString = next.toString();
    router.push(queryString ? `${pathname}?${queryString}` : pathname);
  };

  if (pageCount <= 1) {
    return null;
  }

  return (
    <Stack direction="row" justifyContent="flex-end">
      <Pagination count={pageCount} page={page} onChange={handleChange} color="primary" />
    </Stack>
  );
};

export default ClientPagination;

