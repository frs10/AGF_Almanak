import type { Metadata } from 'next'
import { Cinzel, Inter } from 'next/font/google'
import './globals.css'

const cinzel = Cinzel({
  subsets: ['latin'],
  variable: '--font-cinzel',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'AGF Almanak - Fodboldhistorie dag for dag',
  description: 'Udforsk AGF\'s rige historie gennem tiden. Se hvad der skete på denne dag i AGF\'s historie.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="da" className={`${cinzel.variable} ${inter.variable}`}>
      <body className="font-sans bg-white text-gray-900 min-h-screen">
        {children}
      </body>
    </html>
  )
}
