import type { Metadata } from 'next'
import './globals.css'

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
    <html lang="da">
      <body className="bg-white text-gray-900 min-h-screen">
        {children}
      </body>
    </html>
  )
}
