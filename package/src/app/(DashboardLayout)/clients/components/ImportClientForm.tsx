'use client';

import * as React from 'react';
import Papa from 'papaparse';
import { useRouter } from 'next/navigation';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Alert from '@mui/material/Alert';
import LinearProgress from '@mui/material/LinearProgress';

import { importClients } from '../actions';

type ParsedRow = {
  name?: string;
  email?: string;
  phone?: string;
  tags?: string[];
  status?: string;
};

const ImportClientForm = () => {
  const router = useRouter();
  const [rows, setRows] = React.useState<ParsedRow[]>([]);
  const [error, setError] = React.useState<string | null>(null);
  const [summary, setSummary] = React.useState<{ created: number; updated: number; skipped: number } | null>(null);
  const [isUploading, setIsUploading] = React.useState(false);
  const [isImporting, startTransition] = React.useTransition();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError(null);
    setSummary(null);
    setRows([]);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const parsedRows = (results.data as Papa.ParseResult<ParsedRow>['data']).map((row) => ({
          name: row.name?.toString().trim(),
          email: row.email?.toString().trim() || undefined,
          phone: row.phone?.toString().trim() || undefined,
          tags: typeof row.tags === 'string' ? row.tags.split(',').map((tag) => tag.trim()).filter(Boolean) : undefined,
          status: row.status?.toString().trim(),
        }));

        const filtered = parsedRows.filter((row) => row.name);
        setRows(filtered);
        setIsUploading(false);
      },
      error: (err) => {
        setError(err.message);
        setIsUploading(false);
      },
    });
  };

  const handleImport = () => {
    if (rows.length === 0) {
      setError('Upload a CSV with at least one client.');
      return;
    }

    setError(null);
    startTransition(async () => {
      const result = await importClients(
        rows.map((row) => ({
          name: row.name ?? '',
          email: row.email,
          phone: row.phone,
          tags: row.tags ?? [],
          status: row.status,
        })),
      );

      if (!result.success) {
        setError(result.error);
      } else {
        setSummary(result.data);
        router.refresh();
      }
    });
  };

  return (
    <Paper variant="outlined" sx={{ p: 3 }}>
      <Stack spacing={3}>
        <Stack spacing={1}>
          <Button variant="outlined" component="label">
            {isUploading ? 'Uploading…' : 'Choose CSV file'}
            <input type="file" accept=".csv" hidden onChange={handleFileChange} />
          </Button>
          <Typography variant="caption" color="text.secondary">
            UTF-8 CSV, max 5MB.
          </Typography>
          {isUploading ? <LinearProgress /> : null}
        </Stack>

        {error ? <Alert severity="error">{error}</Alert> : null}
        {summary ? (
          <Alert severity="success">
            Imported {summary.created} clients, updated {summary.updated}, skipped {summary.skipped}.
          </Alert>
        ) : null}

        {rows.length > 0 ? (
          <Stack spacing={2}>
            <Typography variant="subtitle2">Preview ({rows.length} rows)</Typography>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Phone</TableCell>
                  <TableCell>Tags</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.slice(0, 10).map((row, index) => (
                  <TableRow key={`${row.name}-${index}`}>
                    <TableCell>{row.name}</TableCell>
                    <TableCell>{row.email || '—'}</TableCell>
                    <TableCell>{row.phone || '—'}</TableCell>
                    <TableCell>{row.tags?.join(', ') || '—'}</TableCell>
                    <TableCell>{row.status || '—'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {rows.length > 10 ? (
              <Typography variant="caption" color="text.secondary">
                Showing first 10 rows of {rows.length}.
              </Typography>
            ) : null}
          </Stack>
        ) : null}

        <Stack direction="row" spacing={2}>
          <Button variant="contained" onClick={handleImport} disabled={rows.length === 0 || isImporting}>
            {isImporting ? 'Importing…' : 'Import clients'}
          </Button>
          <Button variant="text" onClick={() => setRows([])} disabled={rows.length === 0}>
            Clear
          </Button>
        </Stack>
      </Stack>
    </Paper>
  );
};

export default ImportClientForm;

