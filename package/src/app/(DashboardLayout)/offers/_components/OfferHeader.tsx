'use client';

import { Alert, Chip, Stack, Switch, Typography } from '@mui/material';
import { useState, useTransition } from 'react';
import { publishOffer } from '../actions';

type OfferHeaderProps = {
  offerId: string;
  title: string;
  clientName?: string | null;
  isPublished: boolean;
};

export function OfferHeader({ offerId, title, clientName, isPublished }: OfferHeaderProps) {
  const [published, setPublished] = useState(isPublished);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
    const next = event.target.checked;
    setPublished(next);
    setError(null);
    startTransition(async () => {
      try {
        await publishOffer({ offerId, isPublished: next });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Impossible de mettre à jour le statut.');
        setPublished(!next);
      }
    });
  };

  return (
    <Stack spacing={1}>
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ md: 'center' }}>
        <Typography variant="h4" fontWeight={700}>
          {title}
        </Typography>
        <Chip label={clientName ?? 'Client inconnu'} variant="outlined" />
      </Stack>
      <Stack direction="row" spacing={1} alignItems="center">
        <Switch checked={published} onChange={handleToggle} disabled={isPending} />
        <Typography variant="body2">{published ? 'Publié' : 'Brouillon'}</Typography>
      </Stack>
      {error ? <Alert severity="error">{error}</Alert> : null}
    </Stack>
  );
}
