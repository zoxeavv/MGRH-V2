'use client';

import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import {
  Alert,
  Box,
  Button,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import Papa from 'papaparse';
import { useRef, useState, useTransition } from 'react';
import { ImportRow, importClients } from '../actions';

type ImportSummary = {
  created: number;
  updated: number;
  ignored: number;
};

const normalizeRow = (row: Record<string, string>): ImportRow | null => {
  const name = row.name?.trim();
  if (!name) return null;

  const email = row.email?.trim() ?? '';
  const phone = row.phone?.trim() ?? '';
  const tags = row.tags?.trim() ?? '';
  const status = (row.status?.trim().toLowerCase() as ImportRow['status']) ?? undefined;

  return {
    name,
    email: email || undefined,
    phone: phone || undefined,
    tags,
    status,
  };
};

export function ImportClientsView() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [rows, setRows] = useState<ImportRow[]>([]);
  const [summary, setSummary] = useState<ImportSummary | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleFiles = (fileList: FileList | null) => {
    setError(null);
    setSummary(null);
    const file = fileList?.item(0);
    if (!file) return;

    Papa.parse<Record<string, string>>(file, {
      header: true,
      skipEmptyLines: true,
      complete(result) {
        const parsed = result.data
          .map((row) => normalizeRow(row))
          .filter((row): row is ImportRow => row !== null);
        setRows(parsed);
      },
      error(err) {
        setError(err.message);
      },
    });
  };

  const handleImport = () => {
    if (rows.length === 0) {
      setError('Aucune ligne valide à importer.');
      return;
    }

    startTransition(async () => {
      try {
        const result = await importClients(rows);
        setSummary(result);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Import impossible. Vérifiez le format du fichier.");
      }
    });
  };

  return (
    <Stack spacing={4}>
      <Box
        sx={{
          border: (theme) => `2px dashed ${theme.palette.primary.main}`,
          borderRadius: 3,
          p: 4,
          textAlign: 'center',
          bgcolor: 'primary.light',
        }}
        onDragOver={(event) => {
          event.preventDefault();
        }}
        onDrop={(event) => {
          event.preventDefault();
          handleFiles(event.dataTransfer.files);
        }}
      >
        <CloudUploadIcon fontSize="large" color="primary" />
        <Typography variant="h6" mt={2}>
          Glissez-déposez votre fichier CSV
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={2}>
          Ou sélectionnez-le depuis votre ordinateur.
        </Typography>
        <Button variant="contained" onClick={() => fileInputRef.current?.click()}>
          Choisir un fichier
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          hidden
          onChange={(event) => handleFiles(event.target.files)}
        />
      </Box>

      {error ? <Alert severity="error">{error}</Alert> : null}

      {rows.length > 0 ? (
        <Stack spacing={2}>
          <Typography variant="subtitle1">Aperçu ({rows.length} lignes)</Typography>
          <TableContainer component={Paper} sx={{ borderRadius: 3 }} variant="outlined">
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Nom</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Téléphone</TableCell>
                  <TableCell>Tags</TableCell>
                  <TableCell>Statut</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.slice(0, 10).map((row, index) => (
                  <TableRow key={`${row.name}-${index}`}>
                    <TableCell>{row.name}</TableCell>
                    <TableCell>{row.email ?? '—'}</TableCell>
                    <TableCell>{row.phone ?? '—'}</TableCell>
                    <TableCell>{Array.isArray(row.tags) ? row.tags.join(', ') : row.tags ?? '—'}</TableCell>
                    <TableCell>{row.status ?? 'lead'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Typography variant="caption" color="text.secondary">
            Seules les 10 premières lignes sont affichées.
          </Typography>
          <Button variant="contained" disabled={isPending} onClick={handleImport} sx={{ alignSelf: 'flex-start' }}>
            Importer {rows.length} clients
          </Button>
        </Stack>
      ) : null}

      {summary ? (
        <Alert severity="success">
          Import terminé : {summary.created} créés • {summary.updated} mis à jour • {summary.ignored} ignorés
        </Alert>
      ) : null}
    </Stack>
  );
}
