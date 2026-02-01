'use client'

import Link from 'next/link'
import Image from 'next/image'

export default function Header() {
  return (
    <header className="bg-agf-blue text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link href="/">
            <Image
              src="/almanakken.png"
              alt="Almanakken"
              width={200}
              height={50}
              className="h-10 md:h-12 w-auto"
              priority
            />
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
