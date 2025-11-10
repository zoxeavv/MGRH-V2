'use client';

import { Alert, Button, MenuItem, Stack, TextField } from '@mui/material';
import { useState, useTransition } from 'react';
import { inviteMember } from '../actions';

export function InviteMemberForm() {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'owner' | 'admin' | 'user'>('user');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = () => {
    setError(null);
    setSuccess(null);
    startTransition(async () => {
      try {
        await inviteMember({ email, role });
        setSuccess('Invitation envoyée.');
        setEmail('');
        setRole('user');
      } catch (err) {
        setError(err instanceof Error ? err.message : "Impossible d'envoyer l'invitation.");
      }
    });
  };

  return (
    <Stack spacing={2}>
      {error ? <Alert severity="error">{error}</Alert> : null}
      {success ? <Alert severity="success">{success}</Alert> : null}
      <TextField label="Email" value={email} onChange={(event) => setEmail(event.target.value)} />
      <TextField select label="Rôle" value={role} onChange={(event) => setRole(event.target.value as typeof role)}>
        <MenuItem value="owner">Propriétaire</MenuItem>
        <MenuItem value="admin">Admin</MenuItem>
        <MenuItem value="user">Utilisateur</MenuItem>
      </TextField>
      <Button variant="outlined" onClick={handleSubmit} disabled={isPending}>
        Inviter
      </Button>
    </Stack>
  );
}
