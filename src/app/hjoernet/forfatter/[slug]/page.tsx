import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { WorkType } from '@/lib/supabase'

const TYPE_LABELS: Record<WorkType, string> = {
  bog: 'Bog',
  digt: 'Digt',
  sang: 'Sang',
  essay: 'Essay/artikel',
  brev: 'Besked/brev',
  andet: 'Andet',
}

async function getPerson(id: string) {
  const { data: person } = await supabase
    .from('persons')
    .select('id, name')
    .eq('id', id)
    .single()

  if (!person) return null

  // Works by this person
  const { data: workAuthors } = await supabase
    .from('work_authors')
    .select(
      `
      role,
      works (
        id, slug, title, type, published_year,
        shelf_mark, bibliotek_dk_url,
        appearances ( id, episode_date, is_revisit )
      )
    `
    )
    .eq('person_id', id)

  return { person, workAuthors: workAuthors ?? [] }
}

// Also fetch almanac entries for this person
async function getAlmanacEntries(personName: string) {
  const { data } = await supabase
    .from('dates')
    .select('id, date, title, description')
    .contains('persons', [personName])
    .order('date')
    .limit(5)
  return data ?? []
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const result = await getPerson(slug)
  if (!result) return { title: 'Ikke fundet' }
  return {
    title: `${result.person.name} – Det Litterære Hjørne`,
  }
}

function formatDateShort(dateStr: string) {
  const d = new Date(dateStr + 'T00:00:00')
  const day = d.getDate().toString().padStart(2, '0')
  const month = (d.getMonth() + 1).toString().padStart(2, '0')
  return `${day}.${month}.${d.getFullYear()}`
}

export default async function ForfatterPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const result = await getPerson(slug)
  if (!result) notFound()

  const { person, workAuthors } = result

  // Collect works + their appearances
  // Supabase returns nested one-to-one as array — normalise to single object
  const works = workAuthors
    .map((wa) => {
      const w = Array.isArray(wa.works) ? wa.works[0] : wa.works
      return w ? { ...w, role: wa.role } : null
    })
    .filter(Boolean)
    .map((w) => ({
      ...w!,
      appearances: ((w as any).appearances ?? []).sort(
        (a: any, b: any) =>
          new Date(b.episode_date).getTime() - new Date(a.episode_date).getTime()
      ),
    }))

  const totalAppearances = works.reduce(
    (sum, w) => sum + w.appearances.length,
    0
  )

  const almanacEntries = await getAlmanacEntries(person.name)

  return (
    <main className="w-full max-w-[1200px] mx-auto px-5 md:px-8 pt-8 pb-24 box-border flex flex-col gap-12">
      {/* Breadcrumb */}
      <nav aria-label="Brødkrumme" className="flex gap-2 items-center text-[14px] text-white/60">
        <Link href="/hjoernet" className="text-white/70 hover:text-white no-underline transition-colors">
          Det Litterære Hjørne
        </Link>
        <span aria-hidden="true">/</span>
        <span>Forfattere</span>
      </nav>

      {/* Header */}
      <section className="flex flex-wrap justify-between items-end gap-6 pb-8 border-b border-white/10">
        <div className="flex flex-col gap-3">
          <span className="text-[12px] tracking-[0.08em] uppercase text-white/60">
            Forfatter
          </span>
          <h1 className="m-0 text-[48px] md:text-[64px] font-semibold tracking-tight leading-none">
            {person.name}
          </h1>
        </div>
        <p className="m-0 text-[18px] text-white/70">
          {works.length} {works.length === 1 ? 'værk' : 'værker'} ·{' '}
          læst op {totalAppearances} {totalAppearances === 1 ? 'gang' : 'gange'}
        </p>
      </section>

      {/* Two-col grid */}
      <div className="grid grid-cols-1 md:grid-cols-[repeat(auto-fit,minmax(min(460px,100%),1fr))] gap-12">
        {/* Works in Hjørnet */}
        <section className="flex flex-col gap-3 md:gap-[14px]">
          <h2 className="m-0 text-[13px] font-medium tracking-[0.06em] uppercase text-white/60">
            I Hjørnet
          </h2>
          {works.length === 0 ? (
            <p className="text-white/60 text-sm">Ingen registrerede værker endnu.</p>
          ) : (
            works.map((w) => {
              const canLoan = !!(w.shelf_mark || w.bibliotek_dk_url)
              return (
                <Link
                  key={w.id}
                  href={`/hjoernet/vaerk/${w.slug}`}
                  className="p-7 rounded-xl bg-white/10 border border-white/20 no-underline text-white flex flex-col gap-[18px] hover:bg-white/15 transition-colors"
                >
                  <span className="flex justify-between items-start gap-3">
                    <span className="flex flex-col gap-1">
                      <span className="text-[26px] font-semibold tracking-tight leading-tight">
                        {w.title}
                      </span>
                      <span className="text-white/70">
                        {TYPE_LABELS[w.type as WorkType]}
                        {w.published_year ? ` · ${w.published_year}` : ''}
                      </span>
                    </span>
                    {canLoan && (
                      <span className="px-[10px] py-0.5 rounded-full border border-white/30 text-[12px] text-white/70 whitespace-nowrap">
                        Kan lånes
                      </span>
                    )}
                  </span>
                  {w.appearances.length > 0 && (
                    <span className="flex flex-wrap gap-2 text-[14px]">
                      {(w.appearances as { id: string; episode_date: string; is_revisit: boolean }[]).map((a) => (
                        <span
                          key={a.id}
                          className="px-3 py-1.5 rounded-md bg-white/15"
                        >
                          {formatDateShort(a.episode_date)}
                        </span>
                      ))}
                    </span>
                  )}
                </Link>
              )
            })
          )}
        </section>

        {/* Almanac entries */}
        {almanacEntries.length > 0 && (
          <section className="flex flex-col gap-3 md:gap-[14px]">
            <h2 className="m-0 text-[13px] font-medium tracking-[0.06em] uppercase text-white/60">
              Også i Almanakken
            </h2>
            <div className="flex flex-col border-t border-white/10">
              {almanacEntries.map((entry) => (
                <Link
                  key={entry.id}
                  href={`/almanak`}
                  className="py-5 grid grid-cols-[120px_minmax(0,1fr)] gap-5 border-b border-white/10 no-underline text-white hover:bg-white/5 transition-colors -mx-5 px-5 md:mx-0 md:px-0"
                >
                  <span className="text-white/70 text-sm">{entry.date}</span>
                  <span className="text-[17px] leading-snug">{entry.title}</span>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  )
}
