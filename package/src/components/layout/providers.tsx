"use client";

import React, { createContext, useContext, type ReactNode } from "react";

export type OrganizationContextValue = {
  id: string;
  name: string;
  slug: string;
  role: "owner" | "member" | "viewer";
};

const OrganizationContext = createContext<OrganizationContextValue | null>(null);

export function OrganizationProvider({
  children,
  organization,
}: {
  children: ReactNode;
  organization: OrganizationContextValue | null;
}) {
  return (
    <OrganizationContext.Provider value={organization}>
      {children}
    </OrganizationContext.Provider>
  );
}

export function useOrganization(): OrganizationContextValue {
  const context = useContext(OrganizationContext);
  if (!context) {
    throw new Error("useOrganization must be used within OrganizationProvider");
  }
  return context;
}

export function useOrganizationOptional(): OrganizationContextValue | null {
  return useContext(OrganizationContext);
}
