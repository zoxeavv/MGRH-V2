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

export type SidebarSection = {
  type: "section"
  label: string
}

export type SidebarLink = {
  type: "link"
  id: string
  title: string
  href: string
  icon: ComponentType<{ size?: number; stroke?: number; className?: string }>
}

export type SidebarItem = SidebarSection | SidebarLink

export const menuItems: SidebarItem[] = [
  {
    type: "section",
    label: "Home",
  },
  {
    type: "link",
    id: "dashboard",
    title: "Dashboard",
    icon: IconLayoutDashboard,
    href: "/",
  },
  {
    type: "section",
    label: "Utilities",
  },
  {
    type: "link",
    id: "typography",
    title: "Typography",
    icon: IconTypography,
    href: "/utilities/typography",
  },
  {
    type: "link",
    id: "shadow",
    title: "Shadow",
    icon: IconCopy,
    href: "/utilities/shadow",
  },
  {
    type: "section",
    label: "Auth",
  },
  {
    type: "link",
    id: "login",
    title: "Login",
    icon: IconLogin,
    href: "/authentication/login",
  },
  {
    type: "link",
    id: "register",
    title: "Register",
    icon: IconUserPlus,
    href: "/authentication/register",
  },
  {
    type: "section",
    label: "Extra",
  },
  {
    type: "link",
    id: "icons",
    title: "Icons",
    icon: IconMoodHappy,
    href: "/icons",
  },
  {
    type: "link",
    id: "sample",
    title: "Sample Page",
    icon: IconAperture,
    href: "/sample-page",
  },
]

export default menuItems


