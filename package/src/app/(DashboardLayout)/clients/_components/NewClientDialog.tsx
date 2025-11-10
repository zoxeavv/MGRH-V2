'use client';

import AddIcon from '@mui/icons-material/Add';
import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, Stack, TextField } from '@mui/material';
import { useState, useTransition } from 'react';
import { createClient } from '../actions';

const statusOptions = [
  { value: 'lead', label: 'Lead' },
  { value: 'active', label: 'Actif' },
  { value: 'inactive', label: 'Inactif' },
  { value: 'archived', label: 'Archivé' },
];

export function NewClientDialog() {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('lead');
  const [tags, setTags] = useState('');

  const resetForm = () => {
    setName('');
    setDescription('');
    setStatus('lead');
    setTags('');
    setError(null);
  };

  const handleSubmit = () => {
    startTransition(async () => {
      try {
        await createClient({
          name,
          description: description || undefined,
          status: status as 'lead' | 'active' | 'inactive' | 'archived',
          tags: tags
            .split(',')
            .map((tag) => tag.trim())
            .filter(Boolean),
        });
        resetForm();
        setOpen(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Impossible de créer le client.');
      }
    });
  };

  return (
    <>
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={() => setOpen(true)}
        sx={{ alignSelf: { xs: 'stretch', md: 'center' } }}
      >
        Nouveau client
      </Button>
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Créer un client</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2}>
            {error ? <Alert severity="error">{error}</Alert> : null}
            <TextField
              label="Nom"
              required
              value={name}
              onChange={(event) => setName(event.target.value)}
              autoFocus
            />
            <TextField
              label="Description"
              multiline
              minRows={3}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
            />
            <TextField
              select
              label="Statut"
              value={status}
              onChange={(event) => setStatus(event.target.value)}
            >
              {statusOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Tags (séparés par des virgules)"
              value={tags}
              onChange={(event) => setTags(event.target.value)}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} disabled={isPending}>
            Annuler
          </Button>
          <Button onClick={handleSubmit} variant="contained" disabled={isPending || !name.trim()}>
            Créer
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
