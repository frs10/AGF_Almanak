import { Metadata } from 'next'
import Link from 'next/link'
import { supabase, WorkType } from '@/lib/supabase'
import SiteHeader from '@/components/SiteHeader'
import SiteFooter from '@/components/SiteFooter'
import WorkTypeIcon from '@/components/hjoernet/WorkTypeIcon'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Hvid Røg',
  description: 'AGF-podcasten om fodbold, fællesskab og det, der er tilbage.',
}

// 3 seneste afsnit fra Hjørnet
async function getRecentAppearances() {
  const { data } = await supabase
    .from('appearances')
    .select(`
      id, episode_date, is_revisit,
      works (
        slug, title, type,
        work_authors ( role, persons ( name ) )
      )
    `)
    .order('episode_date', { ascending: false })
    .limit(3)
  return (data ?? []) as any[]
}

// Næste 3 datoer (fra og med i dag) der har almanakken-entries
async function getUpcomingEntries() {
  const { data } = await supabase
    .from('dates')
    .select('id, date, title, description')
    .order('date', { ascending: true })

  if (!data || data.length === 0) return []

  const today = new Date()
  const todayMD = `${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`

  // Gruppér entries efter MM-DD
  const grouped: Record<string, any[]> = {}
  for (const entry of data) {
    const md = entry.date.slice(5) // "MM-DD"
    if (!grouped[md]) grouped[md] = []
    grouped[md].push(entry)
  }

  const allMDs = Object.keys(grouped).sort()

  // Find de næste 3 datoer fra i dag (med wrap-around over nytår)
  const upcoming: string[] = []
  for (const md of allMDs) {
    if (md >= todayMD) { upcoming.push(md); if (upcoming.length === 3) break }
  }
  if (upcoming.length < 3) {
    for (const md of allMDs) {
      if (md < todayMD) { upcoming.push(md); if (upcoming.length === 3) break }
    }
  }

  return upcoming.map((md) => ({ md, entries: grouped[md] }))
}

function shortDate(dateStr: string) {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('da-DK', {
    day: 'numeric',
    month: 'short',
  })
}

function getFirstAuthor(work: any): string {
  const authors = Array.isArray(work?.work_authors) ? work.work_authors : []
  const wa = authors[0]
  const persons = wa?.persons
  if (Array.isArray(persons)) return persons[0]?.name ?? ''
  return persons?.name ?? ''
}

