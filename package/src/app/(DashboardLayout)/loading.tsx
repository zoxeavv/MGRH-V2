import Grid from '@mui/material/Unstable_Grid2';
import { Box, Card, CardContent, Skeleton, Stack, Typography } from '@mui/material';

export default function DashboardLoading() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <Box>
        <Skeleton variant="text" width={240} height={42} />
        <Skeleton variant="text" width={320} height={28} />
      </Box>
      <Grid container spacing={3}>
        {[...Array(4)].map((_, index) => (
          <Grid xs={12} sm={6} lg={3} key={index}>
            <Card elevation={0} sx={{ borderRadius: 3 }}>
              <CardContent>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Skeleton variant="circular" width={48} height={48} />
                  <Box>
                    <Skeleton variant="text" width={120} />
                    <Skeleton variant="text" width={80} />
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Grid container spacing={3}>
        <Grid xs={12} md={7}>
          <Card elevation={0} sx={{ borderRadius: 3 }}>
            <CardContent>
              <Skeleton variant="rectangular" height={320} sx={{ borderRadius: 2 }} />
            </CardContent>
          </Card>
        </Grid>
        <Grid xs={12} md={5}>
          <Card elevation={0} sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                <Skeleton width={160} />
              </Typography>
              {[...Array(4)].map((_, index) => (
                <Stack direction="row" spacing={2} alignItems="center" key={index} sx={{ mb: 2 }}>
                  <Skeleton variant="circular" width={40} height={40} />
                  <Box sx={{ flexGrow: 1 }}>
                    <Skeleton variant="text" width="90%" />
                    <Skeleton variant="text" width="50%" />
                  </Box>
                </Stack>
              ))}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}