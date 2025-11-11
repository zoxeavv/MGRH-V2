import { ReactNode } from 'react';
import { getSession } from '@/lib/auth/session';
import { getOrganizationByUserId } from '@/lib/db/queries/organizations';
import { redirect } from 'next/navigation';
import DashboardLayoutClient from './DashboardLayoutClient';
import { DashboardShell } from '@/components/DashboardShell';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default async function DashboardLayout({ children }: DashboardLayoutProps) {
  const session = await getSession();
  
  if (!session?.user) {
    redirect('/authentication/login');
  }

  const orgData = await getOrganizationByUserId(session.user.id);
  const organization = orgData
    ? {
        id: orgData.organization.id,
        name: orgData.organization.name,
        role: orgData.role as 'owner' | 'member',
      }
    : null;

  return (
    <DashboardShell organization={organization}>
      <DashboardLayoutClient>{children}</DashboardLayoutClient>
    </DashboardShell>
  );
}
