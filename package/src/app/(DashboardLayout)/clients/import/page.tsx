import { Typography } from '@mui/material';
import { getActiveMembershipOrRedirect } from '@/lib/auth/session';
import { ImportClientsView } from '../_components/ImportClientsView';

export default async function ImportClientsPage() {
  await getActiveMembershipOrRedirect();

  return (
    <>
      <Typography variant="h4" fontWeight={700} mb={1}>
        Importer des clients
      </Typography>
      <Typography variant="body1" color="text.secondary" mb={4}>
        Déposez un fichier CSV pour créer ou mettre à jour vos clients. Colonnes attendues :{' '}
        <code>name</code>, <code>email</code>, <code>phone</code>, <code>tags</code>,{' '}
        <code>status</code>.
      </Typography>
      <ImportClientsView />
    </>
  );
}
