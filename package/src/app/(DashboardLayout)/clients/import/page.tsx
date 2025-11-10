import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';

import ImportClientForm from '../components/ImportClientForm';

const ClientImportPage = () => {
  return (
    <Stack spacing={3}>
      <Stack spacing={0.5}>
        <Typography variant="h4" fontWeight={700}>
          Import clients
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Upload a CSV with your client information. Duplicate names or emails will be merged.
        </Typography>
      </Stack>

      <Paper variant="outlined" sx={{ p: 3 }}>
        <Typography variant="subtitle2" gutterBottom>
          CSV format
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Required columns: <strong>name</strong>. Optional: <strong>email</strong>, <strong>phone</strong>,{' '}
          <strong>tags</strong> (comma separated), <strong>status</strong> (lead, active, inactive, archived).
        </Typography>
      </Paper>

      <ImportClientForm />
    </Stack>
  );
};

export default ClientImportPage;
