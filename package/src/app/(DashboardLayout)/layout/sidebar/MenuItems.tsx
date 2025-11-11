import type { ComponentType } from "react";
import {
  IconLayoutDashboard,
  IconSettings,
  IconStack2,
  IconUsers,
  IconFileText,
} from "@tabler/icons-react";

export type NavigationItem = {
  id: string;
  title: string;
  href: string;
  icon?: ComponentType<{ size?: number; stroke?: number }>;
  items?: NavigationItem[];
};

export type NavigationGroup = {
  id: string;
  title: string;
  items: NavigationItem[];
};

const menuGroups: NavigationGroup[] = [
  {
    id: "dashboard",
    title: "Dashboard",
    items: [
      {
        id: "dashboard-overview",
        title: "Overview",
        href: "/",
        icon: IconLayoutDashboard,
      },
    ],
  },
  {
    id: "clients",
    title: "Clients",
    items: [
      {
        id: "clients-home",
        title: "All Clients",
        href: "/clients",
        icon: IconUsers,
      },
    ],
  },
  {
    id: "offers",
    title: "Offers",
    items: [
      {
        id: "offers-home",
        title: "Pipelines",
        href: "/offers",
        icon: IconFileText,
      },
    ],
  },
  {
    id: "templates",
    title: "Templates",
    items: [
      {
        id: "templates-home",
        title: "Content Library",
        href: "/templates",
        icon: IconStack2,
      },
    ],
  },
  {
    id: "settings",
    title: "Settings",
    items: [
      {
        id: "settings-home",
        title: "Workspace",
        href: "/settings",
        icon: IconSettings,
      },
    ],
  },
];

export default menuGroups;