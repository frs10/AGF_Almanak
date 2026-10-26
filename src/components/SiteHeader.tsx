'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'

export default function SiteHeader() {
  const pathname = usePathname()

  const isAlmanak = pathname === '/almanak' || pathname === '/'
  const isHjoernet =
    pathname === '/hjoernet' ||
    pathname.startsWith('/hjoernet/')

  return (
    <header className="border-b border-white/10">
      <div className="max-w-[1200px] mx-auto px-5 md:px-8 min-h-[60px] md:min-h-[72px] flex flex-wrap items-center justify-between gap-4">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 md:gap-[10px] no-underline leading-none"
        >
          <Image
            src="/agf_almanakken.png"
            alt="Hvid Røg"
            width={160}
            height={33}
            className="h-7 md:h-9 w-auto"
            priority
          />
        </Link>

        {/* Nav */}
        <nav aria-label="Hovedmenu" className="flex items-stretch gap-1 self-stretch">
          <Link
            href="/almanak"
            aria-current={isAlmanak ? 'page' : undefined}
            className={[
              'px-[10px] md:px-[14px] flex items-center text-sm md:text-[15px] no-underline transition-colors',
              isAlmanak
                ? 'text-white shadow-[inset_0_-2px_0_#FFFFFF]'
                : 'text-white/70 hover:text-white',
            ].join(' ')}
          >
            <span className="md:hidden">Almanak</span>
            <span className="hidden md:inline">Almanakken</span>
          </Link>
          <Link
            href="/hjoernet"
            aria-current={isHjoernet ? 'page' : undefined}
            className={[
              'px-[10px] md:px-[14px] flex items-center text-sm md:text-[15px] no-underline transition-colors',
              isHjoernet
                ? 'text-white shadow-[inset_0_-2px_0_#FFFFFF]'
                : 'text-white/70 hover:text-white',
            ].join(' ')}
          >
            <span className="md:hidden">Hjørnet</span>
            <span className="hidden md:inline">Det Litterære Hjørne</span>
          </Link>
        </nav>
      </div>
    </header>
  )
}
