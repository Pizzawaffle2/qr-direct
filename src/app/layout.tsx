import { Inter } from 'next/font/google'
import { Providers } from '@/components/ui/providers'
import { Header } from '@/components/ui/header'
import { Toaster } from '@/components/ui/toaster'
import { Metadata } from 'next'
import '@/styles/globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'QR Code Generator | Create Custom QR Codes',
  description: 'Create custom QR codes for URLs, WiFi networks, contact information, and more. Free QR code generator with advanced customization options.',
  keywords: 'QR code generator, custom QR codes, WiFi QR code, URL QR code, vCard QR code, free QR code maker',
  openGraph: {
    title: 'QR Code Generator | Create Custom QR Codes',
    description: 'Create custom QR codes for URLs, WiFi networks, contact information, and more.',
    images: ['/og-image.png'], // Add your OG image
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'QR Code Generator | Create Custom QR Codes',
    description: 'Create custom QR codes for URLs, WiFi networks, contact information, and more.',
    images: ['/og-image.png'], // Add your Twitter card image
  },
  robots: {
    index: true,
    follow: true,
  },
  manifest: '/manifest.json',
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