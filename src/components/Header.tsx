'use client'

import Link from 'next/link'

export default function Header() {
  return (
    <header className="bg-agf-blue text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-agf-gold rounded-full flex items-center justify-center border-2 border-agf-gold-light">
              <span className="text-agf-blue-dark font-display font-bold text-sm">AGF</span>
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-display font-bold tracking-wide">AGF Almanak</h1>
              <p className="text-xs md:text-sm text-agf-gold/90 hidden sm:block">Fodboldhistorie dag for dag</p>
            </div>
          </Link>
          <nav>
            <Link
              href="/login"
              className="bg-white text-agf-blue px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors text-sm"
            >
              Admin
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}
