import React from 'react'
import '@/app/globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
})

export const metadata = {
  title: 'Tim Connors',
  description: 'Here\'s a bit about me...',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.className}>
      <body className="container max-w-xl">{children}</body>
    </html>
  )
}
