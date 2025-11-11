import { ThemeProvider } from "next-themes";
import { OrganizationProvider } from "@/components/layout/providers";
import type { OrganizationContextValue } from "@/components/layout/providers";
import { Toaster } from "@/components/ui/toaster";

export function Providers({
  children,
  organization,
}: {
  children: React.ReactNode;
  organization: OrganizationContextValue | null;
}) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <OrganizationProvider organization={organization}>
        {children}
        <Toaster />
      </OrganizationProvider>
    </ThemeProvider>
  );
}
