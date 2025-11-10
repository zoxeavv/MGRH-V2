"use client";

import { Providers } from "@/components/layout/providers";
import { cn } from "@/lib/utils";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./global.css";

const fontSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  variable: "--font-sans",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-dvh bg-background text-foreground antialiased",
          fontSans.variable
        )}
      >
        <a
          href="#content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground shadow-card focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          Skip to content
        </a>
        <Providers>
          <div className="flex min-h-dvh flex-col font-sans">
            <main
              id="content"
              role="main"
              className="flex-1 focus:outline-none"
              tabIndex={-1}
            >
              {children}
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
