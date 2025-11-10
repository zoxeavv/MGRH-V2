'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import type { ActiveMembershipContext } from '@/lib/auth/session';

import { sidebarNavItems } from './MenuItems';

type SidebarItemsProps = {
  context: ActiveMembershipContext;
  onNavigate?: () => void;
};

const SidebarItems = ({ context, onNavigate }: SidebarItemsProps) => {
  const pathname = usePathname();

  return (
    <Stack
      component="nav"
      spacing={3}
      sx={{
        flex: 1,
        height: '100%',
        py: 3,
        px: 2,
      }}
    >
      <Stack direction="row" spacing={2} alignItems="center" px={1}>
        <Avatar
          variant="rounded"
          sx={{
            bgcolor: 'primary.light',
            color: 'primary.main',
            width: 40,
            height: 40,
            fontWeight: 600,
          }}
        >
          {context.organization.name.substring(0, 2).toUpperCase()}
        </Avatar>
        <Box>
          <Typography variant="subtitle1" fontWeight={600}>
            {context.organization.name}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {context.organization.slug}
          </Typography>
        </Box>
      </Stack>

      <Box px={1}>
        <Chip
          label={`${context.membership.role.toUpperCase()} • ${context.membership.status.toUpperCase()}`}
          size="small"
          color="primary"
          variant="outlined"
          sx={{ fontWeight: 600 }}
        />
      </Box>

      <Divider />

      <List component="nav" dense disablePadding>
        {sidebarNavItems.map((item) => {
          const selected = item.exact ? pathname === item.href : pathname.startsWith(item.href);

          return (
            <ListItemButton
              key={item.href}
              component={Link}
              href={item.href}
              selected={selected}
              onClick={onNavigate}
              sx={{
                borderRadius: 2,
                mb: 0.5,
              }}
            >
              <ListItemIcon sx={{ minWidth: 36 }}>{item.icon}</ListItemIcon>
              <ListItemText
                primary={item.title}
                primaryTypographyProps={{
                  fontWeight: selected ? 600 : 500,
                  color: selected ? 'primary.main' : 'text.primary',
                }}
              />
              {item.badge ? (
                <Chip size="small" label={item.badge} color="secondary" sx={{ fontWeight: 600 }} />
              ) : null}
            </ListItemButton>
          );
        })}
      </List>
    </Stack>
  );
};

export default SidebarItems;

