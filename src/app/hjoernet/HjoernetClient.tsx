'use client'

import { useState, useMemo, useRef, useEffect } from 'react'
import Link from 'next/link'
import { Search, Lock, ExternalLink, RotateCcw, Library, BookOpen, AlignLeft, Music, FileText, Mail, Circle } from 'lucide-react'
import WorkTypeIcon from '@/components/hjoernet/WorkTypeIcon'
import { WorkType } from '@/lib/supabase'

// ── Types ─────────────────────────────────────────────────────────────────────

type Person = { id: string; name: string }
type WorkAuthorRow = { role: string; persons: Person | null }
type WorkRow = {
  id: string
  slug: string
  title: string
  type: WorkType
  published_year: number | null
  link: string | null
  paywall: boolean
  shelf_mark: string | null
  bibliotek_dk_url: string | null
  work_authors: WorkAuthorRow[]
}
type AppearanceRow = {
  id: string
  work_id: string
  episode_date: string
  is_revisit: boolean
  extra_info: string | null
  works: WorkRow | null
}

interface Props {
  appearances: AppearanceRow[]
  authors: Person[]
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const TYPE_LABELS: Record<WorkType | 'alle', string> = {
  alle: 'Alle',
  bog: 'Bog',
  digt: 'Digt',
  sang: 'Sang',
  essay: 'Essay/artikel',
  brev: 'Besked/brev',
  andet: 'Andet',
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr + 'T00:00:00')
  const day = d.getDate().toString().padStart(2, '0')
  const month = (d.getMonth() + 1).toString().padStart(2, '0')
  return `${day}.${month}`
}

function getYear(dateStr: string) {
  return dateStr.slice(0, 4)
}

