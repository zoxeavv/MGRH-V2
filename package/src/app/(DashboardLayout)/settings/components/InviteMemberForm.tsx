'use client';

import * as React from 'react';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';

import { inviteMember } from '../actions';

const InviteMemberForm = () => {
  const [email, setEmail] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);
  const [pending, startTransition] = React.useTransition();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    startTransition(async () => {
      const result = await inviteMember({ email });
      if (!result.success) {
        setError(result.error);
      } else {
        setSuccess(`Invitation sent to ${email}`);
        setEmail('');
      }
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ xs: 'stretch', sm: 'center' }}>
        <TextField
          type="email"
          label="Invite member by email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
          sx={{ flex: 1 }}
        />
        <Button type="submit" variant="contained" disabled={pending}>
          {pending ? 'Sending…' : 'Send invite'}
        </Button>
      </Stack>
      {error ? <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert> : null}
      {success ? <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert> : null}
    </form>
  );
};

export default InviteMemberForm;
