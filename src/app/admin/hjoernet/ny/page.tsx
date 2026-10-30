'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import SiteHeader from '@/components/SiteHeader'
import WorkForm from '../WorkForm'

export default function NytVaerkPage() {
  const router = useRouter()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) router.push('/admin')
    })
  }, [])

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1 max-w-4xl mx-auto w-full px-5 md:px-8 py-10 flex flex-col gap-8">
        <nav className="flex gap-2 items-center text-sm text-white/60">
          <Link href="/admin/hjoernet" className="hover:text-white transition-colors">Hjørnet</Link>
          <span>/</span>
          <span>Nyt værk</span>
        </nav>
        <h1 className="text-2xl font-semibold">Nyt værk</h1>
        <WorkForm />
      </main>
    </div>
  )
}
