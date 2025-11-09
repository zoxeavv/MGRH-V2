'use client';

import { PropsWithChildren } from 'react';
import { Box } from '@mui/material';

type PageContainerProps = PropsWithChildren<{
  padded?: boolean;
}>;

export default function PageContainer({ children, padded = true }: PageContainerProps) {
  return (
    <Box component="section" sx={{ width: '100%', ...(padded ? { py: 2 } : {}) }}>
      {children}
    </Box>
  );
}
