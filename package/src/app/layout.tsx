import type { Metadata } from "next";
import Providers from "@/components/layout/providers";
import { getActiveOrganization, getSession } from "@/lib/auth/session";
import "./global.css";

export const metadata = {
  title: "CardStacks CRM",
  description: "Multi-tenant CRM SaaS built on the Vercel Admin template.",
} satisfies Metadata;

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  const organization = session ? await getActiveOrganization() : null;

  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <Providers organization={organization}>{children}</Providers>
      </body>
    </html>
  );
}
