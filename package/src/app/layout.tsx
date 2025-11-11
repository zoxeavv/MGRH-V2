import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./global.css";
import { Providers } from "@/components/providers";
import { getOrganizationContext } from "@/lib/auth/session";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CardStacks CRM",
  description: "Professional CRM platform for client management",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const organization = await getOrganizationContext();

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers organization={organization}>{children}</Providers>
      </body>
    </html>
  );
}