function getAuthorDisplay(work: WorkRow): string {
  if (!work.work_authors?.length) return ''
  const authors = work.work_authors
    .filter((a) => a.persons)
    .map((a) => {
      const name = a.persons!.name
      return a.role === 'redaktør' ? `Red. ${name}` : name
    })
  const year = work.published_year ? ` · ${work.published_year}` : ''
  return authors.join(', ') + year
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function HjoernetClient({ appearances, authors }: Props) {
  const [query, setQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState<WorkType | 'alle'>('alle')
  const [authorFilter, setAuthorFilter] = useState('')
  const [loanOnly, setLoanOnly] = useState(false)
  const searchRef = useRef<HTMLInputElement>(null)

  // Keyboard shortcut: / to focus search
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === '/' && document.activeElement?.tagName !== 'INPUT') {
        e.preventDefault()
        searchRef.current?.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // ── Filter ──────────────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    const q = query.toLowerCase()
    return appearances.filter((a) => {
      const w = a.works
      if (!w) return false
      if (typeFilter !== 'alle' && w.type !== typeFilter) return false
      if (loanOnly && !w.shelf_mark && !w.bibliotek_dk_url) return false
      if (authorFilter) {
        const hasAuthor = w.work_authors?.some(
          (wa) => wa.persons?.id === authorFilter
        )
        if (!hasAuthor) return false
      }
      if (q) {
        const haystack = [
          w.title,
          ...(w.work_authors?.map((wa) => wa.persons?.name ?? '') ?? []),
        ]
          .join(' ')
          .toLowerCase()
        if (!haystack.includes(q)) return false
      }
      return true
    })
  }, [appearances, query, typeFilter, authorFilter, loanOnly])

  // ── Group by year ──────────────────────────────────────────────────────────
  const groups = useMemo(() => {
    const map = new Map<string, AppearanceRow[]>()
    for (const a of filtered) {
      const y = getYear(a.episode_date)
      if (!map.has(y)) map.set(y, [])
      map.get(y)!.push(a)
    }
    return Array.from(map.entries()) // already sorted desc by episode_date
  }, [filtered])

  const years = useMemo(() => Array.from(new Set(appearances.map((a) => getYear(a.episode_date)))), [appearances])

  const isEmpty = groups.length === 0
  const totalCount = appearances.length

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <main className="flex-1 w-full max-w-[1200px] mx-auto px-5 md:px-8 pb-24 box-border">
      {/* Hero */}
      <section className="py-9 md:py-[72px] pb-8 md:pb-12 flex flex-wrap justify-between items-end gap-6 border-b border-white/10">
        <div className="flex flex-col gap-4 max-w-2xl">
          <span className="text-xs tracking-widest uppercase text-white/60">
            Arkiv · {totalCount} indslag siden maj 2024
          </span>
          <h1 className="m-0 text-agf-off-white font-bold text-[44px] md:text-[80px] leading-none md:leading-[0.95]">
            Det Litterære Hjørne
          </h1>
          <p className="m-0 text-white/70 text-[15px] md:text-lg">
            I hvert afsnit bliver der læst noget op. Her er det hele, nyeste
            først. Teksterne må du selv opsøge – vi fortæller hvor.
          </p>
        </div>

        {/* Search – desktop only in hero; mobile below */}
        <div className="hidden md:flex w-[360px] max-w-full flex-col gap-1.5">
          <label htmlFor="dsog" className="text-[13px] text-white/70">
            Søg i titler og forfattere
          </label>
          <div className="h-12 px-[14px] flex items-center gap-2.5 rounded-lg border border-white/40 bg-white/10 text-white/70">
            <Search size={18} strokeWidth={1.5} aria-hidden="true" />
            <input
              ref={searchRef}
              id="dsog"
              type="search"
              placeholder="Fx From, Mygind, digt …"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 min-w-0 border-0 bg-transparent text-white font-[inherit] outline-none placeholder:text-white/40"
            />
            <span className="text-[12px] px-1.5 py-0.5 rounded border border-white/30 font-[inherit] text-white/50">
              /
            </span>
          </div>
        </div>
      </section>

      {/* Mobile search */}
      <div className="md:hidden pt-3 pb-3 flex flex-col gap-1.5">
        <label htmlFor="msog" className="text-[13px] text-white/70">
          Søg i titler og forfattere
        </label>
        <div className="h-12 px-[14px] flex items-center gap-2.5 rounded-lg border border-white/40 bg-white/10 text-white/70">
          <Search size={18} strokeWidth={1.5} aria-hidden="true" />
          <input
            ref={searchRef}
            id="msog"
            type="search"
            placeholder="Fx From, Mygind, digt …"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 min-w-0 border-0 bg-transparent text-white font-[inherit] text-base outline-none placeholder:text-white/40"
          />
        </div>
      </div>

      {/* Mobile chips */}
      <div
        role="group"
        aria-label="Filtrér efter type"
        className="md:hidden flex gap-2 overflow-x-auto pb-2 pt-1 -mx-5 px-5"
      >
        {(Object.keys(TYPE_LABELS) as (WorkType | 'alle')[]).map((t) => (
          <button
            key={t}
            type="button"
            aria-pressed={typeFilter === t}
            onClick={() => setTypeFilter(t)}
            className={[
              'h-10 px-[14px] rounded-full border font-[inherit] text-sm whitespace-nowrap flex-none cursor-pointer inline-flex items-center gap-1.5 transition-colors',
              typeFilter === t
                ? 'bg-white text-agf-blue border-white font-medium'
                : 'bg-transparent text-white border-white/30',
            ].join(' ')}
          >
            {TYPE_LABELS[t]}
          </button>
        ))}
      </div>

      {/* Mobile secondary filters */}
      <div className="md:hidden flex gap-2 pb-4 pt-1">
        <button
          type="button"
          aria-pressed={loanOnly}
          onClick={() => setLoanOnly((v) => !v)}
          className={[
            'h-10 px-[14px] rounded-full border font-[inherit] text-sm cursor-pointer inline-flex items-center gap-1.5 transition-colors',
            loanOnly
              ? 'bg-white text-agf-blue border-white font-medium'
              : 'bg-transparent text-white border-white/30',
          ].join(' ')}
        >
          <Library size={16} strokeWidth={1.5} aria-hidden="true" />
          Kan lånes
        </button>
        {/* Author – simplified select on mobile */}
        {authors.length > 0 && (
          <select
            value={authorFilter}
            onChange={(e) => setAuthorFilter(e.target.value)}
            className="h-10 px-3 rounded-full border border-white/30 bg-agf-blue text-white font-[inherit] text-sm cursor-pointer"
          >
            <option value="" className="bg-agf-blue text-white">Forfatter</option>
            {authors.map((a) => (
              <option key={a.id} value={a.id} className="bg-agf-blue text-white">
                {a.name}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Mobile sticky year jump */}
      {years.length > 1 && (
        <nav
          aria-label="Spring til år"
          className="md:hidden sticky top-0 z-10 flex gap-5 bg-agf-blue border-t border-b border-white/10 px-5 -mx-5 py-2.5 text-[13px]"
        >
          {years.map((y) => (
            <a
              key={y}
              href={`#y${y}`}
              className="min-h-[28px] flex items-center no-underline text-white/60 hover:text-white transition-colors"
            >
              {y}
            </a>
          ))}
        </nav>
      )}

      {/* Main layout: sidebar + list */}
      <div className="pt-10 flex flex-wrap gap-14 items-start">
        {/* Sidebar – desktop only */}
        <aside
          aria-label="Filtre"
          className="hidden md:flex flex-[1_1_220px] max-w-[260px] flex-col gap-8"
        >
          {/* Type filter */}
          <fieldset className="m-0 p-0 border-0 flex flex-col gap-1">
            <legend className="pb-2.5 text-[13px] font-medium tracking-[0.06em] uppercase text-white/60">
              Type
            </legend>
            {(Object.keys(TYPE_LABELS) as (WorkType | 'alle')[]).map((t) => (
              <button
                key={t}
                type="button"
                aria-pressed={typeFilter === t}
                onClick={() => setTypeFilter(t)}
                className={[
                  'h-10 px-3 rounded-lg border-0 font-[inherit] text-sm flex items-center gap-2.5 cursor-pointer transition-colors',
                  typeFilter === t
                    ? 'bg-white/15 text-white font-medium'
                    : 'bg-transparent text-white/70 hover:text-white',
                ].join(' ')}
              >
                {t !== 'alle' && (
                  <WorkTypeIcon type={t as WorkType} size={16} />
                )}
                {TYPE_LABELS[t]}
              </button>
            ))}
          </fieldset>

          {/* Author select */}
          {authors.length > 0 && (
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="dforf"
                className="text-[13px] font-medium tracking-[0.06em] uppercase text-white/60 pb-1"
              >
                Forfatter
              </label>
              <select
                id="dforf"
                value={authorFilter}
                onChange={(e) => setAuthorFilter(e.target.value)}
                className="h-11 px-3 rounded-lg border border-white/40 bg-agf-blue text-white font-[inherit] text-sm cursor-pointer"
              >
                <option value="" className="bg-agf-blue text-white">Alle forfattere</option>
                {authors.map((a) => (
                  <option key={a.id} value={a.id} className="bg-agf-blue text-white">
                    {a.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Loan toggle */}
          <label className="flex gap-3 items-center text-sm cursor-pointer min-h-[44px]">
            <input
              type="checkbox"
              checked={loanOnly}
              onChange={(e) => setLoanOnly(e.target.checked)}
              className="w-5 h-5 accent-white m-0"
            />
            Kun værker der kan lånes
          </label>

          {/* Year jump */}
          {years.length > 1 && (
            <nav
              aria-label="Tidslinje"
              className="flex flex-col gap-0.5 pt-6 border-t border-white/10 text-[13px]"
            >
              <span className="text-[13px] font-medium tracking-[0.06em] uppercase text-white/60 pb-2">
                Tidslinje
              </span>
              {years.map((y) => (
                <a
                  key={y}
                  href={`#y${y}`}
                  className="py-1.5 no-underline text-white/70 hover:text-white transition-colors"
                >
                  {y}
                </a>
              ))}
            </nav>
          )}
        </aside>

        {/* Entry list */}
        <div className="flex-[999_1_560px] min-w-0 flex flex-col gap-2">
          <span className="text-[13px] text-white/60">
            {isEmpty
              ? 'Ingen resultater'
              : `Viser ${filtered.length} indslag · nyeste først`}
          </span>

          {isEmpty ? (
            /* Empty state */
            <div className="mt-8 p-8 md:p-8 rounded-xl border border-dashed border-white/30 flex flex-col gap-3 items-start">
              <div className="font-fraktur text-agf-off-white text-3xl">
                Intet fundet
              </div>
              <p className="m-0 text-white/70 text-[15px]">
                Der er ikke læst noget op, der passer på dine filtre. Endnu.
              </p>
              <button
                type="button"
                onClick={() => {
                  setQuery('')
                  setTypeFilter('alle')
                  setAuthorFilter('')
                  setLoanOnly(false)
                }}
                className="mt-1 h-11 px-4 rounded-full border border-white/40 bg-transparent text-white font-[inherit] text-sm cursor-pointer hover:border-white/70 transition-colors"
              >
                Nulstil filtre
              </button>
            </div>
          ) : (
            groups.map(([year, items]) => (
              <section key={year} id={`y${year}`}>
                <h2 className="mt-6 mb-1 text-[13px] font-medium text-white">
                  {year}
                </h2>
                <div className="border-t border-white/10 flex flex-col">
                  {items.map((a) => {
                    const w = a.works!
                    const authorDisplay = getAuthorDisplay(w)
                    const canLoan = !!(w.shelf_mark || w.bibliotek_dk_url)

                    return (
                      <Link
                        key={a.id}
                        href={`/hjoernet/vaerk/${w.slug}`}
                        className={[
                          'min-h-[64px] py-3 no-underline text-white',
                          /* Desktop: 4-col grid */
                          'md:grid md:grid-cols-[88px_32px_minmax(0,1fr)_auto] md:gap-4 md:items-center',
                          /* Mobile: 2-col */
                          'grid grid-cols-[32px_minmax(0,1fr)] gap-3 items-start',
                          'border-b border-white/10 hover:bg-white/5 transition-colors -mx-5 px-5 md:mx-0 md:px-0',
                        ].join(' ')}
                      >
                        {/* Date – desktop only col 1 */}
                        <span className="hidden md:block text-[13px] text-white/70">
                          {formatDate(a.episode_date)}
                        </span>

                        {/* Type icon */}
                        <WorkTypeIcon type={w.type} />

                        {/* Title + meta */}
                        <span className="flex flex-col min-w-0">
                          <span className="font-medium">{w.title}</span>
                          <span className="text-[13px] text-white/60">
                            {authorDisplay}
                          </span>
                          {/* Date + badges – mobile */}
                          <span className="md:hidden mt-1 flex flex-wrap gap-1.5 items-center text-[12px] text-white/60">
                            <span>{formatDate(a.episode_date)}</span>
                            {a.is_revisit && (
                              <Chip>Genbesøg</Chip>
                            )}
                            {w.paywall && (
                              <Chip icon={<Lock size={12} strokeWidth={1.8} />}>
                                Betalingsmur
                              </Chip>
                            )}
                            {w.link && !w.paywall && (
                              <Chip icon={<ExternalLink size={12} strokeWidth={1.8} />}>
                                Link
                              </Chip>
                            )}
                          </span>
                        </span>

                        {/* Badge – desktop only col 4 */}
                        <span className="hidden md:flex items-center">
                          {a.is_revisit && <Chip>Genbesøg</Chip>}
                          {w.paywall && (
                            <Chip icon={<Lock size={12} strokeWidth={1.8} />}>
                              Betalingsmur
                            </Chip>
                          )}
                          {w.link && !w.paywall && (
                            <Chip icon={<ExternalLink size={12} strokeWidth={1.8} />}>
                              Link
                            </Chip>
                          )}
                        </span>
                      </Link>
                    )
                  })}
                </div>
              </section>
            ))
          )}
        </div>
      </div>
    </main>
  )
}

function Chip({
  children,
  icon,
}: {
  children: React.ReactNode
  icon?: React.ReactNode
}) {
  return (
    <span className="px-2 py-0.5 rounded-full border border-white/30 text-[12px] text-white/70 inline-flex gap-1 items-center">
      {icon}
      {children}
    </span>
  )
}
