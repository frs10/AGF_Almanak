'use client'

import Link from 'next/link'
import Image from 'next/image'

export default function Header() {
  return (
    <header className="bg-agf-blue text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3">
        <div className="flex items-center justify-center">
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
        </div>
      </div>
    </header>
  )
}
