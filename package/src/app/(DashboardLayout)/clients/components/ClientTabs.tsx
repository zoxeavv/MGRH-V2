'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Alert from '@mui/material/Alert';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import { IconCheck, IconList } from '@tabler/icons-react';

import StatusChip from '@/components/StatusChip';
import { addNote, addTask, updateTaskStatus } from '../actions';
import { taskStatusValues } from '@/lib/validation/clients';

type ClientTabsProps = {
  clientId: string;
  notes: Array<{
    id: string;
    content: string;
    createdAt: string;
    updatedAt: string;
    author: {
      id: string;
      name: string;
      email: string;
    };
  }>;
  tasks: Array<{
    id: string;
    title: string;
    description: string;
    status: string;
    dueDate: string | null;
    createdAt: string;
    updatedAt: string;
    author: string;
    assignee: string;
  }>;
  offers: Array<{
    id: string;
    title: string;
    summary: string;
    isPublished: boolean;
    versionNumber: number;
    updatedAt: string;
  }>;
};

const ClientTabs = ({ clientId, notes, tasks, offers }: ClientTabsProps) => {
  const [value, setValue] = React.useState(0);

  return (
    <Box>
      <Tabs
        value={value}
        onChange={(_, next) => setValue(next)}
        variant="scrollable"
        allowScrollButtonsMobile
        sx={{ borderBottom: 1, borderColor: 'divider' }}
      >
        <Tab label="Notes" />
        <Tab label="Tasks" />
        <Tab label="Offers" />
      </Tabs>

      <Box sx={{ mt: 3 }}>
        {value === 0 ? <NotesPanel clientId={clientId} initialNotes={notes} /> : null}
        {value === 1 ? <TasksPanel clientId={clientId} initialTasks={tasks} /> : null}
        {value === 2 ? <OffersPanel offers={offers} /> : null}
      </Box>
    </Box>
  );
};

const NotesPanel = ({
  clientId,
  initialNotes,
}: {
  clientId: string;
  initialNotes: ClientTabsProps['notes'];
}) => {
  const [notes, setNotes] = React.useState(initialNotes);
  const [content, setContent] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);
  const [isPending, startTransition] = React.useTransition();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!content.trim()) return;

    const optimisticNote = {
      id: `temp-${Date.now()}`,
      content,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      author: {
        id: '',
        name: 'You',
        email: '',
      },
    };

    setNotes((prev) => [optimisticNote, ...prev]);
    setContent('');
    setError(null);

    startTransition(async () => {
      const result = await addNote({ clientId, content: optimisticNote.content });
      if (!result.success) {
        setError(result.error);
        setNotes((prev) => prev.filter((note) => note.id !== optimisticNote.id));
      }
    });
  };

  return (
    <Stack spacing={3}>
      <Paper variant="outlined" sx={{ p: 3 }}>
        <form onSubmit={handleSubmit}>
          <Stack spacing={2}>
            {error ? <Alert severity="error">{error}</Alert> : null}
            <TextField
              value={content}
              onChange={(event) => setContent(event.target.value)}
              placeholder="Add an internal note..."
              multiline
              minRows={3}
            />
            <Button type="submit" variant="contained" disabled={isPending}>
              {isPending ? 'Saving…' : 'Save note'}
            </Button>
          </Stack>
        </form>
      </Paper>

      <Stack spacing={2}>
        {notes.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            No notes yet.
          </Typography>
        ) : (
          notes.map((note) => (
            <Paper key={note.id} variant="outlined" sx={{ p: 2 }}>
              <Stack spacing={1}>
                <Typography variant="body2">{note.content}</Typography>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Chip size="small" label={note.author.name} variant="outlined" />
                  <Typography variant="caption" color="text.secondary">
                    {new Intl.DateTimeFormat('en', {
                      dateStyle: 'medium',
                      timeStyle: 'short',
                    }).format(new Date(note.createdAt))}
                  </Typography>
                </Stack>
              </Stack>
            </Paper>
          ))
        )}
      </Stack>
    </Stack>
  );
};

type TaskColumns = Record<
  (typeof taskStatusValues)[number],
  Array<{
    id: string;
    title: string;
    description: string;
    status: string;
    dueDate: string | null;
    author: string;
    assignee: string;
  }>
>;

const groupTasksByStatus = (tasks: ClientTabsProps['tasks']): TaskColumns => {
  return tasks.reduce<TaskColumns>(
    (acc, task) => {
      acc[task.status as keyof TaskColumns].push(task);
      return acc;
    },
    {
      todo: [],
      in_progress: [],
      done: [],
    },
  );
};

