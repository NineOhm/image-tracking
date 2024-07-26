import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Script from 'next/script'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AR Fitness App',
  description: 'Discover hidden content with AR',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <Script src="https://cdn.jsdelivr.net/npm/mind-ar@1.2.1/dist/mindar-image.prod.js" />
        <Script src="https://cdn.jsdelivr.net/npm/three@0.133.1/build/three.min.js" />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  )
}