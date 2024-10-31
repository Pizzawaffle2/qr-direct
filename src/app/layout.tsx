import { Inter } from 'next/font/google'
import { Providers } from '@/components/providers/providers'
import { Header } from '@/components/layout/header'
import { Toaster } from '@/components/ui/toaster'
import '@/styles/globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'QR Direct - Professional QR Code Generator',
  description: 'Generate custom QR codes for your business or personal use',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <Header />
          <main className="min-h-screen pt-16">
            {children}
          </main>
          <Toaster />
        </Providers>
      </body>
    </html>
  )
}