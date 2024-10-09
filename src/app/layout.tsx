import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import 'react-toastify/dist/ReactToastify.css';
import './globals.css';
import {ToastContainer} from 'react-toastify'
import Providers from '@/components/providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Queue System',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Providers>
      <html lang='en'>
        <body className={inter.className}>
          <>
            {children} 
            <ToastContainer position="top-right" autoClose={3000} />
          </>
        </body>
      </html>
    </Providers>
  );
}