export default async function FrontPage() {
  const [appearances, upcomingGroups] = await Promise.all([
    getRecentAppearances(),
    getUpcomingEntries(),
  ])

  return (
    <div className="min-h-screen bg-agf-blue flex flex-col">
      <SiteHeader />

      <main className="flex-1 flex flex-col">

        {/* ── Podcast-links ── */}
        <section className="border-b border-white/10">
          <div className="max-w-[1200px] mx-auto px-5 md:px-8 py-6 flex flex-wrap justify-center items-center gap-3">
              <a
                href="#"
                className="group flex items-center gap-2 px-4 py-2 rounded-full border border-white/15 text-sm text-white/70 hover:border-white/40 hover:text-white transition-all"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" className="text-[#1DB954]" aria-hidden="true">
                  <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                </svg>
                Spotify
              </a>
              <a
                href="#"
                className="group flex items-center gap-2 px-4 py-2 rounded-full border border-white/15 text-sm text-white/70 hover:border-white/40 hover:text-white transition-all"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" className="text-[#B150E2]" aria-hidden="true">
                  <path d="M5.34 0A5.328 5.328 0 000 5.34v13.32A5.328 5.328 0 005.34 24h13.32A5.328 5.328 0 0024 18.66V5.34A5.328 5.328 0 0018.66 0zm6.525 2.568c2.336 0 4.448.902 6.056 2.587 1.608 1.685 2.432 3.809 2.416 6.14-.016 2.402-.887 4.521-2.525 6.108-1.12 1.092-2.385 1.745-3.863 2.02a1.047 1.047 0 01-1.23-.84 1.047 1.047 0 01.84-1.23c1.116-.214 2.092-.7 2.972-1.56 1.268-1.24 1.925-2.867 1.938-4.515.01-1.733-.617-3.327-1.863-4.637-1.24-1.31-2.882-2.019-4.61-2.019-3.553 0-6.442 2.89-6.442 6.441 0 1.664.647 3.269 1.835 4.555.72.783 1.59 1.354 2.597 1.692.536.178.827.758.65 1.294a1.047 1.047 0 01-1.294.65c-1.33-.44-2.513-1.208-3.462-2.253-1.527-1.66-2.326-3.8-2.326-5.937 0-4.961 4.028-8.996 8.97-8.996zm0 3.39a5.607 5.607 0 015.6 5.6c0 2.05-1.12 3.94-2.925 4.94a1.047 1.047 0 01-1.42-.4 1.047 1.047 0 01.4-1.42c1.124-.63 1.82-1.826 1.82-3.12a3.503 3.503 0 00-3.5-3.5 3.503 3.503 0 00-3.5 3.5c0 1.282.688 2.47 1.79 3.11a1.047 1.047 0 01.38 1.427 1.047 1.047 0 01-1.427.38C7.47 15.34 6.39 13.465 6.39 11.558c0-3.09 2.515-5.6 5.476-5.6zm.013 3.18a2.42 2.42 0 012.418 2.418 2.42 2.42 0 01-2.418 2.418A2.42 2.42 0 019.45 11.556a2.42 2.42 0 012.428-2.418zm-.024 1.406a1.012 1.012 0 100 2.024 1.012 1.012 0 000-2.024zm-.43 3.583a1.047 1.047 0 011.031 1.063l-.07 4.003a1.047 1.047 0 01-1.063 1.031 1.047 1.047 0 01-1.031-1.063l.07-4.003a1.047 1.047 0 011.063-1.031z"/>
                </svg>
                Apple Podcasts
              </a>
          </div>
        </section>

        {/* ── De to sektioner ── */}
        <section className="border-b border-white/10">
          <div className="max-w-[1200px] mx-auto px-5 md:px-8 py-10 md:py-14 grid grid-cols-1 md:grid-cols-2 gap-4">

            <Link
              href="/almanak"
              className="group flex flex-col gap-4 p-7 md:p-8 rounded-2xl border border-white/10 hover:border-white/25 hover:bg-[#263450] transition-all duration-200"
            >
              <div className="flex items-start justify-between gap-3">
                <h2 className="text-xl md:text-2xl font-semibold tracking-tight">Almanakken</h2>
                <svg
                  className="w-5 h-5 text-white/30 group-hover:text-white/60 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all mt-0.5 shrink-0"
                  fill="none" stroke="currentColor" viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 17L17 7M17 7H7M17 7v10" />
                </svg>
              </div>
              <p className="text-white/55 text-sm leading-relaxed flex-1">
                Store øjeblikke, nære nedture og én motorvejstoilet. Hvad skete der på denne dag i AGF&apos;s historie?
              </p>
              <span className="text-sm text-white/40 group-hover:text-white/70 transition-colors">
                Se almanakken →
              </span>
            </Link>

            <Link
              href="/hjoernet"
              className="group flex flex-col gap-4 p-7 md:p-8 rounded-2xl border border-white/10 hover:border-white/25 hover:bg-[#263450] transition-all duration-200"
            >
              <div className="flex items-start justify-between gap-3">
                <h2 className="text-xl md:text-2xl font-semibold tracking-tight">Det Litterære Hjørne</h2>
                <svg
                  className="w-5 h-5 text-white/30 group-hover:text-white/60 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all mt-0.5 shrink-0"
                  fill="none" stroke="currentColor" viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 17L17 7M17 7H7M17 7v10" />
                </svg>
              </div>
              <p className="text-white/55 text-sm leading-relaxed flex-1">
                I hvert afsnit bliver noget læst op. Her er alt, hvad der har lydt i hjørnet — bog, digt, sang eller essay.
              </p>
              <span className="text-sm text-white/40 group-hover:text-white/70 transition-colors">
                Se alle indslag →
              </span>
            </Link>

          </div>
        </section>

        {/* ── Seneste + På denne dag ── */}
        <section className="flex-1">
          <div className="max-w-[1200px] mx-auto px-5 md:px-8 py-10 md:py-14 grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16">

            {/* Seneste fra Hjørnet */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <h3 className="text-[11px] font-semibold uppercase tracking-[0.12em] text-white/50">
                  Seneste fra Hjørnet
                </h3>
                <Link href="/hjoernet" className="text-[11px] text-white/35 hover:text-white/70 transition-colors">
                  Se alle →
                </Link>
              </div>
              {appearances.length === 0 ? (
                <p className="text-white/35 text-sm py-4">Ingen indslag endnu.</p>
              ) : (
                <div className="flex flex-col">
                  {appearances.map((a: any) => {
                    const work = Array.isArray(a.works) ? a.works[0] : a.works
                    if (!work) return null
                    const author = getFirstAuthor(work)
                    return (
                      <Link
                        key={a.id}
                        href={`/hjoernet/vaerk/${work.slug}`}
                        className="group flex items-center gap-3 py-3.5 border-b border-white/[0.06] last:border-0 hover:bg-white/[0.025] -mx-2 px-2 rounded-lg transition-colors"
                      >
                        <WorkTypeIcon type={work.type as WorkType} size={14} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate group-hover:text-white transition-colors">
                            {work.title}
                          </p>
                          {author && (
                            <p className="text-xs text-white/45 mt-0.5 truncate">{author}</p>
                          )}
                        </div>
                        <time className="text-[11px] text-white/35 shrink-0 tabular-nums">
                          {shortDate(a.episode_date)}
                        </time>
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Kommende i almanakken */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <h3 className="text-[11px] font-semibold uppercase tracking-[0.12em] text-white/50">
                  Almanakken
                </h3>
                <Link href="/almanak" className="text-[11px] text-white/35 hover:text-white/70 transition-colors">
                  Se almanakken →
                </Link>
              </div>
              {upcomingGroups.length === 0 ? (
                <p className="text-white/35 text-sm py-4">Ingen begivenheder fundet.</p>
              ) : (
                <div className="flex flex-col gap-5">
                  {upcomingGroups.map(({ md, entries }: { md: string; entries: any[] }) => {
                    const today = new Date()
                    const todayMD = `${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
                    const isToday = md === todayMD
                    const [m, d] = md.split('-')
                    const label = new Date(`2000-${m}-${d}T00:00:00`).toLocaleDateString('da-DK', { day: 'numeric', month: 'long' })
                    return (
                      <div key={md} className="flex flex-col gap-1">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-white/40">
                          {isToday ? `I dag · ${label}` : label}
                        </p>
                        {entries.map((e: any) => (
                          <div key={e.id} className="py-2.5 border-b border-white/[0.06] last:border-0">
                            <p className="text-sm font-medium">
                              <span className="text-white/40 font-normal tabular-nums mr-2">{e.date.slice(0, 4)}</span>
                              {e.title}
                            </p>
                            {e.description && (
                              <p className="text-xs text-white/45 mt-0.5 leading-relaxed line-clamp-2">{e.description}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

          </div>
        </section>

      </main>

      <SiteFooter />
    </div>
  )
}
