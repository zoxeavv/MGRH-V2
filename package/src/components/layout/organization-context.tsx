'use client';

import React, { createContext, useContext, useMemo } from 'react';
import type { OrganizationSummary } from '@/lib/auth/session';

type OrganizationContextValue = {
  organization: OrganizationSummary | null;
};

const OrganizationContext = createContext<OrganizationContextValue | undefined>(
  undefined
);

type OrganizationProviderProps = {
  children: React.ReactNode;
  organization: OrganizationSummary | null;
};

export function OrganizationProvider({
  children,
  organization,
}: OrganizationProviderProps) {
  const value = useMemo(
    () => ({
      organization,
    }),
    [organization]
  );

  return (
    <OrganizationContext.Provider value={value}>
      {children}
    </OrganizationContext.Provider>
  );
}

export function useOrganization() {
  const context = useContext(OrganizationContext);
  if (!context) {
    throw new Error(
      'useOrganization must be used within an OrganizationProvider component.'
    );
  }
  return context;
}
