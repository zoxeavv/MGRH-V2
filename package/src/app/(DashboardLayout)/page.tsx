import { Suspense } from 'react';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';

import { getActiveMembershipOrRedirect } from '@/lib/auth/session';
import {
  getActivityFeed,
  getDashboardKpis,
  getRevenueByMonth,
} from '@/lib/db/queries/dashboard';

import KpiCard from './components/dashboard/KpiCard';
import RevenueChart from './components/dashboard/RevenueChart';
import ActivityFeed from './components/dashboard/ActivityFeed';

const DashboardPage = async () => {
  const { organization, profile, user } = await getActiveMembershipOrRedirect();

  const displayName = profile?.full_name ?? user.email ?? 'there';

  return (
    <Stack spacing={3}>
      <Stack spacing={0.5}>
        <Typography variant="h4" fontWeight={700}>
          Welcome back, {displayName.split(' ')[0]} 👋
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Here’s what’s happening in {organization.name} this week.
        </Typography>
      </Stack>

      <Suspense fallback={<KpiSkeleton />}>
        <KpiSection organizationId={organization.id} />
      </Suspense>

      <Grid container spacing={3}>
        <Grid xs={12} md={8}>
          <Suspense fallback={<ChartSkeleton />}>
            <RevenueSection organizationId={organization.id} />
          </Suspense>
        </Grid>
        <Grid xs={12} md={4}>
          <Suspense fallback={<ActivitySkeleton />}>
            <ActivitySection organizationId={organization.id} />
          </Suspense>
        </Grid>
      </Grid>
    </Stack>
  );
};

const KpiSection = async ({ organizationId }: { organizationId: string }) => {
  const kpis = await getDashboardKpis(organizationId);

  return (
    <Grid container spacing={2}>
      <Grid xs={12} sm={6} md={3}>
        <KpiCard label="Active clients" value={kpis.activeClients} />
      </Grid>
      <Grid xs={12} sm={6} md={3}>
        <KpiCard label="Published offers" value={kpis.publishedOffers} />
      </Grid>
      <Grid xs={12} sm={6} md={3}>
        <KpiCard label="Estimated revenue" value={kpis.estimatedRevenue} prefix="$" />
      </Grid>
      <Grid xs={12} sm={6} md={3}>
        <KpiCard label="Tasks due < 7 days" value={kpis.tasksDueSoon} />
      </Grid>
    </Grid>
  );
};

const RevenueSection = async ({ organizationId }: { organizationId: string }) => {
  const data = await getRevenueByMonth(organizationId, 6);
  return <RevenueChart data={data} />;
};

const ActivitySection = async ({ organizationId }: { organizationId: string }) => {
  const activity = await getActivityFeed(organizationId, 20);
  return <ActivityFeed items={activity} />;
};

const KpiSkeleton = () => (
  <Grid container spacing={2}>
    {Array.from({ length: 4 }).map((_, index) => (
      <Grid xs={12} sm={6} md={3} key={`kpi-skeleton-${index}`}>
        <Skeleton variant="rounded" height={120} />
      </Grid>
    ))}
  </Grid>
);

const ChartSkeleton = () => <Skeleton variant="rounded" height={360} />;

const ActivitySkeleton = () => <Skeleton variant="rounded" height={360} />;

export default DashboardPage;
