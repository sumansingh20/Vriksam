import type { Metadata, Viewport } from 'next';
import { Inter, Plus_Jakarta_Sans } from 'next/font/google';
import { Providers } from '@/providers';
import '@/styles/globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-jakarta',
});

export const metadata: Metadata = {
  title: 'Vriksham - The Future of Green Infrastructure',
  description:
    'Transform your spaces with intelligent plant management. Monitor, maintain, and maximize your green assets with AI-powered insights.',
  keywords: [
    'green infrastructure',
    'plant management',
    'AI',
    'sustainability',
    'ESG',
    'corporate greenery',
    'smart monitoring',
  ],
  openGraph: {
    title: 'Vriksham - The Future of Green Infrastructure',
    description:
      'Transform your spaces with intelligent plant management. Monitor, maintain, and maximize your green assets with AI-powered insights.',
    type: 'website',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#059669',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jakarta.variable}`}>
      <body className="min-h-screen bg-white font-sans antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
