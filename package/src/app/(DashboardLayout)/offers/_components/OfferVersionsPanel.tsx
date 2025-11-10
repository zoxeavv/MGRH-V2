'use client';

import { Alert, Button, List, ListItem, ListItemText, Stack, Typography } from '@mui/material';
import { useState, useTransition } from 'react';
import { duplicateVersion } from '../actions';

type OfferVersionsPanelProps = {
  offerId: string;
  versions: Array<{
    id: string;
    versionNumber: number;
    title: string;
    summary: string | null;
    createdAt: string;
  }>;
};

export function OfferVersionsPanel({ offerId, versions }: OfferVersionsPanelProps) {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleDuplicate = () => {
    setError(null);
    startTransition(async () => {
      try {
        await duplicateVersion({ offerId });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Impossible de dupliquer la version.');
      }
    });
  };

  return (
    <Stack spacing={2}>
      <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
        <Typography variant="h6">Versions</Typography>
        <Button variant="outlined" onClick={handleDuplicate} disabled={isPending}>
          Dupliquer la version courante
        </Button>
      </Stack>
      {error ? <Alert severity="error">{error}</Alert> : null}
      <List>
        {versions.map((version) => (
          <ListItem key={version.id} disableGutters>
            <ListItemText
              primary={`v${version.versionNumber} • ${version.title}`}
              secondary={
                <>
                  <Typography component="span" variant="body2" color="text.secondary">
                    {version.summary ?? '—'}
                  </Typography>
                  <Typography component="span" variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                    Créée le{' '}
                    {new Intl.DateTimeFormat('fr-FR', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    }).format(new Date(version.createdAt))}
                  </Typography>
                </>
              }
            />
          </ListItem>
        ))}
      </List>
    </Stack>
  );
}
