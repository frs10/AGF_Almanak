'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { WorkType } from '@/lib/supabase'

const WORK_TYPES: { value: WorkType; label: string }[] = [
  { value: 'bog', label: 'Bog' },
  { value: 'digt', label: 'Digt' },
  { value: 'sang', label: 'Sang' },
  { value: 'essay', label: 'Essay/artikel' },
  { value: 'brev', label: 'Besked/brev' },
  { value: 'andet', label: 'Andet' },
]

export type WorkFormData = {
  title: string
  slug: string
  type: WorkType
  published_year: string
  link: string
  paywall: boolean
  shelf_mark: string
  bibliotek_dk_url: string
  notes: string
  // author fields
  author_name: string
  author_role: string
}

const EMPTY: WorkFormData = {
  title: '', slug: '', type: 'bog', published_year: '',
  link: '', paywall: false, shelf_mark: '', bibliotek_dk_url: '',
  notes: '', author_name: '', author_role: 'forfatter',
}

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/æ/g, 'ae').replace(/ø/g, 'oe').replace(/å/g, 'aa')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

interface Props {
  initial?: Partial<WorkFormData>
  workId?: string // if set = edit mode
}

export default function WorkForm({ initial, workId }: Props) {
  const router = useRouter()
  const [form, setForm] = useState<WorkFormData>({ ...EMPTY, ...initial })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function set(field: keyof WorkFormData, value: string | boolean) {
    setForm((prev) => {
      const next = { ...prev, [field]: value }
      // auto-slug from title when creating
      if (field === 'title' && !workId) {
        next.slug = slugify(value as string)
      }
      return next
    })
  }

  async function save() {
    setSaving(true)
    setError(null)

    const payload = {
      title: form.title.trim(),
      slug: form.slug.trim(),
      type: form.type,
      published_year: form.published_year ? parseInt(form.published_year) : null,
      link: form.link.trim() || null,
      paywall: form.paywall,
      shelf_mark: form.shelf_mark.trim() || null,
      bibliotek_dk_url: form.bibliotek_dk_url.trim() || null,
      notes: form.notes.trim() || null,
    }

    let workIdResult = workId

    if (workId) {
      // Update
      const { error } = await supabase.from('works').update(payload).eq('id', workId)
      if (error) { setError(error.message); setSaving(false); return }
    } else {
      // Insert
      const { data, error } = await supabase.from('works').insert(payload).select('id').single()
      if (error) { setError(error.message); setSaving(false); return }
      workIdResult = data.id

      // Link author if provided
      if (form.author_name.trim()) {
        // Upsert person
        let personId: string
        const { data: existing } = await supabase
          .from('persons')
          .select('id')
          .ilike('name', form.author_name.trim())
          .maybeSingle()

        if (existing) {
          personId = existing.id
        } else {
          const { data: newPerson, error: pErr } = await supabase
            .from('persons')
            .insert({ name: form.author_name.trim() })
            .select('id')
            .single()
          if (pErr) { setError(pErr.message); setSaving(false); return }
          personId = newPerson.id
        }

        await supabase.from('work_authors').insert({
          work_id: workIdResult,
          person_id: personId,
          role: form.author_role || 'forfatter',
        })
      }
    }

    router.push(`/admin/hjoernet/${workIdResult}`)
  }

  const inputCls = 'w-full px-4 py-2.5 rounded-xl bg-white/10 border border-white/40 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-agf-gold text-sm'
  const labelCls = 'flex flex-col gap-1.5'
  const labelTextCls = 'text-xs font-medium uppercase tracking-wide text-white/60'

  return (
    <div className="flex flex-col gap-6 max-w-xl">
      {error && <p className="text-agf-error text-sm p-4 rounded-xl bg-agf-error/10">{error}</p>}

      <div className={labelCls}>
        <span className={labelTextCls}>Titel *</span>
        <input className={inputCls} value={form.title} onChange={(e) => set('title', e.target.value)} placeholder="f.eks. Vinterbørn" />
      </div>

      <div className={labelCls}>
        <span className={labelTextCls}>Slug *</span>
        <input className={inputCls} value={form.slug} onChange={(e) => set('slug', e.target.value)} placeholder="vinterboern" />
        <span className="text-white/40 text-xs">Bruges i URL. Auto-genereres fra titel.</span>
      </div>

      <div className={labelCls}>
        <span className={labelTextCls}>Type *</span>
        <select
          className={inputCls + ' bg-agf-blue'}
          value={form.type}
          onChange={(e) => set('type', e.target.value as WorkType)}
        >
          {WORK_TYPES.map((t) => (
            <option key={t.value} value={t.value} className="bg-agf-blue text-white">{t.label}</option>
          ))}
        </select>
      </div>

      <div className={labelCls}>
        <span className={labelTextCls}>Udgivelsesår</span>
        <input className={inputCls} type="number" value={form.published_year} onChange={(e) => set('published_year', e.target.value)} placeholder="f.eks. 1987" />
      </div>

      {!workId && (
        <>
          <div className={labelCls}>
            <span className={labelTextCls}>Forfatter/ophavsmand</span>
            <input className={inputCls} value={form.author_name} onChange={(e) => set('author_name', e.target.value)} placeholder="f.eks. Tove Ditlevsen" />
            <span className="text-white/40 text-xs">Opslås eller oprettes automatisk i persons-tabellen.</span>
          </div>
          <div className={labelCls}>
            <span className={labelTextCls}>Rolle</span>
            <select className={inputCls + ' bg-agf-blue'} value={form.author_role} onChange={(e) => set('author_role', e.target.value)}>
              <option value="forfatter" className="bg-agf-blue text-white">Forfatter</option>
              <option value="redaktør" className="bg-agf-blue text-white">Redaktør</option>
              <option value="komponist" className="bg-agf-blue text-white">Komponist</option>
              <option value="tekstforfatter" className="bg-agf-blue text-white">Tekstforfatter</option>
            </select>
          </div>
        </>
      )}

      <hr className="border-white/10" />

      <div className={labelCls}>
        <span className={labelTextCls}>Link (URL til tekst/sang)</span>
        <input className={inputCls} value={form.link} onChange={(e) => set('link', e.target.value)} placeholder="https://…" />
      </div>

      <label className="flex items-center gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={form.paywall}
          onChange={(e) => set('paywall', e.target.checked)}
          className="w-4 h-4 rounded accent-agf-gold"
        />
        <span className="text-sm">Betalingsmur</span>
      </label>

      <div className={labelCls}>
        <span className={labelTextCls}>Opstillingsgruppe (hyldemærke)</span>
        <input className={inputCls} value={form.shelf_mark} onChange={(e) => set('shelf_mark', e.target.value)} placeholder="f.eks. Sk 84.8" />
      </div>

      <div className={labelCls}>
        <span className={labelTextCls}>bibliotek.dk URL</span>
        <input className={inputCls} value={form.bibliotek_dk_url} onChange={(e) => set('bibliotek_dk_url', e.target.value)} placeholder="https://bibliotek.dk/…" />
      </div>

      <div className={labelCls}>
        <span className={labelTextCls}>Note fra bibliotekaren</span>
        <textarea
          className={inputCls + ' resize-y min-h-[80px]'}
          value={form.notes}
          onChange={(e) => set('notes', e.target.value)}
          placeholder="Valgfri note om værket…"
        />
      </div>

      <div className="flex gap-3 pt-2">
        <button
          onClick={save}
          disabled={saving || !form.title || !form.slug}
          className="px-6 py-2.5 rounded-xl bg-agf-gold text-agf-blue font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-40"
        >
          {saving ? 'Gemmer…' : workId ? 'Gem ændringer' : 'Opret værk'}
        </button>
        <button
          onClick={() => router.back()}
          className="px-6 py-2.5 rounded-xl border border-white/20 text-sm hover:bg-white/10 transition-colors"
        >
          Annullér
        </button>
      </div>
    </div>
  )
}
