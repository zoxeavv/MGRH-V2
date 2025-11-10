'use client';

import { Button, Paper, Stack, Typography } from '@mui/material';

export function ApiKeysCard() {
  return (
    <Paper variant="outlined" sx={{ borderRadius: 3, p: 3 }}>
      <Stack spacing={2}>
        <Typography variant="h6">Clés API</Typography>
        <Typography variant="body2" color="text.secondary">
          Les clés API seront bientôt disponibles. Utilisez le service role Supabase pour les intégrations internes.
        </Typography>
        <Button variant="outlined" disabled>
          Générer une clé
        </Button>
      </Stack>
    </Paper>
  );
}
