'use client';

import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import { IconLogout, IconSettings, IconUser } from '@tabler/icons-react';

import type { ActiveMembershipContext } from '@/lib/auth/session';
import { signOut } from '@/lib/auth/actions';

type ProfileMenuProps = {
  context: ActiveMembershipContext;
};

const Profile = ({ context }: ProfileMenuProps) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [isPending, startTransition] = React.useTransition();

  const avatarSrc = context.profile?.avatar_url ?? undefined;
  const avatarFallback = context.profile?.full_name
    ? context.profile.full_name
        .split(' ')
        .map((part) => part[0])
        .join('')
        .substring(0, 2)
        .toUpperCase()
    : context.user.email?.substring(0, 2).toUpperCase();

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => setAnchorEl(null);

  const handleSignOut = () => {
    handleClose();
    startTransition(async () => {
      await signOut();
    });
  };

  return (
    <Box>
      <IconButton
        size="large"
        color="inherit"
        aria-haspopup="true"
        onClick={handleOpen}
        sx={{
          ...(anchorEl && {
            color: 'primary.main',
          }),
        }}
      >
        <Avatar
          src={avatarSrc}
          alt={context.profile?.full_name ?? context.user.email ?? 'profile'}
          sx={{ width: 36, height: 36, bgcolor: 'primary.main', fontWeight: 600 }}
        >
          {avatarFallback}
        </Avatar>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        PaperProps={{
          sx: {
            minWidth: 220,
            mt: 1,
            px: 1,
          },
        }}
      >
        <Box px={1.5} py={1}>
          <Typography variant="subtitle2" fontWeight={600}>
            {context.profile?.full_name ?? context.user.email}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {context.user.email}
          </Typography>
        </Box>

        <Divider sx={{ my: 1 }} />

        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <IconUser size={18} stroke={1.5} />
          </ListItemIcon>
          <ListItemText primary="My profile" />
        </MenuItem>

        <MenuItem onClick={handleClose} component="a" href="/settings">
          <ListItemIcon>
            <IconSettings size={18} stroke={1.5} />
          </ListItemIcon>
          <ListItemText primary="Settings" />
        </MenuItem>

        <Divider sx={{ my: 1 }} />

        <MenuItem onClick={handleSignOut} disabled={isPending}>
          <ListItemIcon>
            <IconLogout size={18} stroke={1.5} />
          </ListItemIcon>
          <ListItemText primary="Sign out" />
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default Profile;
