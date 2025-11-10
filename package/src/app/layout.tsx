import type { Metadata } from 'next';
import ThemeRegistry from '@/components/ThemeRegistry';
import { plus } from '@/utils/theme/DefaultColors';

import './global.css';

export const metadata: Metadata = {
  title: 'Orbit CRM',
  description: 'Build, track, and close offers faster with a multi-tenant SaaS CRM.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={plus.className}>
      <body>
        <ThemeRegistry>{children}</ThemeRegistry>
      </body>
    </html>
  );
}