const TasksPanel = ({
  clientId,
  initialTasks,
}: {
  clientId: string;
  initialTasks: ClientTabsProps['tasks'];
}) => {
  const [columns, setColumns] = React.useState(() => groupTasksByStatus(initialTasks));
  const [draggingTask, setDraggingTask] = React.useState<{ id: string; from: string } | null>(null);
  const [title, setTitle] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);
  const [isPending, startTransition] = React.useTransition();

  React.useEffect(() => {
    setColumns(groupTasksByStatus(initialTasks));
  }, [initialTasks]);

  const handleTaskSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!title.trim()) return;

    const optimisticTask = {
      id: `temp-${Date.now()}`,
      title,
      description: '',
      status: 'todo',
      dueDate: null,
      author: 'You',
      assignee: '',
    };

    setColumns((prev) => ({
      ...prev,
      todo: [optimisticTask, ...prev.todo],
    }));
    setTitle('');

    startTransition(async () => {
      const result = await addTask({ clientId, title: optimisticTask.title });
      if (!result.success) {
        setError(result.error);
        setColumns((prev) => ({
          ...prev,
          todo: prev.todo.filter((task) => task.id !== optimisticTask.id),
        }));
      } else {
        setError(null);
      }
    });
  };

  const handleDragStart = (taskId: string, from: string) => {
    setDraggingTask({ id: taskId, from });
  };

  const handleDrop = (toStatus: string) => {
    if (!draggingTask) return;
    if (draggingTask.from === toStatus) {
      setDraggingTask(null);
      return;
    }

    const task = columns[draggingTask.from as keyof TaskColumns].find((t) => t.id === draggingTask.id);
    if (!task) return;

    setColumns((prev) => {
      const next = { ...prev };
      next[draggingTask.from as keyof TaskColumns] = next[
        draggingTask.from as keyof TaskColumns
      ].filter((t) => t.id !== draggingTask.id);
      next[toStatus as keyof TaskColumns] = [{ ...task, status: toStatus }, ...next[toStatus as keyof TaskColumns]];
      return next;
    });

    setDraggingTask(null);

    startTransition(async () => {
      const result = await updateTaskStatus({ taskId: task.id, status: toStatus });
      if (!result.success) {
        setColumns((prev) => {
          const next = { ...prev };
          next[toStatus as keyof TaskColumns] = next[toStatus as keyof TaskColumns].filter((t) => t.id !== task.id);
          next[draggingTask.from as keyof TaskColumns] = [{ ...task }, ...next[draggingTask.from as keyof TaskColumns]];
          return next;
        });
      }
    });
  };

  return (
    <Stack spacing={3}>
      <Paper variant="outlined" sx={{ p: 3 }}>
        <form onSubmit={handleTaskSubmit}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              label="Task title"
              required
              sx={{ flex: 1 }}
            />
            <Button type="submit" variant="contained" disabled={isPending}>
              Add task
            </Button>
          </Stack>
        </form>
        {error ? (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        ) : null}
      </Paper>

      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
        {taskStatusValues.map((status) => (
          <TaskColumn
            key={status}
            status={status}
            tasks={columns[status]}
            onDrop={() => handleDrop(status)}
            onDragStart={handleDragStart}
          />
        ))}
      </Stack>
    </Stack>
  );
};

const TaskColumn = ({
  status,
  tasks,
  onDrop,
  onDragStart,
}: {
  status: string;
  tasks: TaskColumns[(typeof taskStatusValues)[number]];
  onDrop: () => void;
  onDragStart: (taskId: string, from: string) => void;
}) => {
  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  return (
    <Paper
      variant="outlined"
      sx={{ flex: 1, minHeight: 280, p: 2, bgcolor: 'grey.50' }}
      onDragOver={handleDragOver}
      onDrop={onDrop}
    >
      <Stack spacing={1.5}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Typography variant="subtitle2" fontWeight={600}>
            {status.replace('_', ' ').toUpperCase()}
          </Typography>
          <Chip size="small" label={tasks.length} />
        </Stack>

        {tasks.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            Drag tasks here
          </Typography>
        ) : (
          tasks.map((task) => (
            <Paper
              key={task.id}
              draggable
              onDragStart={() => onDragStart(task.id, status)}
              sx={{ p: 2, cursor: 'grab' }}
              variant="outlined"
            >
              <Stack spacing={1}>
                <Typography variant="subtitle2" fontWeight={600}>
                  {task.title}
                </Typography>
                {task.description ? (
                  <Typography variant="body2" color="text.secondary">
                    {task.description}
                  </Typography>
                ) : null}
                <Stack direction="row" spacing={1} alignItems="center">
                  <IconList size={16} stroke={1.6} />
                  <Typography variant="caption" color="text.secondary">
                    {task.author}
                  </Typography>
                </Stack>
                {task.dueDate ? (
                  <Stack direction="row" spacing={1} alignItems="center">
                    <IconCheck size={16} stroke={1.6} />
                    <Typography variant="caption" color="text.secondary">
                      Due{' '}
                      {new Intl.DateTimeFormat('en', {
                        dateStyle: 'medium',
                      }).format(new Date(task.dueDate))}
                    </Typography>
                  </Stack>
                ) : null}
              </Stack>
            </Paper>
          ))
        )}
      </Stack>
    </Paper>
  );
};

const OffersPanel = ({ offers }: { offers: ClientTabsProps['offers'] }) => {
  if (offers.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary">
        No offers yet.
      </Typography>
    );
  }

  return (
    <Stack spacing={2}>
      {offers.map((offer) => (
        <Paper key={offer.id} variant="outlined" sx={{ p: 2 }}>
          <Stack spacing={1.5}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="subtitle1" fontWeight={600}>
                {offer.title}
              </Typography>
              <StatusChip context="offer" status={offer.isPublished ? 'published' : 'draft'} />
            </Stack>
            <Typography variant="body2" color="text.secondary">
              {offer.summary || 'No summary provided.'}
            </Typography>
            <Divider />
            <Stack direction="row" spacing={2}>
              <Chip label={`Version ${offer.versionNumber}`} size="small" variant="outlined" />
              <Typography variant="caption" color="text.secondary">
                Updated{' '}
                {new Intl.DateTimeFormat('en', {
                  dateStyle: 'medium',
                  timeStyle: 'short',
                }).format(new Date(offer.updatedAt))}
              </Typography>
            </Stack>
          </Stack>
        </Paper>
      ))}
    </Stack>
  );
};

export default ClientTabs;

