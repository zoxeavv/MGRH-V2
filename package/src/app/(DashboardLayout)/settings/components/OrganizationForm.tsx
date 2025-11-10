'use client';

import * as React from 'react';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';

import { updateOrgProfile } from '../actions';

type OrganizationFormProps = {
  organization: {
    name: string;
    slug: string;
    logoUrl: string | null;
    primaryColor: string | null;
    secondaryColor: string | null;
  };
};

const OrganizationForm = ({ organization }: OrganizationFormProps) => {
  const [name, setName] = React.useState(organization.name);
  const [slug, setSlug] = React.useState(organization.slug);
  const [logoUrl, setLogoUrl] = React.useState(organization.logoUrl ?? '');
  const [primaryColor, setPrimaryColor] = React.useState(organization.primaryColor ?? '');
  const [secondaryColor, setSecondaryColor] = React.useState(organization.secondaryColor ?? '');
  const [pending, startTransition] = React.useTransition();
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSuccess(false);

    startTransition(async () => {
      const result = await updateOrgProfile({
        name,
        slug,
        logoUrl: logoUrl || undefined,
        primaryColor: primaryColor || undefined,
        secondaryColor: secondaryColor || undefined,
      });

      if (!result.success) {
        setError(result.error);
      } else {
        setError(null);
        setSuccess(true);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack spacing={2}>
        {error ? <Alert severity="error">{error}</Alert> : null}
        {success ? <Alert severity="success">Organization updated</Alert> : null}

        <TextField label="Name" value={name} onChange={(event) => setName(event.target.value)} required />
        <TextField label="Slug" value={slug} onChange={(event) => setSlug(event.target.value)} required />
        <TextField
          label="Logo URL"
          value={logoUrl}
          onChange={(event) => setLogoUrl(event.target.value)}
          placeholder="https://"
        />
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <TextField
            label="Primary color"
            value={primaryColor}
            onChange={(event) => setPrimaryColor(event.target.value)}
            placeholder="#5D87FF"
            sx={{ flex: 1 }}
          />
          <TextField
            label="Secondary color"
            value={secondaryColor}
            onChange={(event) => setSecondaryColor(event.target.value)}
            placeholder="#49BEFF"
            sx={{ flex: 1 }}
          />
        </Stack>

        <Stack direction="row" justifyContent="flex-end">
          <Button type="submit" variant="contained" disabled={pending}>
            {pending ? 'Saving…' : 'Save changes'}
          </Button>
        </Stack>
      </Stack>
    </form>
  );
};

export default OrganizationForm;

