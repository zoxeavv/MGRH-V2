"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider, type ThemeProviderProps } from "next-themes"

import { TooltipProvider } from "@/components/ui/tooltip"

type ProvidersProps = ThemeProviderProps & {
  children: React.ReactNode
}

export function ThemeProvider({ children, ...props }: ProvidersProps) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      {...props}
    >
      <TooltipProvider delayDuration={200}>{children}</TooltipProvider>
    </NextThemesProvider>
  )
}
