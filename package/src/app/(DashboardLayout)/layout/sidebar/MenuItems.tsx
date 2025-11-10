import {
  IconAperture,
  IconCopy,
  IconLayoutDashboard,
  IconLogin,
  IconMoodHappy,
  IconTypography,
  IconUserPlus,
} from "@tabler/icons-react"
import type { ComponentType } from "react"

type IconType = ComponentType<{ size?: number | string; stroke?: number | string }>

export type SidebarNavEntry =
  | {
      type: "label"
      id: string
      label: string
    }
  | {
      type: "link"
      id: string
      title: string
      href: string
      icon: IconType
    }

export const sidebarNav: SidebarNavEntry[] = [
  {
    type: "label",
    id: "home",
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
    type: "label",
    id: "utilities",
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
    type: "label",
    id: "auth",
    label: "Authentication",
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
    type: "label",
    id: "extra",
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
