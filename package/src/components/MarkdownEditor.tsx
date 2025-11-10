'use client';

import * as React from 'react';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';

type MarkdownEditorProps = {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minRows?: number;
};

const MarkdownEditor = ({
  label,
  value,
  onChange,
  placeholder,
  minRows = 16,
}: MarkdownEditorProps) => {
  const [tab, setTab] = React.useState<'write' | 'preview'>('write');

  const renderedHtml = React.useMemo(() => {
    const html = marked.parse(value || '', { async: false });
    return DOMPurify.sanitize(html);
  }, [value]);

  return (
    <Paper variant="outlined">
      <Tabs
        value={tab}
        onChange={(_, next) => setTab(next)}
        indicatorColor="primary"
        textColor="primary"
        sx={{ borderBottom: 1, borderColor: 'divider' }}
      >
        <Tab label="Write" value="write" />
        <Tab label="Preview" value="preview" />
      </Tabs>

      {tab === 'write' ? (
        <Box sx={{ p: 2 }}>
          <TextField
            fullWidth
            multiline
            minRows={minRows}
            label={label}
            value={value}
            onChange={(event) => onChange(event.target.value)}
            placeholder={placeholder}
          />
        </Box>
      ) : (
        <Box
          sx={{
            p: 3,
            minHeight: minRows * 24,
            bgcolor: 'background.paper',
            '& :first-of-type': { mt: 0 },
          }}
          dangerouslySetInnerHTML={{ __html: renderedHtml }}
        />
      )}
    </Paper>
  );
};

export default MarkdownEditor;

