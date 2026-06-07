import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import { Providers } from './providers';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' });

export const metadata: Metadata = {
  title: 'SK SCENTS — Luxury Fragrances',
  description: 'Luxury fragrances crafted for confidence, elegance and timeless identity. Discover your signature scent.',
  icons: { icon: '/logo.png' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${playfair.variable} font-body bg-luxury-black text-white antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
