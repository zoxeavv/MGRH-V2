import { ReactNode } from 'react';
import { OrganizationProvider } from './providers/OrganizationProvider';

interface DashboardShellProps {
  children: ReactNode;
  organization: { id: string; name: string; role: 'owner' | 'member' } | null;
}

export function DashboardShell({ children, organization }: DashboardShellProps) {
  return (
    <OrganizationProvider organization={organization}>
      {children}
    </OrganizationProvider>
  );
}
