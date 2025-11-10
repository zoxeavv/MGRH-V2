'use client';

import SendIcon from '@mui/icons-material/Send';
import { Alert, Avatar, Box, Button, Stack, TextField, Typography } from '@mui/material';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useOptimistic, useState, useTransition } from 'react';
import { addNote } from '../actions';

export type ClientNote = {
  id: string;
  content: string;
  createdAt: string;
  authorName: string | null;
  authorEmail: string;
};

type NotesPanelProps = {
  clientId: string;
  initialNotes: ClientNote[];
};

export function NotesPanel({ clientId, initialNotes }: NotesPanelProps) {
  const [isPending, startTransition] = useTransition();
  const [content, setContent] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [notes, addOptimisticNote] = useOptimistic(initialNotes, (state, newNote: ClientNote) => [
    newNote,
    ...state,
  ]);

  const handleSubmit = () => {
    if (!content.trim()) return;
    const optimisticNote: ClientNote = {
      id: `temp-${Date.now()}`,
      content,
      createdAt: new Date().toISOString(),
      authorName: 'Vous',
      authorEmail: '',
    };
    addOptimisticNote(optimisticNote);
    setContent('');
    setError(null);

    startTransition(async () => {
      try {
        const created = await addNote({ clientId, content: optimisticNote.content });
        addOptimisticNote({
          ...optimisticNote,
          id: created.id,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Impossible d'ajouter la note.");
      }
    });
  };

  return (
    <Stack spacing={3}>
      {error ? <Alert severity="error">{error}</Alert> : null}
      <Stack spacing={2}>
        <TextField
          label="Nouvelle note"
          placeholder="Résumer un appel, une discussion, un contexte..."
          value={content}
          onChange={(event) => setContent(event.target.value)}
          multiline
          minRows={3}
        />
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button variant="contained" endIcon={<SendIcon />} onClick={handleSubmit} disabled={isPending}>
            Ajouter
          </Button>
        </Box>
      </Stack>
      <Stack spacing={2}>
        {notes.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            Aucune note pour le moment.
          </Typography>
        ) : (
          notes.map((note) => (
            <Stack
              key={note.id}
              direction="row"
              spacing={2}
              alignItems="flex-start"
              sx={{
                p: 2,
                borderRadius: 2,
                border: (theme) => `1px solid ${theme.palette.divider}`,
                bgcolor: 'background.paper',
              }}
            >
              <Avatar sx={{ width: 36, height: 36 }}>
                {note.authorName?.[0]?.toUpperCase() ?? note.authorEmail?.[0]?.toUpperCase() ?? '?'}
              </Avatar>
              <Box>
                <Typography variant="subtitle2">{note.authorName ?? note.authorEmail ?? 'Utilisateur'}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {formatDistanceToNow(new Date(note.createdAt), { addSuffix: true, locale: fr })}
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {note.content}
                </Typography>
              </Box>
            </Stack>
          ))
        )}
      </Stack>
    </Stack>
  );
}
