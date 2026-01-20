import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import Navbar from '@/components/Navbar';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Shubhsanket Sharma - Full-Stack Developer & AI/ML Engineer',
  description: 'Portfolio of Shubhsanket Sharma - Full-Stack Developer specializing in AI/ML, Blockchain, and Modern Web Technologies',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Navbar />
        {children}
        <Toaster />
      </body>
    </html>
  );
}