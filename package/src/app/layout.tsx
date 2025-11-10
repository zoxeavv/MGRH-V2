import type { Metadata } from "next"
import "./global.css"

import { ThemeProvider } from "@/components/layout/providers"

export const metadata: Metadata = {
  title: "Modernize Dashboard",
  description: "Accessible dashboard experience powered by Tailwind CSS and shadcn/ui.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-dvh bg-background text-foreground antialiased">
        <ThemeProvider>
          <a
            href="#content"
            className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-50 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground shadow-card transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            Skip to content
          </a>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
