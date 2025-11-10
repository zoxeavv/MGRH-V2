'use client';

import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Box, Tab, TextField } from '@mui/material';
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

type MarkdownEditorProps = {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

export function MarkdownEditor({ label, value, onChange, placeholder }: MarkdownEditorProps) {
  const [tab, setTab] = useState<'write' | 'preview'>('write');

  return (
    <Box>
      <TabContext value={tab}>
        <TabList onChange={(_, newTab) => setTab(newTab)} sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tab label="Édition" value="write" />
          <Tab label="Prévisualisation" value="preview" />
        </TabList>
        <TabPanel value="write" sx={{ px: 0, pt: 2 }}>
          <TextField
            label={label}
            value={value}
            onChange={(event) => onChange(event.target.value)}
            multiline
            minRows={12}
            fullWidth
            placeholder={placeholder}
            sx={{ fontFamily: 'monospace' }}
          />
        </TabPanel>
        <TabPanel value="preview" sx={{ px: 0, pt: 2 }}>
          <Box
            sx={{
              border: (theme) => `1px solid ${theme.palette.divider}`,
              borderRadius: 2,
              p: 2,
              minHeight: 240,
              bgcolor: 'background.paper',
            }}
          >
            {value ? <ReactMarkdown remarkPlugins={[remarkGfm]}>{value}</ReactMarkdown> : 'Aucun contenu.'}
          </Box>
        </TabPanel>
      </TabContext>
    </Box>
  );
}
