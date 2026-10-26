import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type DateEntry = {
  id: string
  date: string
  title: string
  description: string
  persons: string[]
  created_at: string
  created_by: string
}

export type Suggestion = {
  id: string
  date: string
  title: string
  description: string
  persons: string[]
  reason: string
  suggested_by: string
  status: 'pending' | 'approved' | 'ignored'
  created_at: string
}

// --- Det Litterære Hjørne ---

export type WorkType = 'bog' | 'digt' | 'sang' | 'essay' | 'brev' | 'andet'

export type Work = {
  id: string
  slug: string
  title: string
  type: WorkType
  published_year: number | null
  link: string | null
  paywall: boolean
  shelf_mark: string | null
  bibliotek_dk_url: string | null
  notes: string | null
  created_at: string
  // joined
  authors?: WorkAuthor[]
  appearances?: Appearance[]
}

export type WorkAuthor = {
  work_id: string
  person_id: string
  role: string
  // joined from persons table
  person?: {
    id: string
    name: string
    slug?: string
  }
}

export type Appearance = {
  id: string
  work_id: string
  episode_date: string
  is_revisit: boolean
  extra_info: string | null
}
