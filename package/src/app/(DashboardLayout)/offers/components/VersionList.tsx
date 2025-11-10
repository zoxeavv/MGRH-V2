'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Chip from '@mui/material/Chip';

import { duplicateVersion } from '../actions';

type VersionListProps = {
  offerId: string;
  currentVersionId: string;
  versions: Array<{
    id: string;
    versionNumber: number;
    title: string;
    summary: string | null;
    createdAt: Date;
  }>;
};

const VersionList = ({ offerId, currentVersionId, versions }: VersionListProps) => {
  const router = useRouter();
  const [pending, startTransition] = React.useTransition();

  const handleDuplicate = () => {
    startTransition(async () => {
      const result = await duplicateVersion({ offerId });
      if (result.success) {
        router.refresh();
      }
    });
  };

  return (
    <Paper variant="outlined" sx={{ p: 3 }}>
      <Stack spacing={2}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} alignItems="center">
          <Typography variant="h6" fontWeight={600}>
            Versions
          </Typography>
          <Button variant="outlined" onClick={handleDuplicate} disabled={pending} sx={{ ml: 'auto' }}>
            {pending ? 'Duplicating…' : 'Duplicate current version'}
          </Button>
        </Stack>
        <List dense>
          {versions.map((version) => (
            <ListItem key={version.id}>
              <ListItemText
                primary={`Version ${version.versionNumber}: ${version.title}`}
                secondary={
                  <Typography variant="caption" color="text.secondary">
                    {new Intl.DateTimeFormat('en', {
                      dateStyle: 'medium',
                      timeStyle: 'short',
                    }).format(version.createdAt)}
                  </Typography>
                }
              />
              {version.id === currentVersionId ? <Chip label="Current" size="small" color="primary" /> : null}
            </ListItem>
          ))}
        </List>
      </Stack>
    </Paper>
  );
};

export default VersionList;
