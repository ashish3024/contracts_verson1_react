import type { Metadata } from 'next';
import { Syne, DM_Sans } from 'next/font/google';
import { Navbar } from '@/components/Navbar';
import './globals.css';

const syne = Syne({
  subsets: ['latin'],
  weight: ['400', '600', '700', '800'],
  variable: '--font-syne',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-dm-sans',
});

export const metadata: Metadata = {
  title: 'ContractVault',
  description: 'Contracts Management System',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${syne.variable} ${dmSans.variable}`}>
      <body>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
