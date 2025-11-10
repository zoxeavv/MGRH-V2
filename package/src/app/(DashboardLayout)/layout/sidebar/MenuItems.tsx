import type { ComponentType } from "react"

import {
  IconAperture,
  IconCopy,
  IconLayoutDashboard,
  IconLogin,
  IconMoodHappy,
  IconTypography,
  IconUserPlus,
} from "@tabler/icons-react"

export type NavItem = {
  id: string
  title: string
  href: string
  icon: ComponentType<{ className?: string; size?: number | string }>
}

export type NavSection = {
  id: string
  label: string
  items: NavItem[]
}

export const navSections: NavSection[] = [
  {
    id: "home",
    label: "Home",
    items: [
      {
        id: "dashboard",
        title: "Dashboard",
        icon: IconLayoutDashboard,
        href: "/",
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
        icon: IconTypography,
        href: "/utilities/typography",
      },
      {
        id: "shadow",
        title: "Shadow",
        icon: IconCopy,
        href: "/utilities/shadow",
      },
    ],
  },
  {
    id: "auth",
    label: "Authentication",
    items: [
      {
        id: "login",
        title: "Login",
        icon: IconLogin,
        href: "/authentication/login",
      },
      {
        id: "register",
        title: "Register",
        icon: IconUserPlus,
        href: "/authentication/register",
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
        icon: IconMoodHappy,
        href: "/icons",
      },
      {
        id: "sample",
        title: "Sample Page",
        icon: IconAperture,
        href: "/sample-page",
      },
    ],
  },
]