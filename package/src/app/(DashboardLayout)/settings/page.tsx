import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';

import { getActiveMembershipOrRedirect } from '@/lib/auth/session';
import { getOrganizationSettings } from '@/lib/db/queries/settings';

import OrganizationForm from './components/OrganizationForm';
import InviteMemberForm from './components/InviteMemberForm';
import MembersTable from './components/MembersTable';

const SettingsPage = async () => {
  const { organization } = await getActiveMembershipOrRedirect();
  const settings = await getOrganizationSettings(organization.id);

  if (!settings) {
    return null;
  }

  return (
    <Stack spacing={3}>
      <Typography variant="h4" fontWeight={700}>
        Organization settings
      </Typography>

      <Paper variant="outlined" sx={{ p: 3 }}>
        <OrganizationForm organization={settings.organization} />
      </Paper>

      <Paper variant="outlined" sx={{ p: 3 }}>
        <Stack spacing={2}>
          <Typography variant="h6" fontWeight={600}>
            Invite members
          </Typography>
          <InviteMemberForm />
        </Stack>
      </Paper>

      <MembersTable
        members={settings.members.map((member) => ({
          ...member,
          createdAt: new Date(member.createdAt),
        }))}
      />

      <Paper variant="outlined" sx={{ p: 3 }}>
        <Stack spacing={1}>
          <Typography variant="h6" fontWeight={600}>
            API keys
          </Typography>
          <Typography variant="body2" color="text.secondary">
            API keys for external integrations are coming soon. Contact support if you need early access.
          </Typography>
        </Stack>
      </Paper>
    </Stack>
  );
};

export default SettingsPage;
