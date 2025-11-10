'use client';

import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { IconBellRinging, IconMenu2 } from '@tabler/icons-react';

import type { ActiveMembershipContext } from '@/lib/auth/session';

import Profile from './Profile';

type HeaderProps = {
  context: ActiveMembershipContext;
  onToggleMobileSidebar: () => void;
};

const Header = ({ context, onToggleMobileSidebar }: HeaderProps) => {
  return (
    <AppBar
      position="sticky"
      elevation={0}
      color="inherit"
      sx={{
        borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
        backgroundColor: 'background.paper',
        backdropFilter: 'blur(12px)',
      }}
    >
      <Toolbar sx={{ minHeight: 72, display: 'flex', gap: 2 }}>
        <IconButton
          color="inherit"
          onClick={onToggleMobileSidebar}
          sx={{
            display: {
              xs: 'inline-flex',
              lg: 'none',
            },
          }}
          aria-label="Open navigation"
        >
          <IconMenu2 size={20} stroke={1.7} />
        </IconButton>

        <Typography
          variant="subtitle2"
          color="text.secondary"
          sx={{
            display: {
              xs: 'none',
              md: 'block',
            },
            fontWeight: 500,
          }}
        >
          {context.organization.name} • {context.membership.role.toUpperCase()}
        </Typography>

        <Box sx={{ flexGrow: 1 }} />

        <Stack direction="row" spacing={1.5} alignItems="center">
          <Tooltip title="Notifications">
            <IconButton color="inherit">
              <Badge variant="dot" color="primary">
                <IconBellRinging size={20} stroke={1.6} />
              </Badge>
            </IconButton>
          </Tooltip>

          <Profile context={context} />
        </Stack>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
