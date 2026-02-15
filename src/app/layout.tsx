import type { Metadata } from 'next'
import { Montserrat } from 'next/font/google'
import './globals.css'

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'AGF Almanak - højdepunkter i AGF\'s historie samlet og præsenteret af Hvid Røg',
  description: 'Udforsk AGF\'s rige historie gennem tiden. Se hvad der skete på denne dag i AGF\'s historie. Sture Sandø og Michael \'Jøden\' Mühlenbach.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="da" className={montserrat.variable}>
      <body className="font-sans bg-agf-blue text-white min-h-screen">
        {children}
      </body>
    </html>
  )
}
