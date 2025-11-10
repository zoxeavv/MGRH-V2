import { getActiveMembershipOrRedirect } from '@/lib/auth/session';

import DashboardShell from '../components/DashboardShell';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const context = await getActiveMembershipOrRedirect();

  return <DashboardShell context={context}>{children}</DashboardShell>;
}
