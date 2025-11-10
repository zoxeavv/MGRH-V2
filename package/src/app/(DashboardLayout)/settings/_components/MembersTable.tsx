'use client';

import {
  Alert,
  Avatar,
  IconButton,
  MenuItem,
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
import BlockIcon from '@mui/icons-material/Block';
import { useState, useTransition } from 'react';
import { disableMember, updateMemberRole } from '../actions';

type MemberRow = {
  id: string;
  role: 'owner' | 'admin' | 'user';
  status: 'active' | 'pending' | 'disabled';
  profileName: string | null;
  profileEmail: string | null;
  avatarUrl: string | null;
};

type MembersTableProps = {
  members: MemberRow[];
};

export function MembersTable({ members }: MembersTableProps) {
  const [rows, setRows] = useState(members);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleRoleChange = (memberId: string, role: MemberRow['role']) => {
    setRows((prev) => prev.map((member) => (member.id === memberId ? { ...member, role } : member)));
    setError(null);
    startTransition(async () => {
      try {
        await updateMemberRole({ membershipId: memberId, role });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Impossible de modifier le rôle.');
      }
    });
  };

  const handleDisable = (memberId: string) => {
    setError(null);
    startTransition(async () => {
      try {
        await disableMember({ membershipId: memberId });
        setRows((prev) => prev.map((member) => (member.id === memberId ? { ...member, status: 'disabled' } : member)));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Impossible de désactiver le membre.');
      }
    });
  };

  return (
    <Paper variant="outlined" sx={{ borderRadius: 3, p: 3 }}>
      <Stack spacing={2}>
        <Typography variant="h6">Membres</Typography>
        {error ? <Alert severity="error">{error}</Alert> : null}
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Utilisateur</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Statut</TableCell>
              <TableCell>Rôle</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((member) => (
              <TableRow key={member.id}>
                <TableCell>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Avatar src={member.avatarUrl ?? undefined}>
                      {member.profileName?.[0]?.toUpperCase() ?? member.profileEmail?.[0]?.toUpperCase() ?? '?'}
                    </Avatar>
                    <Typography variant="body2">{member.profileName ?? 'Invité'}</Typography>
                  </Stack>
                </TableCell>
                <TableCell>{member.profileEmail ?? member.profileName ?? '—'}</TableCell>
                <TableCell>
                  <Typography variant="caption" color="text.secondary">
                    {member.status}
                  </Typography>
                </TableCell>
                <TableCell>
                  <TextField
                    select
                    size="small"
                    value={member.role}
                    onChange={(event) => handleRoleChange(member.id, event.target.value as MemberRow['role'])}
                    disabled={isPending || member.status === 'disabled'}
                  >
                    <MenuItem value="owner">Propriétaire</MenuItem>
                    <MenuItem value="admin">Admin</MenuItem>
                    <MenuItem value="user">Utilisateur</MenuItem>
                  </TextField>
                </TableCell>
                <TableCell align="right">
                  <IconButton
                    onClick={() => handleDisable(member.id)}
                    disabled={isPending || member.status === 'disabled'}
                  >
                    <BlockIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Stack>
    </Paper>
  );
}
