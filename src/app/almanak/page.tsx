import type { Metadata } from 'next'
import { supabase } from '@/lib/supabase'
import SiteHeader from '@/components/SiteHeader'
import SiteFooter from '@/components/SiteFooter'
import AlmanakClient from './AlmanakClient'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Almanakken – Hvid Røg',
  description:
    "Store øjeblikke, nære nedture og ét motorvejstoilet. Dag for dag i AGF's historie. Præsenteret af Hvid Røg.",
  openGraph: {
    title: 'Almanakken – Hvid Røg',
    description:
      "Store øjeblikke, nære nedture og ét motorvejstoilet. Dag for dag i AGF's historie.",
    url: 'https://hvidrøg.dk/almanak',
    siteName: 'Hvid Røg',
    locale: 'da_DK',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Almanakken – Hvid Røg',
    description:
      "Store øjeblikke, nære nedture og ét motorvejstoilet. Dag for dag i AGF's historie.",
  },
}

async function getDates() {
  const { data, error } = await supabase
    .from('dates')
    .select('*')
    .order('date', { ascending: true })

  if (error) {
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
