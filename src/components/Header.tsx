'use client'

import Link from 'next/link'
import Image from 'next/image'

export default function Header() {
  return (
    <header className="bg-agf-blue text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3">
        <div className="relative flex items-center justify-center">
          <Link href="/">
            <Image
              src="/agf_almanakken.png"
              alt="AGF Almanakken"
              width={400}
              height={70}
              className="h-10 md:h-14 w-auto"
              priority
            />
          </Link>
          <nav className="absolute right-0">
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
