import type { Metadata } from "next"
import { Plus_Jakarta_Sans } from "next/font/google"
import "./globals.css"

import { ThemeProvider } from "@/components/layout/providers"
import { cn } from "@/lib/utils"

const fontSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
})

export const metadata: Metadata = {
  title: "Modernize Dashboard",
  description: "Accessible dashboard powered by Tailwind CSS and shadcn/ui.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning className="h-full">
      <body
        className={cn(
          "min-h-dvh bg-background text-foreground antialiased",
          fontSans.className
        )}
      >
        <a
          href="#shell-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground shadow-card focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        >
          Skip to content
        </a>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex min-h-dvh flex-col">{children}</div>
        </ThemeProvider>
      </body>
    </html>
  )
}
