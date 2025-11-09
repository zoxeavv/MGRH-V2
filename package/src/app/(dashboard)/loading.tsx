import { Box, Grid, Skeleton, Stack } from '@mui/material';

export default function DashboardLoading() {
  return (
    <Box component="section" sx={{ py: 3 }}>
      <Stack spacing={3}>
        <Skeleton variant="text" width={220} height={32} />
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Skeleton variant="rounded" height={320} animation="wave" />
          </Grid>
          <Grid item xs={12} md={4}>
            <Stack spacing={3}>
              <Skeleton variant="rounded" height={150} animation="wave" />
              <Skeleton variant="rounded" height={150} animation="wave" />
            </Stack>
          </Grid>
          <Grid item xs={12} md={4}>
            <Skeleton variant="rounded" height={280} animation="wave" />
          </Grid>
          <Grid item xs={12} md={8}>
            <Skeleton variant="rounded" height={280} animation="wave" />
          </Grid>
          <Grid item xs={12}>
            <Skeleton variant="rounded" height={220} animation="wave" />
          </Grid>
        </Grid>
      </Stack>
    </Box>
  );
}