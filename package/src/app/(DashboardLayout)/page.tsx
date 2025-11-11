import { getSession } from '@/lib/auth/session';
import { getOrganizationByUserId } from '@/lib/db/queries/organizations';
import { getKPIs, getActivityTimeline } from '@/lib/db/queries/analytics';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Send, CheckCircle2, DollarSign, Calendar } from 'lucide-react';
import { format } from 'date-fns';

export default async function DashboardPage() {
  const session = await getSession();
  
  if (!session?.user) {
    redirect('/authentication/login');
  }

  const orgData = await getOrganizationByUserId(session.user.id);
  
  if (!orgData) {
    redirect('/authentication/login');
  }

  const kpis = await getKPIs(orgData.organization.id, 30);
  const timeline = await getActivityTimeline(orgData.organization.id, 30);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back to CardStacks CRM</p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Clients (30d)</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpis.newClients}</div>
            <p className="text-xs text-muted-foreground">Last 30 days</p>
          </CardContent>
        </Card>
        <Card className="rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Offers Sent (30d)</CardTitle>
            <Send className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpis.offersSent}</div>
            <p className="text-xs text-muted-foreground">Last 30 days</p>
          </CardContent>
        </Card>
        <Card className="rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Offers Won (30d)</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpis.offersWon}</div>
            <p className="text-xs text-muted-foreground">Last 30 days</p>
          </CardContent>
        </Card>
        <Card className="rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue (30d)</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${kpis.revenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Last 30 days</p>
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle>Activity Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          {timeline.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No recent activity</p>
            </div>
          ) : (
            <div className="space-y-4">
              {timeline.slice(0, 20).map((event) => (
                <div key={event.id} className="flex items-start gap-4 rounded-lg border p-4">
                  <div className="flex-1">
                    <p className="text-sm font-medium">{event.description}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {format(event.date, 'MMM d, yyyy h:mm a')}
                    </p>
                  </div>
                  <Badge
                    variant={
                      event.type === 'offer_accepted'
                        ? 'default'
                        : event.type === 'offer_rejected'
                        ? 'destructive'
                        : 'secondary'
                    }
                  >
                    {event.type.replace('_', ' ')}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
