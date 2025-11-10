import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Link from 'next/link';

import RegisterForm from '../components/RegisterForm';

const RegisterPage = () => (
  <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <Grid container justifyContent="center">
      <Grid item xs={12} sm={8} md={4}>
        <Card elevation={6} sx={{ p: 4 }}>
          <Stack spacing={3}>
            <Stack spacing={0.5}>
              <Typography variant="h4" fontWeight={700}>
                Create your account
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Start building offers and templates for your team.
              </Typography>
            </Stack>

            <RegisterForm />

            <Typography variant="body2" textAlign="center">
              Already have an account?{' '}
              <Link href="/authentication/login">Sign in</Link>
            </Typography>
          </Stack>
        </Card>
      </Grid>
    </Grid>
  </Box>
);

export default RegisterPage;
