import {
  LayoutDashboard,
  Users,
  FileText,
  Receipt,
  Settings,
  type LucideIcon,
} from 'lucide-react';

export interface MenuItem {
  id: string;
  title: string;
  icon: LucideIcon;
  href: string;
  navlabel?: boolean;
  subheader?: string;
}

const Menuitems: MenuItem[] = [
  {
    id: 'dashboard',
    title: 'Dashboard',
    icon: LayoutDashboard,
    href: '/',
  },
  {
    id: 'clients',
    title: 'Clients',
    icon: Users,
    href: '/clients',
  },
  {
    id: 'templates',
    title: 'Templates',
    icon: FileText,
    href: '/templates',
  },
  {
    id: 'offers',
    title: 'Offers',
    icon: Receipt,
    href: '/offers',
  },
  {
    id: 'settings',
    title: 'Settings',
    icon: Settings,
    href: '/settings',
  },
];

export default Menuitems;
