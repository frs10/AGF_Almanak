'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { WorkType } from '@/lib/supabase'
import SiteHeader from '@/components/SiteHeader'
import WorkForm, { WorkFormData } from '../WorkForm'

type Appearance = {
  id: string
  episode_date: string
  is_revisit: boolean
  extra_info: string | null
}

type Author = {
  person_id: string
  role: string
  persons: { id: string; name: string } | null
}

export default function RedigerVaerkPage() {
  const router = useRouter()
  const { id } = useParams<{ id: string }>()

  const [loading, setLoading] = useState(true)
  const [initial, setInitial] = useState<Partial<WorkFormData> | null>(null)
  const [appearances, setAppearances] = useState<Appearance[]>([])
  const [authors, setAuthors] = useState<Author[]>([])
  const [error, setError] = useState<string | null>(null)

  // New appearance form
  const [newDate, setNewDate] = useState('')
  const [newInfo, setNewInfo] = useState('')
  const [addingApp, setAddingApp] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) { router.push('/admin'); return }
      fetchWork()
    })
  }, [])

  async function fetchWork() {
    const { data, error } = await supabase
      .from('works')
      .select(`
        id, title, slug, type, published_year, link, paywall,
        shelf_mark, bibliotek_dk_url, notes,
        appearances ( id, episode_date, is_revisit, extra_info ),
        work_authors ( person_id, role, persons ( id, name ) )
      `)
      .eq('id', id)
      .single()

    if (error || !data) { setError('Værket blev ikke fundet'); setLoading(false); return }

    setInitial({
      title: data.title,
      slug: data.slug,
      type: data.type as WorkType,
      published_year: data.published_year?.toString() ?? '',
      link: data.link ?? '',
      paywall: data.paywall,
      shelf_mark: data.shelf_mark ?? '',
      bibliotek_dk_url: data.bibliotek_dk_url ?? '',
      notes: data.notes ?? '',
    })

    const rawApps = Array.isArray(data.appearances) ? data.appearances : []
    setAppearances(rawApps.sort((a: Appearance, b: Appearance) =>
      new Date(b.episode_date).getTime() - new Date(a.episode_date).getTime()
    ))

    const rawAuthors = Array.isArray(data.work_authors) ? data.work_authors : []
    setAuthors(rawAuthors.map((wa: any) => ({
      ...wa,
      persons: Array.isArray(wa.persons) ? (wa.persons[0] ?? null) : wa.persons,
    })))

    setLoading(false)
  }

  async function addAppearance() {
    if (!newDate) return
    setAddingApp(true)
    const { data, error } = await supabase
      .from('appearances')
      .insert({ work_id: id, episode_date: newDate, extra_info: newInfo.trim() || null })
      .select('id, episode_date, is_revisit, extra_info')
      .single()
    if (error) { setError(error.message); setAddingApp(false); return }
    setAppearances((prev) =>
      [data, ...prev].sort((a, b) =>
        new Date(b.episode_date).getTime() - new Date(a.episode_date).getTime()
      )
    )
    setNewDate('')
    setNewInfo('')
    setAddingApp(false)
  }

  async function deleteAppearance(appId: string) {
    if (!confirm('Fjern dette afsnit fra Hjørnet?')) return
    const { error } = await supabase.from('appearances').delete().eq('id', appId)
    if (error) { alert(error.message); return }
    setAppearances((prev) => prev.filter((a) => a.id !== appId))
  }

  function formatDate(dateStr: string) {
    const d = new Date(dateStr + 'T00:00:00')
    return d.toLocaleDateString('da-DK', { day: 'numeric', month: 'long', year: 'numeric' })
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center text-white/60">Henter…</div>
  if (!initial) return <div className="min-h-screen flex items-center justify-center text-agf-error">{error}</div>

  const inputCls = 'px-4 py-2.5 rounded-xl bg-white/10 border border-white/40 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-agf-gold text-sm'

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1 max-w-4xl mx-auto w-full px-5 md:px-8 py-10 flex flex-col gap-10">
        <nav className="flex gap-2 items-center text-sm text-white/60">
          <Link href="/admin/hjoernet" className="hover:text-white transition-colors">Hjørnet</Link>
          <span>/</span>
          <span className="truncate">{initial.title}</span>
        </nav>

        {error && <p className="text-agf-error text-sm">{error}</p>}

        {/* Work form */}
        <section className="flex flex-col gap-6">
          <h1 className="text-2xl font-semibold">Redigér værk</h1>
          <WorkForm initial={initial} workId={id} />
        </section>

        <hr className="border-white/10" />

        {/* Authors */}
        <section className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold">Ophavsmænd</h2>
          {authors.length === 0 ? (
            <p className="text-white/50 text-sm">Ingen tilknyttede ophavsmænd.</p>
          ) : (
            <div className="flex flex-col divide-y divide-white/10">
              {authors.map((a) => (
                <div key={a.person_id} className="py-3 flex items-center justify-between gap-4">
                  <span>{a.persons?.name ?? '–'} <span className="text-white/50 text-sm">({a.role})</span></span>
                  <Link
                    href={`/hjoernet/forfatter/${a.person_id}`}
                    target="_blank"
                    className="text-sm text-white/50 hover:text-white transition-colors"
                  >
                    Se side ↗
                  </Link>
                </div>
              ))}
            </div>
          )}
        </section>

        <hr className="border-white/10" />

        {/* Appearances */}
        <section className="flex flex-col gap-6">
          <h2 className="text-lg font-semibold">Afsnit i podcasten</h2>

          {/* Add new */}
          <div className="flex flex-wrap gap-3 items-end p-5 rounded-xl bg-white/5 border border-white/10">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium uppercase tracking-wide text-white/60">Episodedato *</label>
              <input
                type="date"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                className={inputCls}
              />
            </div>
            <div className="flex flex-col gap-1.5 flex-1 min-w-[180px]">
              <label className="text-xs font-medium uppercase tracking-wide text-white/60">Ekstra info (valgfri)</label>
              <input
                type="text"
                value={newInfo}
                onChange={(e) => setNewInfo(e.target.value)}
                placeholder="f.eks. 'Særafsnittet om…'"
                className={inputCls + ' w-full'}
              />
            </div>
            <button
              onClick={addAppearance}
              disabled={addingApp || !newDate}
              className="px-5 py-2.5 rounded-xl bg-agf-gold text-agf-blue font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-40"
            >
              {addingApp ? 'Tilføjer…' : '+ Tilføj afsnit'}
            </button>
          </div>

          {/* List */}
          {appearances.length === 0 ? (
            <p className="text-white/50 text-sm">Ingen afsnit registreret endnu.</p>
          ) : (
            <div className="flex flex-col divide-y divide-white/10">
              {appearances.map((a) => (
                <div key={a.id} className="py-4 flex items-center justify-between gap-4">
                  <div className="flex flex-col gap-0.5">
                    <span className="font-medium">{formatDate(a.episode_date)}</span>
                    <span className="text-white/50 text-sm">
                      {a.is_revisit ? 'Genbesøg' : 'Første gang'}
                      {a.extra_info ? ` · ${a.extra_info}` : ''}
                    </span>
                  </div>
                  <button
                    onClick={() => deleteAppearance(a.id)}
                    className="text-sm text-white/40 hover:text-agf-error transition-colors"
                  >
                    Fjern
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  )
}
