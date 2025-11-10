import type { ComponentType } from "react";
import {
  IconAperture,
  IconCopy,
  IconLayoutDashboard,
  IconLogin,
  IconMoodHappy,
  IconTypography,
  IconUserPlus,
} from "@tabler/icons-react";

export type NavItem = {
  id: string;
  title: string;
  href: string;
  icon: ComponentType<{ size?: number; stroke?: number; className?: string }>;
  description?: string;
  shortcut?: string;
  children?: NavItem[];
};

export type NavSection = {
  id: string;
  label: string;
  items: NavItem[];
};

export const menuConfig: NavSection[] = [
  {
    id: "home",
    label: "Home",
    items: [
      {
        id: "dashboard",
        title: "Dashboard",
        href: "/",
        icon: IconLayoutDashboard,
      },
    ],
  },
  {
    id: "utilities",
    label: "Utilities",
    items: [
      {
        id: "typography",
        title: "Typography",
        href: "/utilities/typography",
        icon: IconTypography,
      },
      {
        id: "shadow",
        title: "Shadow",
        href: "/utilities/shadow",
        icon: IconCopy,
      },
    ],
  },
  {
    id: "auth",
    label: "Auth",
    items: [
      {
        id: "login",
        title: "Login",
        href: "/authentication/login",
        icon: IconLogin,
      },
      {
        id: "register",
        title: "Register",
        href: "/authentication/register",
        icon: IconUserPlus,
      },
    ],
  },
  {
    id: "extra",
    label: "Extra",
    items: [
      {
        id: "icons",
        title: "Icons",
        href: "/icons",
        icon: IconMoodHappy,
      },
      {
        id: "sample-page",
        title: "Sample Page",
        href: "/sample-page",
        icon: IconAperture,
      },
    ],
  },
];