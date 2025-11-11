'use client';

import React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { baselightTheme } from '@/utils/theme/DefaultColors';

type ProvidersProps = {
  children: React.ReactNode;
};

/**
 * Top-level client-side providers for the application.
 * Currently wraps children with the MUI theme; future phases will
 * extend this with organization context and additional global providers.
 */
export default function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider theme={baselightTheme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
