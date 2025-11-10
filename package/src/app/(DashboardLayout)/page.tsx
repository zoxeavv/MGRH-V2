import Grid from '@mui/material/Unstable_Grid2';
import { Box, Typography } from '@mui/material';
import { getActiveMembershipOrRedirect } from '@/lib/auth/session';
import {
  getDashboardKpis,
  getMonthlyRevenue,
  getRecentActivityFeed,
} from '@/lib/db/queries/dashboard';
import { StatsGrid } from './components/dashboard/StatsGrid';
import { RevenueChart } from './components/dashboard/RevenueChart';
import { ActivityFeed } from './components/dashboard/ActivityFeed';

export default async function DashboardPage() {
  const { membership } = await getActiveMembershipOrRedirect();
  const organizationId = membership.organization_id;

  const [kpis, activityFeed, monthlyRevenue] = await Promise.all([
    getDashboardKpis(organizationId),
    getRecentActivityFeed(organizationId),
    getMonthlyRevenue(organizationId),
  ]);

  return (
    <Box component="section" sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <Box>
        <Typography variant="h4" fontWeight={700} mb={1}>
          Bonjour 👋
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Suivez les performances de votre organisation en un coup d’œil.
        </Typography>
      </Box>

      <StatsGrid kpis={kpis} />

      <Grid container spacing={3}>
        <Grid xs={12} md={7}>
          <RevenueChart data={monthlyRevenue} />
        </Grid>
        <Grid xs={12} md={5}>
          <ActivityFeed items={activityFeed} />
        </Grid>
      </Grid>
    </Box>
  );
}
