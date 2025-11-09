import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Providers } from "@/components/layout/providers";
import { fontSans } from "@/styles/tokens";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "Modernize SaaS Boilerplate",
  description: "Server-first Next.js 15 shell ready for Supabase-powered SaaS modules.",
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en" className={fontSans.variable} suppressHydrationWarning>
      <body className={fontSans.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
