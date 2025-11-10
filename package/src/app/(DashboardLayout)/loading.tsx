import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';

const DashboardLoading = () => (
  <Stack spacing={3}>
    <Stack spacing={1}>
      <Skeleton variant="text" width={240} height={36} />
      <Skeleton variant="text" width={320} height={24} />
    </Stack>

    <Grid container spacing={2}>
      {Array.from({ length: 4 }).map((_, index) => (
        <Grid xs={12} sm={6} md={3} key={`kpi-skeleton-fallback-${index}`}>
          <Skeleton variant="rounded" height={120} />
        </Grid>
      ))}
    </Grid>

    <Grid container spacing={3}>
      <Grid xs={12} md={8}>
        <Skeleton variant="rounded" height={360} />
      </Grid>
      <Grid xs={12} md={4}>
        <Skeleton variant="rounded" height={360} />
      </Grid>
    </Grid>
  </Stack>
);

export default DashboardLoading;