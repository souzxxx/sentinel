import type { Metadata, Viewport } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-jetbrains',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Sentinel — Real-time 3D Monitoring Dashboard',
  description:
    'A sci-fi inspired 3D monitoring dashboard that visualizes GitHub repos and system metrics in an interactive orbital scene.',
  keywords: ['three.js', 'react', 'nextjs', 'dashboard', '3D', 'monitoring', 'sci-fi'],
  authors: [{ name: 'Leonardo de Souza Lima e Silva' }],
  openGraph: {
    title: 'Sentinel — Real-time 3D Monitoring Dashboard',
    description:
      'Visualize GitHub repos as orbiting satellites and system metrics in real-time 3D space.',
    type: 'website',
    siteName: 'Sentinel',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sentinel — 3D Monitoring Dashboard',
    description: 'Sci-fi 3D dashboard for real-time GitHub and system monitoring.',
  },
  robots: 'index, follow',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0a0a1a',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="bg-[#0a0a1a] text-white antialiased overflow-hidden">
        {children}
      </body>
    </html>
  );
}
