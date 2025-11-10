import { getActiveMembershipOrRedirect } from '@/lib/auth/session';
import { DashboardLayoutShell } from './components/layout/DashboardLayoutShell';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { profile, membership } = await getActiveMembershipOrRedirect();

  return (
    <DashboardLayoutShell profile={profile} membership={membership}>
      {children}
    </DashboardLayoutShell>
  );
}
