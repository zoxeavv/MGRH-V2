import type { Metadata } from 'next';
import './global.css';
import { AppProviders } from './providers';
import { plus } from '@/utils/theme/DefaultColors';

export const metadata: Metadata = {
  title: 'OrbitCRM',
  description: 'Multi-tenant offers & templates SaaS built with Next.js, Supabase, and Drizzle.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className={plus.className}>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
