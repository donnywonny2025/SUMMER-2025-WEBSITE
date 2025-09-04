import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Jeffrey Kerr - AI-Enhanced Creative Technologist',
  description: 'Pushing the boundaries of visual storytelling through the integration of cutting-edge AI technologies, authentic narratives, and 15+ years of proven expertise.',
  openGraph: {
    title: 'Jeffrey Kerr',
    description: 'AI-Enhanced Creative Technologist specializing in visual storytelling and innovative video production.',
    type: 'website',
  },
  twitter: {
    title: 'Jeffrey Kerr',
    description: 'AI-Enhanced Creative Technologist specializing in visual storytelling and innovative video production.',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}