'use client';

import {
  Alert,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import { useState, useTransition } from 'react';
import { updateItem } from '../actions';

type OfferItemsTableProps = {
  items: Array<{
    id: string;
    name: string;
    description: string | null;
    quantity: number;
    unitPrice: string;
  }>;
};

export function OfferItemsTable({ items }: OfferItemsTableProps) {
  const [drafts, setDrafts] = useState(() =>
    items.map((item) => ({
      id: item.id,
      name: item.name,
      description: item.description ?? '',
      quantity: item.quantity,
      unitPrice: Number(item.unitPrice),
    })),
  );
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleChange = (index: number, patch: Partial<(typeof drafts)[number]>) => {
    setDrafts((prev) => prev.map((item, idx) => (idx === index ? { ...item, ...patch } : item)));
  };

  const handleSave = (index: number) => {
    const item = drafts[index];
    setError(null);
    startTransition(async () => {
      try {
        await updateItem({
          itemId: item.id,
          name: item.name,
          description: item.description,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Impossible de mettre à jour le poste.');
      }
    });
  };

  const total = drafts.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);

  return (
    <Paper variant="outlined" sx={{ borderRadius: 3, p: 3 }}>
      <Stack spacing={2}>
        <Typography variant="h6">Postes</Typography>
        {error ? <Alert severity="error">{error}</Alert> : null}
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Nom</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Quantité</TableCell>
              <TableCell>Prix unitaire (€)</TableCell>
              <TableCell align="right">Enregistrer</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {drafts.map((item, index) => (
              <TableRow key={item.id}>
                <TableCell>
                  <TextField
                    value={item.name}
                    onChange={(event) => handleChange(index, { name: event.target.value })}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    value={item.description}
                    onChange={(event) => handleChange(index, { description: event.target.value })}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    type="number"
                    value={item.quantity}
                    inputProps={{ min: 1 }}
                    onChange={(event) => handleChange(index, { quantity: Number(event.target.value) })}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    type="number"
                    value={item.unitPrice}
                    inputProps={{ min: 0, step: 0.01 }}
                    onChange={(event) => handleChange(index, { unitPrice: Number(event.target.value) })}
                  />
                </TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => handleSave(index)} disabled={isPending}>
                    <CheckIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Typography variant="subtitle2" align="right">
          Total:{' '}
          {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(total)}
        </Typography>
      </Stack>
    </Paper>
  );
}
