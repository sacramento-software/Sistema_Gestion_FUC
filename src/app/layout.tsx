import type { Metadata } from 'next';
import { Analytics } from '@vercel/analytics/next';
import { leerTema } from '@/lib/tema';
import { clasesFuentes } from './fuentes';
import '@/styles/globals.css';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: { default: 'Federación Uruguaya de Canotaje', template: '%s · FUC' },
  description: 'Competencias, resultados y rankings de la Federación Uruguaya de Canotaje.',
  robots: { index: false, follow: false },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const tema = await leerTema();
  return (
    <html lang="es-UY" data-theme={tema} className={clasesFuentes}>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
