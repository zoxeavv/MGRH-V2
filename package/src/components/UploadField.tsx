'use client';

import * as React from 'react';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

type UploadFieldProps = {
  label?: string;
  onUpload: (url: string) => Promise<void> | void;
  placeholder?: string;
  buttonLabel?: string;
};

const UploadField = ({
  label = 'Asset URL',
  onUpload,
  placeholder = 'https://',
  buttonLabel = 'Attach',
}: UploadFieldProps) => {
  const [value, setValue] = React.useState('');
  const [isPending, startTransition] = React.useTransition();
  const [error, setError] = React.useState<string | null>(null);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const url = value.trim();
    if (!url) return;

    setError(null);
    startTransition(async () => {
      try {
        await onUpload(url);
        setValue('');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unable to attach asset');
      }
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack spacing={1}>
        <TextField
          label={label}
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder={placeholder}
          error={Boolean(error)}
          helperText={error}
        />
        <Button type="submit" variant="outlined" disabled={isPending || !value.trim()}>
          {isPending ? 'Attaching…' : buttonLabel}
        </Button>
      </Stack>
    </form>
  );
};

export default UploadField;

