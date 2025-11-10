'use client';

import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Box, Tab } from '@mui/material';
import { useState } from 'react';
import type { ClientNote } from './NotesPanel';
import type { ClientTask } from './TasksPanel';
import type { ClientOffer } from './OffersPanel';
import { NotesPanel } from './NotesPanel';
import { TasksPanel } from './TasksPanel';
import { OffersPanel } from './OffersPanel';

type ClientDetailTabsProps = {
  clientId: string;
  notes: ClientNote[];
  tasks: ClientTask[];
  offers: ClientOffer[];
};

export function ClientDetailTabs({ clientId, notes, tasks, offers }: ClientDetailTabsProps) {
  const [tab, setTab] = useState('notes');

  return (
    <TabContext value={tab}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <TabList onChange={(_, value) => setTab(value)} variant="scrollable" scrollButtons="auto">
          <Tab label="Notes" value="notes" />
          <Tab label={`Tâches (${tasks.length})`} value="tasks" />
          <Tab label={`Offres (${offers.length})`} value="offers" />
        </TabList>
      </Box>
      <TabPanel value="notes" sx={{ px: 0 }}>
        <NotesPanel clientId={clientId} initialNotes={notes} />
      </TabPanel>
      <TabPanel value="tasks" sx={{ px: 0 }}>
        <TasksPanel clientId={clientId} initialTasks={tasks} />
      </TabPanel>
      <TabPanel value="offers" sx={{ px: 0 }}>
        <OffersPanel offers={offers} />
      </TabPanel>
    </TabContext>
  );
}
