'use client';

import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import SettingsIcon from '@mui/icons-material/Settings';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import DescriptionIcon from '@mui/icons-material/Description';
import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import { useMemo, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  AppBar,
  Avatar,
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Toolbar,
  Typography,
  Button,
} from '@mui/material';
import type { MembershipRow, ProfileRow } from '@/lib/auth/session';

const drawerWidth = 280;

type DashboardLayoutShellProps = {
  children: React.ReactNode;
  profile: ProfileRow;
  membership: MembershipRow & {
    organization: NonNullable<MembershipRow['organization']>;
  };
};

type NavItem = {
  label: string;
  href: string;
  icon: React.ReactNode;
};

const NAV_ITEMS: NavItem[] = [
  { label: 'Tableau de bord', href: '/', icon: <DashboardIcon fontSize="small" /> },
  { label: 'Clients', href: '/clients', icon: <PeopleIcon fontSize="small" /> },
  { label: 'Offres', href: '/offers', icon: <DescriptionIcon fontSize="small" /> },
  { label: 'Templates', href: '/templates', icon: <ContentPasteIcon fontSize="small" /> },
  { label: 'Paramètres', href: '/settings', icon: <SettingsIcon fontSize="small" /> },
];

const isActivePath = (pathname: string, href: string) => {
  if (href === '/') {
    return pathname === '/';
  }

  return pathname === href || pathname.startsWith(`${href}/`);
};

export function DashboardLayoutShell({ children, membership, profile }: DashboardLayoutShellProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const organization = membership.organization;
  const initials = useMemo(() => {
    if (organization.name) {
      const parts = organization.name.split(' ');
      if (parts.length >= 2) {
        return `${parts[0][0] ?? ''}${parts[1][0] ?? ''}`.toUpperCase();
      }
      return organization.name.slice(0, 2).toUpperCase();
    }
    return 'ORG';
  }, [organization.name]);

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Stack direction="row" spacing={2} alignItems="center" px={3} py={4}>
        {organization.logo_url ? (
          <Avatar src={organization.logo_url} alt={organization.name} sx={{ width: 40, height: 40 }} />
        ) : (
          <Avatar sx={{ bgcolor: 'primary.main', width: 40, height: 40 }}>{initials}</Avatar>
        )}
        <Box>
          <Typography variant="subtitle1" fontWeight={600}>
            {organization.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {membership.role === 'owner' ? 'Propriétaire' : membership.role === 'admin' ? 'Admin' : 'Membre'}
          </Typography>
        </Box>
      </Stack>
      <Divider />
      <List sx={{ flexGrow: 1, px: 1, py: 2 }}>
        {NAV_ITEMS.map((item) => (
          <ListItemButton
            key={item.href}
            component={Link}
            href={item.href}
            selected={isActivePath(pathname, item.href)}
            sx={{
              borderRadius: 2,
              mb: 0.5,
              '&.Mui-selected': {
                bgcolor: 'primary.light',
                color: 'primary.main',
                '& .MuiListItemIcon-root': { color: 'primary.main' },
              },
            }}
            onClick={() => setMobileOpen(false)}
          >
            <ListItemIcon sx={{ minWidth: 36 }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}
      </List>
      <Divider />
      <Stack spacing={1} px={3} py={3}>
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Avatar src={profile.avatar_url ?? undefined} sx={{ width: 36, height: 36 }}>
            {profile.full_name?.[0]?.toUpperCase() ?? profile.email[0]?.toUpperCase() ?? '?'}
          </Avatar>
          <Box>
            <Typography variant="subtitle2">{profile.full_name ?? profile.email}</Typography>
            <Typography variant="caption" color="text.secondary">
              {profile.email}
            </Typography>
          </Box>
        </Stack>
        <Button
          variant="outlined"
          size="small"
          color="inherit"
          startIcon={<LogoutIcon fontSize="small" />}
          component={Link}
          href="/authentication/login?signout=1"
        >
          Déconnexion
        </Button>
      </Stack>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'grey.100' }}>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          bgcolor: 'background.paper',
          borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
          color: 'text.primary',
        }}
      >
        <Toolbar sx={{ gap: 2 }}>
          <IconButton
            color="inherit"
            edge="start"
            onClick={() => setMobileOpen((prev) => !prev)}
            sx={{ display: { md: 'none' } }}
            aria-label="Ouvrir la navigation"
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {NAV_ITEMS.find((item) => isActivePath(pathname, item.href))?.label ?? 'Espace'}
          </Typography>
          <Button
            component={Link}
            href="/settings"
            color="primary"
            startIcon={<SettingsIcon fontSize="small" />}
            sx={{ display: { xs: 'none', md: 'inline-flex' } }}
          >
            Paramètres
          </Button>
        </Toolbar>
      </AppBar>

      <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          open
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              borderRight: (theme) => `1px solid ${theme.palette.divider}`,
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { xs: '100%', md: `calc(100% - ${drawerWidth}px)` },
          bgcolor: 'transparent',
          px: { xs: 2, md: 4 },
          py: 4,
          mt: { xs: 7, md: 0 },
        }}
      >
        <Toolbar />
        <Box sx={{ maxWidth: 1280, mx: 'auto', width: '100%' }}>{children}</Box>
      </Box>
    </Box>
  );
}
