'use client';

import React, { createContext, useContext, ReactNode } from 'react';

type UserRole = 'owner' | 'member';

interface Organization {
  id: string;
  name: string;
  role: UserRole;
}

interface OrganizationContextValue {
  organization: Organization | null;
  isLoading: boolean;
}

const OrganizationContext = createContext<OrganizationContextValue | undefined>(undefined);

export function OrganizationProvider({
  children,
  organization,
}: {
  children: ReactNode;
  organization: Organization | null;
}) {
  return (
    <OrganizationContext.Provider value={{ organization, isLoading: false }}>
      {children}
    </OrganizationContext.Provider>
  );
}

export function useOrganization() {
  const context = useContext(OrganizationContext);
  if (context === undefined) {
    throw new Error('useOrganization must be used within OrganizationProvider');
  }
  return context;
}
