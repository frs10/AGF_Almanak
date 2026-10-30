'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { WorkType } from '@/lib/supabase'
import SiteHeader from '@/components/SiteHeader'

const TYPE_LABELS: Record<WorkType, string> = {
  bog: 'Bog',
  digt: 'Digt',
  sang: 'Sang',
  essay: 'Essay/artikel',
  brev: 'Besked/brev',
  andet: 'Andet',
}

type WorkRow = {
  id: string
  slug: string
  title: string
  type: WorkType
  published_year: number | null
  appearances: { id: string }[]
}

export default function AdminHjoernetPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [works, setWorks] = useState<WorkRow[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) { router.push('/admin'); return }
      fetchWorks()
    })
  }, [])

  async function fetchWorks() {
    const { data, error } = await supabase
      .from('works')
      .select('id, slug, title, type, published_year, appearances(id)')
      .order('title')
    if (error) { setError(error.message); setLoading(false); return }
    setWorks((data ?? []).map((w) => ({
      ...w,
      appearances: Array.isArray(w.appearances) ? w.appearances : [],
    })))
    setLoading(false)
  }

  async function deleteWork(id: string, title: string) {
    if (!confirm(`Slet "${title}"? Dette kan ikke fortrydes.`)) return
    const { error } = await supabase.from('works').delete().eq('id', id)
    if (error) { alert('Fejl: ' + error.message); return }
    setWorks((prev) => prev.filter((w) => w.id !== id))
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center text-white/60">Henter…</div>

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1 max-w-4xl mx-auto w-full px-5 md:px-8 py-10 flex flex-col gap-8">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold">Det Litterære Hjørne</h1>
            <p className="text-white/60 text-sm mt-1">{works.length} værker registreret</p>
          </div>
          <Link
            href="/admin/hjoernet/ny"
            className="px-5 py-2.5 rounded-xl bg-agf-gold text-agf-blue font-semibold text-sm hover:opacity-90 transition-opacity"
          >
            + Nyt værk
          </Link>
        </div>

        {error && <p className="text-agf-error text-sm">{error}</p>}

        <div className="flex flex-col divide-y divide-white/10">
          {works.length === 0 && (
            <p className="py-10 text-center text-white/50">Ingen værker endnu — tilføj det første.</p>
          )}
          {works.map((w) => (
            <div key={w.id} className="py-4 flex items-center justify-between gap-4">
              <div className="flex flex-col gap-0.5 min-w-0">
                <span className="font-medium truncate">{w.title}</span>
                <span className="text-white/50 text-sm">
                  {TYPE_LABELS[w.type]}
                  {w.published_year ? ` · ${w.published_year}` : ''}
                  {' · '}
                  {w.appearances.length} {w.appearances.length === 1 ? 'afsnit' : 'afsnit'}
                </span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Link
                  href={`/admin/hjoernet/${w.id}`}
                  className="px-4 py-1.5 rounded-lg border border-white/20 text-sm hover:bg-white/10 transition-colors"
                >
                  Redigér
                </Link>
                <button
                  onClick={() => deleteWork(w.id, w.title)}
                  className="px-4 py-1.5 rounded-lg border border-white/20 text-sm text-white/50 hover:text-agf-error hover:border-agf-error transition-colors"
                >
                  Slet
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
