import type { ReactNode } from 'react';
import {
  IconGauge,
  IconUsers,
  IconFileDescription,
  IconReceipt2,
  IconSettings,
} from '@tabler/icons-react';

export type SidebarNavItem = {
  title: string;
  href: string;
  icon: ReactNode;
  exact?: boolean;
  badge?: string;
};

export const sidebarNavItems: SidebarNavItem[] = [
  {
    title: 'Dashboard',
    href: '/',
    icon: <IconGauge size={18} stroke={1.5} />,
    exact: true,
  },
  {
    title: 'Clients',
    href: '/clients',
    icon: <IconUsers size={18} stroke={1.5} />,
  },
  {
    title: 'Templates',
    href: '/templates',
    icon: <IconFileDescription size={18} stroke={1.5} />,
  },
  {
    title: 'Offers',
    href: '/offers',
    icon: <IconReceipt2 size={18} stroke={1.5} />,
  },
  {
    title: 'Settings',
    href: '/settings',
    icon: <IconSettings size={18} stroke={1.5} />,
  },
];