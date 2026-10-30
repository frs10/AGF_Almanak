import { Metadata } from 'next'
import HjoernetClient from './HjoernetClient'
import { supabase } from '@/lib/supabase'
import { Work, Appearance } from '@/lib/supabase'

export const revalidate = 3600 // revalidér hver time

export const metadata: Metadata = {
  title: 'Det Litterære Hjørne – Hvid Røg',
  description:
    'I hvert afsnit bliver der læst noget op. Her er det hele, nyeste først.',
}

// Fetch all appearances with work + author data
async function getAppearancesWithWorks() {
  const { data, error } = await supabase
    .from('appearances')
    .select(
      `
      id,
      work_id,
      episode_date,
      is_revisit,
      extra_info,
      works (
        id,
        slug,
        title,
        type,
        published_year,
        link,
        paywall,
        shelf_mark,
        bibliotek_dk_url,
        work_authors (
          role,
          persons ( id, name )
        )
      )
    `
    )
    .order('episode_date', { ascending: false })

  if (error) {
    return []
  }
  return data ?? []
}

async function getAuthors() {
  const { data } = await supabase
    .from('persons')
    .select('id, name')
    .order('name')
  return data ?? []
}

export default async function HjoernetPage() {
  const [rawAppearances, authors] = await Promise.all([
    getAppearancesWithWorks(),
    getAuthors(),
  ])

  // Supabase returns nested one-to-many as arrays — normalise to single objects
  const appearances = rawAppearances.map((a) => {
    const works = Array.isArray(a.works) ? (a.works[0] ?? null) : a.works
    if (works && Array.isArray((works as any).work_authors)) {
      ;(works as any).work_authors = (works as any).work_authors.map((wa: any) => ({
        ...wa,
        persons: Array.isArray(wa.persons) ? (wa.persons[0] ?? null) : wa.persons,
      }))
    }
    return { ...a, works }
  }) as any

  return <HjoernetClient appearances={appearances} authors={authors} />
}
