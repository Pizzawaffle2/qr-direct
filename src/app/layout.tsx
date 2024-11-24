import './globals.css';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/app/providers';
import { AuthProvider } from '@/components/providers/auth-provider';
import { Toaster } from '@/components/ui/toaster';
import { MotionProvider } from '@/components/providers/motion-provider';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'QR Direct',
  description: 'QR Code Generator',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          <AuthProvider>
            <MotionProvider>
              {children}
            </MotionProvider>
          </AuthProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}