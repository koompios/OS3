import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from './components/Navbar';
import Greet from './greet';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Control Center',
  description: 'KOOMPI Control Center',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <main className="flex flex-col items-center justify-between ">
          {/* <Greet /> */}
          {/* <Navbar /> */}
          {children}
        </main>
      </body>
    </html>
  );
}
