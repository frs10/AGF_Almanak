import { Metadata } from 'next'
import HjoernetClient from './HjoernetClient'
import { supabase } from '@/lib/supabase'
import { Work, Appearance } from '@/lib/supabase'

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
    console.error('Error fetching appearances:', error)
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
  const [appearances, authors] = await Promise.all([
    getAppearancesWithWorks(),
    getAuthors(),
  ])

  return <HjoernetClient appearances={appearances} authors={authors} />
}
