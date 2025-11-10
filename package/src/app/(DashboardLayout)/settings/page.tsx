import Grid from '@mui/material/Unstable_Grid2';
import { Stack, Typography } from '@mui/material';
import { getActiveMembershipOrRedirect } from '@/lib/auth/session';
import { getOrganizationProfile, listOrganizationMembers } from '@/lib/db/queries/settings';
import { OrganizationForm } from './_components/OrganizationForm';
import { InviteMemberForm } from './_components/InviteMemberForm';
import { MembersTable } from './_components/MembersTable';
import { ApiKeysCard } from './_components/ApiKeysCard';

export default async function SettingsPage() {
  const { membership } = await getActiveMembershipOrRedirect();

  const organization = await getOrganizationProfile(membership.organization_id);
  const members = await listOrganizationMembers(membership.organization_id);

  if (!organization) {
    throw new Error('Organisation introuvable');
  }

  return (
    <Stack spacing={4}>
      <Typography variant="h4" fontWeight={700}>
        Paramètres
      </Typography>
      <Grid container spacing={3}>
        <Grid xs={12} md={6}>
          <OrganizationForm organization={organization} />
        </Grid>
        <Grid xs={12} md={6}>
          <InviteMemberForm />
        </Grid>
        <Grid xs={12} md={8}>
          <MembersTable
            members={members.map((member) => ({
              id: member.id,
              role: member.role,
              status: member.status,
              profileName: member.profileName,
              profileEmail: member.profileEmail,
              avatarUrl: member.avatarUrl,
            }))}
          />
        </Grid>
        <Grid xs={12} md={4}>
          <ApiKeysCard />
        </Grid>
      </Grid>
    </Stack>
  );
}
