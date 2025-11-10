'use client';

import { Alert, Button, Stack, TextField } from '@mui/material';
import { useState, useTransition } from 'react';
import { updateOrgProfile } from '../actions';

type OrganizationFormProps = {
  organization: {
    name: string;
    slug: string;
    logoUrl: string | null;
  };
};

export function OrganizationForm({ organization }: OrganizationFormProps) {
  const [name, setName] = useState(organization.name);
  const [slug, setSlug] = useState(organization.slug);
  const [logoUrl, setLogoUrl] = useState(organization.logoUrl ?? '');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = () => {
    setError(null);
    setSuccess(null);
    startTransition(async () => {
      try {
        await updateOrgProfile({
          name,
          slug,
          logoUrl: logoUrl || undefined,
        });
        setSuccess('Organisation mise à jour.');
      } catch (err) {
        setError(err instanceof Error ? err.message : "Impossible de mettre à jour l'organisation.");
      }
    });
  };

  return (
    <Stack spacing={2}>
      {error ? <Alert severity="error">{error}</Alert> : null}
      {success ? <Alert severity="success">{success}</Alert> : null}
      <TextField label="Nom" value={name} onChange={(event) => setName(event.target.value)} required />
      <TextField label="Slug" value={slug} onChange={(event) => setSlug(event.target.value)} required />
      <TextField label="Logo (URL)" value={logoUrl} onChange={(event) => setLogoUrl(event.target.value)} />
      <Button variant="contained" onClick={handleSubmit} disabled={isPending}>
        Sauvegarder
      </Button>
    </Stack>
  );
}
