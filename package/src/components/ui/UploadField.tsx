'use client';

import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { Alert, Button, Stack, TextField } from '@mui/material';
import { useState, useTransition } from 'react';

type UploadFieldProps = {
  label?: string;
  placeholder?: string;
  onSubmit: (input: { url: string; type: string }) => Promise<void>;
};

export function UploadField({ label = 'Ajouter une ressource', placeholder, onSubmit }: UploadFieldProps) {
  const [url, setUrl] = useState('');
  const [type, setType] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = () => {
    if (!url.trim()) {
      setError('L’URL est requise');
      return;
    }
    if (!type.trim()) {
      setError('Le type est requis (image, pdf, etc.)');
      return;
    }

    setError(null);
    startTransition(async () => {
      try {
        await onSubmit({ url, type });
        setUrl('');
        setType('');
      } catch (err) {
        setError(err instanceof Error ? err.message : "Impossible d'ajouter la ressource.");
      }
    });
  };

  return (
    <Stack spacing={2}>
      <TextField label={label} placeholder={placeholder} value={url} onChange={(event) => setUrl(event.target.value)} />
      <TextField
        label="Type de ressource"
        placeholder="image/png, pdf..."
        value={type}
        onChange={(event) => setType(event.target.value)}
      />
      {error ? <Alert severity="error">{error}</Alert> : null}
      <Button
        variant="outlined"
        startIcon={<CloudUploadIcon />}
        onClick={handleSubmit}
        disabled={isPending}
        sx={{ alignSelf: 'flex-start' }}
      >
        Joindre
      </Button>
    </Stack>
  );
}
