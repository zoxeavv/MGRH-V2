'use client';

import React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { baselightTheme } from '@/utils/theme/DefaultColors';
import { OrganizationProvider } from '@/components/layout/organization-context';
import type { OrganizationSummary } from '@/lib/auth/session';

type ProvidersProps = {
  children: React.ReactNode;
  organization: OrganizationSummary | null;
};

/**
 * Top-level client-side providers for the application.
 * Currently wraps children with the MUI theme and exposes organization context.
 */
export default function Providers({
  children,
  organization,
}: ProvidersProps) {
  return (
    <ThemeProvider theme={baselightTheme}>
      <CssBaseline />
      <OrganizationProvider organization={organization}>
        {children}
      </OrganizationProvider>
    </ThemeProvider>
  );
}
