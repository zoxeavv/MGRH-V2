import { getSession } from '@/lib/auth/session';
import { getOrganizationByUserId, getUserOrganizations } from '@/lib/db/queries/organizations';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { OrgSwitcher } from '@/components/OrgSwitcher';
import { getUserOrganizationsWithRole } from '@/lib/auth/roles';

export default async function SettingsPage() {
  const session = await getSession();
  
  if (!session?.user) {
    redirect('/authentication/login');
  }

  const orgData = await getOrganizationByUserId(session.user.id);
  
  if (!orgData) {
    redirect('/authentication/login');
  }

  const organizations = await getUserOrganizationsWithRole(session.user.id);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your organization settings</p>
      </div>
      
      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle>Organization</CardTitle>
          <CardDescription>Switch between your organizations</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Current Organization</label>
            <OrgSwitcher organizations={organizations} />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Your role:</span>
            <Badge variant={orgData.role === 'owner' ? 'default' : 'secondary'}>
              {orgData.role}
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle>Team & Roles</CardTitle>
          <CardDescription>Manage team members and permissions</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Team management coming soon. Roles: owner, member (stubbed).
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
