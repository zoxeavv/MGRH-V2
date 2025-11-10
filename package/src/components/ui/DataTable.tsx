import type React from 'react';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';

export type DataTableColumn<Row> = {
  key: string;
  header: string;
  align?: 'left' | 'right' | 'center';
  render?: (row: Row) => React.ReactNode;
};

export type DataTableProps<Row> = {
  columns: DataTableColumn<Row>[];
  rows: Row[];
  getRowId: (row: Row, index: number) => string;
  emptyState?: React.ReactNode;
};

export function DataTable<Row>({
  columns,
  rows,
  getRowId,
  emptyState = <Typography variant="body2">Aucune donnée disponible.</Typography>,
}: DataTableProps<Row>) {
  return (
    <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 3, border: (theme) => `1px solid ${theme.palette.divider}` }}>
      <Table size="small">
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <TableCell key={column.key} align={column.align ?? 'left'} sx={{ fontWeight: 600 }}>
                {column.header}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length}>
                <Typography variant="body2" color="text.secondary" sx={{ py: 4, textAlign: 'center' }}>
                  {emptyState}
                </Typography>
              </TableCell>
            </TableRow>
          ) : (
            rows.map((row, rowIndex) => (
              <TableRow key={getRowId(row, rowIndex)} hover>
                {columns.map((column) => (
                  <TableCell key={column.key} align={column.align ?? 'left'}>
                    {column.render ? column.render(row) : (row as Record<string, React.ReactNode>)[column.key]}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
