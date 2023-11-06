import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Providers from './provider';
import '@/styles/globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          {children}
          <div id="modal-root" />
        </Providers>
      </body>
    </html>
  );
}
