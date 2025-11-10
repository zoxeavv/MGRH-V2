'use client';

import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Alert from '@mui/material/Alert';

import { updateItem } from '../actions';

type OfferItem = {
  id: string;
  name: string;
  description: string | null;
  quantity: string;
  unitPrice: string;
};

type ItemsTableProps = {
  offerId: string;
  items: OfferItem[];
};

const ItemsTable = ({ offerId, items }: ItemsTableProps) => {
  const [rows, setRows] = React.useState(
    items.map((item) => ({
      ...item,
      quantity: Number(item.quantity),
      unitPrice: Number(item.unitPrice),
    })),
  );
  const [error, setError] = React.useState<string | null>(null);
  const [pendingItemId, setPendingItemId] = React.useState<string | null>(null);

  React.useEffect(() => {
    setRows(
      items.map((item) => ({
        ...item,
        quantity: Number(item.quantity),
        unitPrice: Number(item.unitPrice),
      })),
    );
  }, [items]);

  const handleChange = (id: string, field: 'quantity' | 'unitPrice', value: number) => {
    setRows((prev) =>
      prev.map((row) => (row.id === id ? { ...row, [field]: value >= 0 ? value : 0 } : row)),
    );
  };

  const handleBlur = (row: (typeof rows)[number]) => {
    setPendingItemId(row.id);
    setError(null);
    updateItem({
      offerId,
      itemId: row.id,
      quantity: row.quantity,
      unitPrice: row.unitPrice,
    })
      .then((result) => {
        if (!result.success) {
          setError(result.error);
        }
      })
      .finally(() => setPendingItemId(null));
  };

  const total = rows.reduce((sum, row) => sum + row.quantity * row.unitPrice, 0);

  return (
    <Paper variant="outlined" sx={{ p: 3 }}>
      <Stack spacing={2}>
        <Typography variant="h6" fontWeight={600}>
          Current version items
        </Typography>
        {error ? <Alert severity="error">{error}</Alert> : null}
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell width={120}>Quantity</TableCell>
              <TableCell width={120}>Unit price</TableCell>
              <TableCell width={120}>Line total</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.description ?? '—'}</TableCell>
                <TableCell>
                  <TextField
                    type="number"
                    inputProps={{ min: 0, step: 1 }}
                    size="small"
                    value={row.quantity}
                    onChange={(event) => handleChange(row.id, 'quantity', Number(event.target.value))}
                    onBlur={() => handleBlur(row)}
                    disabled={pendingItemId === row.id}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    type="number"
                    inputProps={{ min: 0, step: 0.01 }}
                    size="small"
                    value={row.unitPrice}
                    onChange={(event) => handleChange(row.id, 'unitPrice', Number(event.target.value))}
                    onBlur={() => handleBlur(row)}
                    disabled={pendingItemId === row.id}
                  />
                </TableCell>
                <TableCell>${(row.quantity * row.unitPrice).toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Stack direction="row" justifyContent="flex-end">
          <Typography variant="subtitle1" fontWeight={600}>
            Total: ${total.toFixed(2)}
          </Typography>
        </Stack>
      </Stack>
    </Paper>
  );
};

export default ItemsTable;

