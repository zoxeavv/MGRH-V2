import type { Metadata } from "next";
import Providers from "@/components/layout/providers";
import "./global.css";

export const metadata = {
  title: "CardStacks CRM",
  description: "Multi-tenant CRM SaaS built on the Vercel Admin template.",
} satisfies Metadata;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
