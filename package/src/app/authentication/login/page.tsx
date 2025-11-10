import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Link from 'next/link';

import LoginForm from '../components/LoginForm';

const LoginPage = () => {
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Grid container justifyContent="center">
        <Grid item xs={12} sm={8} md={4}>
          <Card elevation={6} sx={{ p: 4 }}>
            <Stack spacing={3}>
              <Stack spacing={0.5}>
                <Typography variant="h4" fontWeight={700}>
                  Welcome back
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Sign in to continue to your dashboard.
                </Typography>
              </Stack>

              <LoginForm />

              <Typography variant="body2" textAlign="center">
                New to the platform?{' '}
                <Link href="/authentication/register">
                  Create an account
                </Link>
              </Typography>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default LoginPage;
