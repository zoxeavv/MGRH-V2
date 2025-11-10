import Grid from '@mui/material/Unstable_Grid2';
import { alpha, Box, Card, Stack, Typography } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import type { DashboardKpis } from '@/lib/db/queries/dashboard';

type StatsGridProps = {
  kpis: DashboardKpis;
};

const items = [
  {
    key: 'activeClients' as const,
    label: 'Clients actifs',
    icon: <PeopleAltIcon fontSize="small" />,
    color: 'primary',
  },
  {
    key: 'publishedOffers' as const,
    label: 'Offres publiées',
    icon: <RocketLaunchIcon fontSize="small" />,
    color: 'secondary',
  },
  {
    key: 'estimatedRevenue' as const,
    label: 'Revenus estimés',
    icon: <TrendingUpIcon fontSize="small" />,
    color: 'success',
    isCurrency: true,
  },
  {
    key: 'upcomingTasks' as const,
    label: 'Tâches à venir',
    icon: <AssignmentTurnedInIcon fontSize="small" />,
    color: 'warning',
  },
];

const formatValue = (key: (typeof items)[number]['key'], value: number) => {
  if (key === 'estimatedRevenue') {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(value);
  }

  return new Intl.NumberFormat('fr-FR').format(value);
};

export function StatsGrid({ kpis }: StatsGridProps) {
  return (
    <Grid container spacing={3}>
      {items.map((item) => (
        <Grid key={item.key} xs={12} sm={6} lg={3}>
          <Card
            elevation={0}
            sx={{
              p: 3,
              height: '100%',
              borderRadius: 3,
              border: (theme) => `1px solid ${alpha(theme.palette[item.color].main, 0.2)}`,
              bgcolor: (theme) => alpha(theme.palette[item.color].light, 0.25),
            }}
          >
            <Stack direction="row" spacing={2} alignItems="center" height="100%">
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  display: 'grid',
                  placeItems: 'center',
                  bgcolor: (theme) => alpha(theme.palette[item.color].main, 0.12),
                  color: (theme) => theme.palette[item.color].main,
                }}
              >
                {item.icon}
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  {item.label}
                </Typography>
                <Typography variant="h5" fontWeight={600}>
                  {formatValue(item.key, kpis[item.key])}
                </Typography>
              </Box>
            </Stack>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
