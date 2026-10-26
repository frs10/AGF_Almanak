import type { Metadata } from 'next'
import { Montserrat, UnifrakturCook } from 'next/font/google'
import './globals.css'

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  display: 'swap',
})

const unifrakturCook = UnifrakturCook({
  weight: '700',
  subsets: ['latin'],
  variable: '--font-unifraktur',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'AGF Almanak - højdepunkter i AGF\'s historie samlet og præsenteret af Hvid Røg',
  description: 'Udforsk AGF\'s rige historie gennem tiden. Se hvad der skete på denne dag i AGF\'s historie. Sture Sandø og Michael \'Jøden\' Mühlenbach.',
  icons: {
    icon: [
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
    ],
    shortcut: '/favicon-16x16.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="da" className={`${montserrat.variable} ${unifrakturCook.variable}`}>
      <body className="font-sans bg-agf-blue text-white min-h-screen">
        {children}
      </body>
    </html>
  )
}
