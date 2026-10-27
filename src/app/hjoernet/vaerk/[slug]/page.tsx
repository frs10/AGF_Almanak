import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ExternalLink, Library } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import WorkTypeIcon from '@/components/hjoernet/WorkTypeIcon'
import { WorkType } from '@/lib/supabase'

const TYPE_LABELS: Record<WorkType, string> = {
  bog: 'Bog',
  digt: 'Digt',
  sang: 'Sang',
  essay: 'Essay/artikel',
  brev: 'Besked/brev',
  andet: 'Andet',
}

async function getWork(slug: string) {
  const { data, error } = await supabase
    .from('works')
    .select(
      `
      id, slug, title, type, published_year, link, paywall,
      shelf_mark, bibliotek_dk_url, notes,
      work_authors (
        role,
        persons ( id, name )
      ),
      appearances (
        id, episode_date, is_revisit, extra_info
      )
    `
    )
    .eq('slug', slug)
    .single()

  if (error || !data) {
    console.error('[vaerk] Supabase error:', JSON.stringify(error), 'data:', JSON.stringify(data))
    return null
  }
  return data
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const work = await getWork(slug)
  if (!work) return { title: 'Ikke fundet' }
  return {
    title: `${work.title} – Det Litterære Hjørne`,
  }
}

function formatDateLong(dateStr: string) {
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('da-DK', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

function formatDateShort(dateStr: string) {
  const d = new Date(dateStr + 'T00:00:00')
  const day = d.getDate().toString().padStart(2, '0')
  const month = (d.getMonth() + 1).toString().padStart(2, '0')
  return `${day}.${month}.${d.getFullYear()}`
}

export default async function VaerkPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const work = await getWork(slug)
  if (!work) notFound()

  const authors = work.work_authors ?? []
  const appearances = (work.appearances ?? []).sort(
    (a, b) => new Date(b.episode_date).getTime() - new Date(a.episode_date).getTime()
  )

  const authorLinks = authors
    .map((a) => {
      const p = Array.isArray(a.persons) ? (a.persons[0] ?? null) : a.persons
      return p ? { id: (p as any).id, name: (p as any).name, role: a.role } : null
    })
    .filter(Boolean) as { id: string; name: string; role: string }[]

  const authorDisplay = authorLinks
    .map((a) => (a.role === 'redaktør' ? `Red. ${a.name}` : a.name))
    .join(', ')

  const canLoan = !!(work.shelf_mark || work.bibliotek_dk_url)
  const appearedCount = appearances.length

  return (
    <main className="w-full max-w-[1200px] mx-auto px-5 md:px-8 pt-8 pb-24 box-border flex flex-col gap-10">
      {/* Breadcrumb */}
      <nav aria-label="Brødkrumme" className="flex gap-2 items-center text-[14px] text-white/60">
        <Link href="/hjoernet" className="text-white/70 hover:text-white no-underline transition-colors">
          Det Litterære Hjørne
        </Link>
        <span aria-hidden="true">/</span>
        <span>{work.title}</span>
      </nav>

      <div className="flex flex-wrap gap-10 md:gap-16 items-start">
        {/* Main content */}
        <div className="flex-[999_1_520px] min-w-0 flex flex-col gap-12">
          {/* Title section */}
          <section className="flex flex-col gap-4 md:gap-[18px]">
            <span className="flex gap-2.5 items-center text-white/70 text-sm">
              <WorkTypeIcon type={work.type as WorkType} />
              {TYPE_LABELS[work.type as WorkType]}
            </span>
            <h1 className="m-0 text-[36px] md:text-[52px] font-semibold leading-[1.1] md:leading-[1.05] tracking-tight">
              {work.title}
            </h1>
            {authorDisplay && (
              <p className="m-0 text-[18px] text-white/70">
                {authorLinks.length === 1 ? (
                  <Link
                    href={`/hjoernet/forfatter/${authorLinks[0].id}`}
                    className="text-white underline underline-offset-[3px] hover:text-white/80 transition-colors"
                  >
                    {authorDisplay}
                  </Link>
                ) : (
                  authorDisplay
                )}
              </p>
            )}

            {/* Meta dl */}
            <dl className="mt-3 pt-5 border-t border-white/10 grid grid-cols-2 md:grid-cols-[repeat(auto-fit,minmax(140px,1fr))] gap-4">
              {work.published_year && (
                <div className="flex flex-col gap-0.5">
                  <dt className="text-[13px] text-white/60">Udgivet</dt>
                  <dd className="m-0 text-[18px]">{work.published_year}</dd>
                </div>
              )}
              <div className="flex flex-col gap-0.5">
                <dt className="text-[13px] text-white/60">Type</dt>
                <dd className="m-0 text-[18px]">{TYPE_LABELS[work.type as WorkType]}</dd>
              </div>
              <div className="flex flex-col gap-0.5">
                <dt className="text-[13px] text-white/60">I podcasten</dt>
                <dd className="m-0 text-[18px]">{appearedCount} {appearedCount === 1 ? 'gang' : 'gange'}</dd>
              </div>
              {appearances[0] && (
                <div className="flex flex-col gap-0.5">
                  <dt className="text-[13px] text-white/60">Senest</dt>
                  <dd className="m-0 text-[18px]">{formatDateShort(appearances[0].episode_date)}</dd>
                </div>
              )}
            </dl>
          </section>

          {/* Appearances timeline */}
          {appearances.length > 0 && (
            <section className="flex flex-col gap-3">
              <h2 className="m-0 text-[13px] font-medium tracking-[0.06em] uppercase text-white/60">
                I podcasten
              </h2>
              <ol
                className="m-0 ml-[5px] p-0 pl-6 border-l border-white/20 list-none flex flex-col"
                style={{ listStyle: 'none' }}
              >
                {appearances.map((a, idx) => (
                  <li
                    key={a.id}
                    className="relative py-[14px] grid grid-cols-[160px_minmax(0,1fr)] gap-4 items-baseline"
                  >
                    {/* Timeline dot */}
                    <span
                      aria-hidden="true"
                      className={[
                        'absolute left-[-29px] top-[22px] w-[9px] h-[9px] rounded-full',
                        idx === 0
                          ? 'bg-white'
                          : 'bg-agf-blue border border-white/40 box-border',
                      ].join(' ')}
                    />
                    <span className="text-[16px]">
                      {formatDateLong(a.episode_date)}
                    </span>
                    <span className="text-white/70">
                      {a.is_revisit ? 'Genbesøg' : 'Første gang i Hjørnet'}
                      {a.extra_info ? ` · ${a.extra_info}` : ''}
                    </span>
                  </li>
                ))}
              </ol>
            </section>
          )}

          {/* Librarian notes */}
          {work.notes && (
            <section className="flex flex-col gap-3 max-w-2xl">
              <h2 className="m-0 text-[13px] font-medium tracking-[0.06em] uppercase text-white/60">
                Fra bibliotekaren
              </h2>
              <p className="m-0 text-[18px] leading-[1.6] text-[#E7E8EC]">
                {work.notes}
              </p>
            </section>
          )}

          {/* External link */}
          {work.link && (
            <a
              href={work.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors no-underline text-sm"
            >
              <ExternalLink size={16} strokeWidth={1.5} />
              {work.paywall ? 'Artiklen (betalingsmur)' : 'Læs teksten her'}
            </a>
          )}
        </div>

        {/* Loan box */}
        {canLoan && (
          <aside className="flex-[1_1_340px] max-w-[400px] flex flex-col gap-4">
            <section
              aria-labelledby="dlaan"
              className="p-8 md:p-[32px_28px] rounded-xl bg-white text-agf-blue flex flex-col gap-[18px]"
            >
              <div className="flex gap-2.5 items-center">
                <Library size={22} strokeWidth={1.5} aria-hidden="true" />
                <h2 id="dlaan" className="m-0 text-[20px] font-semibold">
                  Sådan låner du den
                </h2>
              </div>
              <p className="m-0 text-[15px] text-[#3A4560]">
                {work.type === 'bog'
                  ? 'Bogen står på hylden under opstillingsgruppe'
                  : 'Kan hentes på biblioteket – opstillingsgruppe'}
              </p>
              {work.shelf_mark && (
                <div className="text-[56px] font-medium leading-none tracking-tight">
                  {work.shelf_mark}
                </div>
              )}
              <p className="m-0 text-[14px] text-[#3A4560]">
                Spørg på dit lokale bibliotek, eller bestil den hjem dertil.
              </p>
              {work.bibliotek_dk_url && (
                <a
                  href={work.bibliotek_dk_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-[52px] rounded-xl bg-agf-blue text-white flex items-center justify-center gap-2 text-[15px] font-medium no-underline hover:opacity-90 transition-opacity"
                >
                  Find den på bibliotek.dk
                  <ExternalLink size={16} strokeWidth={1.5} aria-hidden="true" />
                </a>
              )}
            </section>
            <p className="m-0 px-1 text-[13px] text-white/60">
              Vi viser kun oplysninger om værket, aldrig selve teksten. Den må du låne dig til.
            </p>
          </aside>
        )}
      </div>
    </main>
  )
}
