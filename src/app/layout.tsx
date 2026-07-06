import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'LMAJHOL — Oversized Essentials',
  description:
    'Boutique premium 3D pour oversized t-shirts noirs et blancs. Commande cash à la livraison.',
  openGraph: {
    title: 'LMAJHOL — Oversized Essentials',
    description:
      'Monochrome fashion experience with cash-on-delivery ordering for Morocco.',
    type: 'website'
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
