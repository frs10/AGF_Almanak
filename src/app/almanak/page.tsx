import type { Metadata } from 'next'
import { supabase } from '@/lib/supabase'
import SiteHeader from '@/components/SiteHeader'
import SiteFooter from '@/components/SiteFooter'
import AlmanakClient from './AlmanakClient'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Almanakken – Hvid Røg',
  description:
    "Store øjeblikke, små ulykker og ét motorvejstoilet. Dag for dag i AGF's historie. Præsenteret af Hvid Røg.",
}

async function getDates() {
  const { data, error } = await supabase
    .from('dates')
    .select('*')
    .order('date', { ascending: true })

  if (error) {
    console.error('Error fetching dates:', error)
    return []
  }
  return data ?? []
}

export default async function AlmanakPage() {
  const dates = await getDates()

  return (
    <div className="min-h-screen bg-agf-blue flex flex-col">
      <SiteHeader />
      <AlmanakClient dates={dates} />
      <SiteFooter />
    </div>
  )
}
