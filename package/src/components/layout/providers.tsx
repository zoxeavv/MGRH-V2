"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import type { ThemeProviderProps } from "next-themes/dist/types"

import { Toaster } from "@/components/ui/toaster"

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
      {children}
      <Toaster />
    </NextThemesProvider>
  )
}
