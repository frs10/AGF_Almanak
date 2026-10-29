'use client'

import { useState, useMemo, useEffect, useRef } from 'react'
import { DateEntry } from '@/lib/supabase'

const MONTH_NAMES = [
  'Januar', 'Februar', 'Marts', 'April', 'Maj', 'Juni',
  'Juli', 'August', 'September', 'Oktober', 'November', 'December',
]

const MONTH_SHORT = [
  'jan', 'feb', 'mar', 'apr', 'maj', 'jun',
  'jul', 'aug', 'sep', 'okt', 'nov', 'dec',
]

type ProcessedEntry = {
  year: number
  text: string
  description: string
  persons: string[]
  id: string
}

type ProcessedDay = {
  day: number
  isToday: boolean
  entries: ProcessedEntry[]
}

type Props = {
  dates: DateEntry[]
}

export default function AlmanakClient({ dates }: Props) {
  const today = new Date()
  const todayMonth = today.getMonth() + 1
  const todayDay = today.getDate()

  const [activeMonth, setActiveMonth] = useState(todayMonth)
  const [jinglePlaying, setJinglePlaying] = useState(false)
  const [selectedPerson, setSelectedPerson] = useState<string | null>(null)

  const mobileNavRef = useRef<HTMLDivElement>(null)
  const todayRef = useRef<HTMLLIElement>(null)
  const audioRef = useRef<HTMLAudioElement>(null)

  // Group all dates by month → day, sorted by year within each day
  const byMonthDay = useMemo(() => {
    const grouped: Record<number, Record<number, ProcessedEntry[]>> = {}
    for (let m = 1; m <= 12; m++) grouped[m] = {}

    dates.forEach((entry) => {
      if (!entry.date) return
      const d = new Date(entry.date + 'T00:00:00')
      if (isNaN(d.getTime())) return
      const month = d.getMonth() + 1
      const day = d.getDate()
      const year = d.getFullYear()
      if (!grouped[month]) return
      if (!grouped[month][day]) grouped[month][day] = []
      grouped[month][day].push({
        year,
        text: entry.title,
        description: entry.description ?? '',
        persons: entry.persons ?? [],
        id: entry.id,
      })
    })

    for (const monthData of Object.values(grouped)) {
      for (const dayEntries of Object.values(monthData)) {
        dayEntries.sort((a, b) => a.year - b.year)
      }
    }

    return grouped
  }, [dates])

  // Per-month counts — respects person filter
  const monthHasEntries = useMemo(() => {
    const result: Record<number, boolean> = {}
    for (let m = 1; m <= 12; m++) {
      const monthData = byMonthDay[m] ?? {}
      if (!selectedPerson) {
        result[m] = Object.keys(monthData).length > 0
      } else {
        result[m] = Object.values(monthData).some((dayEntries) =>
          dayEntries.some((e) => e.persons.includes(selectedPerson)),
        )
      }
    }
    return result
  }, [byMonthDay, selectedPerson])

  // All days for active month
  const activeDays: ProcessedDay[] = useMemo(() => {
    const monthData = byMonthDay[activeMonth] ?? {}
    return Object.entries(monthData)
      .map(([d, entries]) => ({
        day: Number(d),
        isToday: activeMonth === todayMonth && Number(d) === todayDay,
        entries,
      }))
      .sort((a, b) => a.day - b.day)
  }, [byMonthDay, activeMonth, todayMonth, todayDay])

  // Apply person filter to the day list
  const filteredDays: ProcessedDay[] = useMemo(() => {
    if (!selectedPerson) return activeDays
    return activeDays
      .map(({ day, isToday, entries }) => ({
        day,
        isToday,
        entries: entries.filter((e) => e.persons.includes(selectedPerson)),
      }))
      .filter((d) => d.entries.length > 0)
  }, [activeDays, selectedPerson])

  const entryCount = filteredDays.reduce((sum, d) => sum + d.entries.length, 0)

  const todayHasEntries = useMemo(
    () => Boolean(byMonthDay[todayMonth]?.[todayDay]?.length),
    [byMonthDay, todayMonth, todayDay],
  )

  function handlePersonClick(person: string) {
    setSelectedPerson((prev) => (prev === person ? null : person))
  }

  function clearPersonFilter() {
    setSelectedPerson(null)
  }

  // Scroll today into view when switching to today's month
  useEffect(() => {
    if (activeMonth === todayMonth && todayRef.current) {
      setTimeout(() => {
        todayRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }, 100)
    }
  }, [activeMonth, todayMonth])

  // Scroll active tab into view in mobile nav
  useEffect(() => {
    const nav = mobileNavRef.current
    if (!nav) return
    const btn = nav.querySelector<HTMLElement>('[data-active="true"]')
    if (btn) {
      btn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
    }
  }, [activeMonth])

  // When person filter is set, auto-jump to their first month if current month has none
  useEffect(() => {
    if (!selectedPerson) return
    if (!monthHasEntries[activeMonth]) {
      const firstMonth = [1,2,3,4,5,6,7,8,9,10,11,12].find((m) => monthHasEntries[m])
      if (firstMonth) setActiveMonth(firstMonth)
    }
  }, [selectedPerson]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="flex-1 flex flex-col">
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="max-w-[1200px] mx-auto w-full px-5 md:px-8 pt-14 md:pt-20 pb-10 md:pb-14">
        <p className="text-[#9FA5B1] text-xs md:text-sm font-semibold tracking-[0.12em] uppercase mb-5">
          Hvid Røg præsenterer
        </p>
        <h1 className="font-display font-bold text-[60px] md:text-[96px] leading-[0.88] text-white mb-5 md:mb-6">
          Almanakken
        </h1>
        <p className="text-[#9FA5B1] text-sm md:text-base max-w-md mb-8 leading-relaxed">
          Store øjeblikke, små ulykker og ét motorvejstoilet.
          <br className="hidden md:block" /> Dag for dag i AGF&apos;s historie.
        </p>

        {/* Jingle audio */}
        <audio
          ref={audioRef}
          src="/jingle.mp3"
          onEnded={() => setJinglePlaying(false)}
        />

        {/* Jingle button */}
        <button
          onClick={() => {
            const audio = audioRef.current
            if (!audio) return
            if (jinglePlaying) {
              audio.pause()
              audio.currentTime = 0
              setJinglePlaying(false)
            } else {
              audio.play()
              setJinglePlaying(true)
            }
          }}
          aria-label={jinglePlaying ? 'Stop fantastisk jingle' : 'Afspil fantastisk jingle'}
          className="inline-flex items-center gap-3 pl-4 pr-5 py-2.5 rounded-full border border-white/20 text-white/70 hover:text-white hover:border-white/40 transition-colors duration-300 text-sm font-medium select-none"
        >
          <span
            className={`w-2 h-2 rounded-full shrink-0 transition-colors duration-300 ${
              jinglePlaying ? 'bg-[#C9A227]' : 'bg-white/30'
            }`}
          />
          {jinglePlaying ? (
            <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
              <rect x="3" y="2" width="4" height="12" rx="1.5" />
              <rect x="9" y="2" width="4" height="12" rx="1.5" />
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
              <path d="M4 2.268a.75.75 0 0 1 1.141-.638l9 5.732a.75.75 0 0 1 0 1.276l-9 5.732A.75.75 0 0 1 4 13.732V2.268Z" />
            </svg>
          )}
          {jinglePlaying ? 'Stop fantastisk jingle' : 'Afspil fantastisk jingle'}
        </button>
      </section>

      {/* ── Mobile month nav ─────────────────────────────────── */}
      <div
        ref={mobileNavRef}
        className="md:hidden sticky top-0 z-20 bg-agf-blue border-b border-white/10"
        style={{ overflowX: 'auto', scrollbarWidth: 'none' }}
      >
        <div className="flex gap-1 px-5 py-2 w-max">
          {MONTH_SHORT.map((abbr, i) => {
            const m = i + 1
            const isActive = m === activeMonth
            const hasEntries = monthHasEntries[m]
            return (
              <button
                key={m}
                data-active={isActive ? 'true' : undefined}
                onClick={() => hasEntries && setActiveMonth(m)}
                className={[
                  'px-3 py-1.5 rounded-full text-sm font-medium transition-colors duration-300 whitespace-nowrap',
                  isActive
                    ? 'bg-white text-[#0F1D3D]'
                    : hasEntries
                      ? 'text-white/70 hover:text-white cursor-pointer'
                      : 'text-white/25 cursor-default',
                ].join(' ')}
              >
                {abbr}
              </button>
            )
          })}
        </div>
      </div>

      {/* ── Content: desktop sidebar + day list ──────────────── */}
      <div className="max-w-[1200px] mx-auto w-full px-5 md:px-8 pb-24 flex-1">
        <div className="md:flex md:gap-12 md:items-start">

          {/* Desktop month nav */}
          <nav
            aria-label="Måneder"
            className="hidden md:block w-[156px] shrink-0 sticky top-6 pt-4"
          >
            {MONTH_NAMES.map((name, i) => {
              const m = i + 1
              const isActive = m === activeMonth
              const hasEntries = monthHasEntries[m]
              return (
                <button
                  key={m}
                  onClick={() => hasEntries && setActiveMonth(m)}
                  className={[
                    'w-full text-left px-3 py-2 rounded-lg text-sm font-medium mb-0.5 transition-colors duration-300',
                    isActive
                      ? 'bg-white text-[#0F1D3D]'
                      : hasEntries
                        ? 'text-white/65 hover:text-white hover:bg-white/5 cursor-pointer'
                        : 'text-white/25 cursor-default',
                  ].join(' ')}
                >
                  {name}
                </button>
              )
            })}

            {/* "I dag"-link */}
            {todayHasEntries && (
              <div className="mt-6 pt-5 border-t border-white/10">
                <button
                  onClick={() => setActiveMonth(todayMonth)}
                  className="text-[#C9A227] text-xs font-medium hover:underline flex items-center gap-1.5 transition-colors duration-300"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C9A227] shrink-0" />
                  Gå til i dag
                </button>
              </div>
            )}
          </nav>

          {/* Day list */}
          <div className="flex-1 pt-4 md:pt-4">
            {/* Month heading + active filter chip */}
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2 mb-6 md:mb-8">
              <h2 className="font-display font-bold text-white text-2xl md:text-[28px]">
                {MONTH_NAMES[activeMonth - 1]}
              </h2>
              <div className="flex items-center gap-3 ml-auto">
                {selectedPerson && (
                  <button
                    onClick={clearPersonFilter}
                    aria-label={`Fjern filter: ${selectedPerson}`}
                    className="inline-flex items-center gap-1.5 border border-[#C9A227] text-[#C9A227] text-[11px] font-medium px-2.5 py-1 rounded-full hover:bg-[#C9A227]/10 transition-colors duration-300"
                  >
                    <svg width="9" height="9" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                    {selectedPerson}
                    <svg width="8" height="8" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden>
                      <line x1="1" y1="1" x2="11" y2="11" />
                      <line x1="11" y1="1" x2="1" y2="11" />
                    </svg>
                  </button>
                )}
                <span className="text-[#9FA5B1] text-xs font-medium tabular-nums">
                  {entryCount} {entryCount === 1 ? 'begivenhed' : 'begivenheder'}
                </span>
              </div>
            </div>

            {filteredDays.length === 0 ? (
              <p className="text-white/30 text-sm py-10">
                {selectedPerson
                  ? `Ingen begivenheder med ${selectedPerson} i denne måned.`
                  : 'Ingen registrerede begivenheder for denne måned.'}
              </p>
            ) : (
              <ol>
                {filteredDays.map(({ day, isToday, entries }) => (
                  <li
                    key={day}
                    id={`dag-${day}`}
                    ref={isToday ? todayRef : undefined}
                  >
                    <div
                      className={[
                        'flex gap-5 md:gap-8 py-6',
                        isToday
                          ? '-mx-5 px-5 md:-mx-8 md:px-8 bg-[#263450] rounded-xl'
                          : 'border-b border-white/10',
                      ].join(' ')}
                    >
                      {/* Day number + "I dag" badge */}
                      <div className="shrink-0 w-12 md:w-[60px] flex flex-col items-start gap-2">
                        <span className="font-display font-bold text-[52px] md:text-[68px] leading-none text-white">
                          {day}
                        </span>
                        {isToday && (
                          <span className="inline-flex items-center border border-[#C9A227] text-[#C9A227] text-[10px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap tracking-wide">
                            I dag
                          </span>
                        )}
                      </div>

                      {/* Entries */}
                      <div className="flex-1 flex flex-col gap-4 pt-1.5">
                        {entries.map(({ year, text, description, persons, id }) => (
                          <div
                            key={id}
                            className="grid grid-cols-[52px_1fr] md:grid-cols-[60px_1fr] gap-x-3 items-start"
                          >
                            <span className="text-[#9FA5B1] text-[13px] font-medium pt-0.5 tabular-nums">
                              {year}
                            </span>
                            <div>
                              <p className="text-white text-sm md:text-[15px] leading-relaxed m-0 font-medium">
                                {text}
                              </p>
                              {description && (
                                <p className="text-[#9FA5B1] text-xs md:text-sm leading-relaxed mt-1 m-0">
                                  {description}
                                </p>
                              )}
                              {persons.length > 0 && (
                                <div className="flex flex-wrap gap-1.5 mt-2">
                                  {persons.map((person) => {
                                    const isSelected = selectedPerson === person
                                    return (
                                      <button
                                        key={person}
                                        onClick={() => handlePersonClick(person)}
                                        aria-pressed={isSelected}
                                        className={[
                                          'inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-md border transition-colors duration-300 cursor-pointer',
                                          isSelected
                                            ? 'border-white text-white bg-white/10'
                                            : 'border-white/50 text-white/50 hover:border-white hover:text-white',
                                        ].join(' ')}
                                      >
                                        <svg width="9" height="9" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
                                          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                        </svg>
                                        {person}
                                      </button>
                                    )
                                  })}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </li>
                ))}
              </ol>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
