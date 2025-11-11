"use client";
/**
 * ClientProviders Component
 * 
 * This component wraps all client-side providers (toasts, themes, etc.)
 * that require React hooks. It should be imported in server components
 * to maintain proper RSC boundaries.
 */

import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { baselightTheme } from '@/utils/theme/DefaultColors';

interface ClientProvidersProps {
  children: React.ReactNode;
}

export default function ClientProviders({ children }: ClientProvidersProps) {
  return (
    <ThemeProvider theme={baselightTheme}>
      <CssBaseline />
      {children}
      {/* Add other client providers here as needed:
          - Toaster (if using react-hot-toast or similar)
          - QueryClientProvider (if using React Query)
          - etc.
      */}
    </ThemeProvider>
  );
}
