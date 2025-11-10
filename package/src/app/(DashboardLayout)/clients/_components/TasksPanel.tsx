'use client';

import AddTaskIcon from '@mui/icons-material/AddTask';
import { Alert, Box, Button, Paper, Stack, TextField, Typography } from '@mui/material';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useOptimistic, useState, useTransition } from 'react';
import { addTask, updateTaskStatus } from '../actions';

export type ClientTask = {
  id: string;
  title: string;
  description: string | null;
  status: 'todo' | 'in_progress' | 'done';
  dueDate: string | null;
};

type TasksPanelProps = {
  clientId: string;
  initialTasks: ClientTask[];
};

const columns = [
  { status: 'todo', label: 'À faire' },
  { status: 'in_progress', label: 'En cours' },
  { status: 'done', label: 'Terminé' },
] as const;

export function TasksPanel({ clientId, initialTasks }: TasksPanelProps) {
  const [tasks, updateOptimisticTask] = useOptimistic(
    initialTasks,
    (state, update: { type: 'update'; taskId: string; status: ClientTask['status'] } | { type: 'add'; task: ClientTask }) => {
      if (update.type === 'update') {
        return state.map((task) => (task.id === update.taskId ? { ...task, status: update.status } : task));
      }
      if (update.type === 'add') {
        return [update.task, ...state];
      }
      return state;
    },
  );

  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleDrop = (status: ClientTask['status']) => (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const taskId = event.dataTransfer.getData('text/plain');
    if (!taskId) return;

    updateOptimisticTask({ type: 'update', taskId, status });
    startTransition(async () => {
      await updateTaskStatus({ taskId, status });
    });
  };

  const handleDragStart = (taskId: string) => (event: React.DragEvent<HTMLDivElement>) => {
    event.dataTransfer.setData('text/plain', taskId);
    event.dataTransfer.effectAllowed = 'move';
  };

  const handleAddTask = () => {
    if (!title.trim()) {
      setFormError('Le titre est requis');
      return;
    }
    setFormError(null);

    const optimisticTask: ClientTask = {
      id: `temp-${Date.now()}`,
      title,
      description: null,
      status: 'todo',
      dueDate: dueDate ? new Date(dueDate).toISOString() : null,
    };

    updateOptimisticTask({ type: 'add', task: optimisticTask });
    setTitle('');
    setDueDate('');

    startTransition(async () => {
      try {
        await addTask({
          clientId,
          title: optimisticTask.title,
          dueDate: optimisticTask.dueDate ?? undefined,
        });
      } catch (err) {
        setFormError(err instanceof Error ? err.message : "Impossible d'ajouter la tâche.");
      }
    });
  };

  return (
    <Stack spacing={3}>
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
        <TextField
          label="Titre"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          fullWidth
          placeholder="Relancer le client..."
        />
        <TextField
          label="Échéance"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={dueDate}
          onChange={(event) => setDueDate(event.target.value)}
          sx={{ minWidth: 200 }}
        />
        <Button
          variant="contained"
          startIcon={<AddTaskIcon />}
          onClick={handleAddTask}
          disabled={isPending}
          sx={{ alignSelf: { xs: 'stretch', md: 'center' } }}
        >
          Ajouter
        </Button>
      </Stack>
      {formError ? <Alert severity="error">{formError}</Alert> : null}
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="stretch">
        {columns.map((column) => (
          <Paper
            key={column.status}
            variant="outlined"
            sx={{
              flex: 1,
              borderRadius: 3,
              minHeight: 260,
              p: 2,
              bgcolor: 'grey.50',
            }}
            onDragOver={(event) => event.preventDefault()}
            onDrop={handleDrop(column.status)}
          >
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2, fontWeight: 600 }}>
              {column.label}
            </Typography>
            <Stack spacing={1.5}>
              {tasks.filter((task) => task.status === column.status).length === 0 ? (
                <Typography variant="caption" color="text.secondary">
                  Faites glisser une tâche ici.
                </Typography>
              ) : (
                tasks
                  .filter((task) => task.status === column.status)
                  .map((task) => (
                    <Box
                      key={task.id}
                      draggable
                      onDragStart={handleDragStart(task.id)}
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        bgcolor: 'background.paper',
                        border: (theme) => `1px solid ${theme.palette.divider}`,
                        cursor: 'grab',
                      }}
                    >
                      <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                        {task.title}
                      </Typography>
                      {task.dueDate ? (
                        <Typography variant="caption" color="text.secondary">
                          Échéance:{' '}
                          {format(new Date(task.dueDate), 'dd MMM yyyy', {
                            locale: fr,
                          })}
                        </Typography>
                      ) : null}
                    </Box>
                  ))
              )}
            </Stack>
          </Paper>
        ))}
      </Stack>
    </Stack>
  );
}
