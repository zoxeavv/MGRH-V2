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
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';

import StatusChip from '@/components/StatusChip';
import { disableMember, updateMemberRole } from '../actions';

type MemberRow = {
  id: string;
  role: 'owner' | 'admin' | 'user';
  status: 'active' | 'pending' | 'disabled';
  invitedEmail: string | null;
  createdAt: Date;
  profileName: string | null;
  profileEmail: string | null;
};

type MembersTableProps = {
  members: MemberRow[];
};

const roleOptions: Array<MemberRow['role']> = ['owner', 'admin', 'user'];

const MembersTable = ({ members }: MembersTableProps) => {
  const [rows, setRows] = React.useState(members);
  const [error, setError] = React.useState<string | null>(null);
  const [pendingId, setPendingId] = React.useState<string | null>(null);

  React.useEffect(() => setRows(members), [members]);

  const handleRoleChange = (id: string, role: MemberRow['role']) => {
    setPendingId(id);
    setError(null);
    updateMemberRole({ membershipId: id, role })
      .then((result) => {
        if (!result.success) {
          setError(result.error);
        }
      })
      .finally(() => setPendingId(null));
    setRows((prev) => prev.map((row) => (row.id === id ? { ...row, role } : row)));
  };

  const handleDisable = (id: string) => {
    setPendingId(id);
    setError(null);
    disableMember({ membershipId: id })
      .then((result) => {
        if (!result.success) {
          setError(result.error);
        }
      })
      .finally(() => setPendingId(null));
    setRows((prev) => prev.map((row) => (row.id === id ? { ...row, status: 'disabled' } : row)));
  };

  return (
    <Paper variant="outlined" sx={{ p: 3 }}>
      <Stack spacing={2}>
        <Typography variant="h6" fontWeight={600}>
          Members
        </Typography>
        {error ? <Alert severity="error">{error}</Alert> : null}
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Status</TableCell>
              <TableCell width={160}>Role</TableCell>
              <TableCell width={120}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((member) => (
              <TableRow key={member.id}>
                <TableCell>{member.profileName ?? member.invitedEmail ?? 'Pending invite'}</TableCell>
                <TableCell>{member.profileEmail ?? member.invitedEmail ?? '—'}</TableCell>
                <TableCell>
                  <StatusChip context="membership" status={member.status} />
                </TableCell>
                <TableCell>
                  <TextField
                    select
                    size="small"
                    value={member.role}
                    onChange={(event) => handleRoleChange(member.id, event.target.value as MemberRow['role'])}
                    disabled={pendingId === member.id}
                  >
                    {roleOptions.map((roleOption) => (
                      <MenuItem key={roleOption} value={roleOption}>
                        {roleOption}
                      </MenuItem>
                    ))}
                  </TextField>
                </TableCell>
                <TableCell>
                  <Button
                    variant="text"
                    color="inherit"
                    size="small"
                    onClick={() => handleDisable(member.id)}
                    disabled={pendingId === member.id || member.status === 'disabled'}
                  >
                    Disable
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Stack>
    </Paper>
  );
};

export default MembersTable;
