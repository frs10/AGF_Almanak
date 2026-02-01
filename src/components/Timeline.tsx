'use client'

import { useState, useEffect, useMemo } from 'react'
import { supabase, DateEntry } from '@/lib/supabase'
import TimelineItem from './TimelineItem'
import FilterBar from './FilterBar'

export default function Timeline() {
  const [entries, setEntries] = useState<DateEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Filter states
  const [showTodayInHistory, setShowTodayInHistory] = useState(false)
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetchEntries()
  }, [])

  async function fetchEntries() {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('dates')
        .select('*')
        .order('date', { ascending: false })

      if (error) throw error
      setEntries(data || [])
    } catch (err) {
      setError('Kunne ikke hente data. Prøv igen senere.')
      console.error('Error fetching entries:', err)
    } finally {
      setLoading(false)
    }
  }

  const today = new Date()
  const todayDay = today.getDate()
  const todayMonth = today.getMonth() + 1

  const filteredEntries = useMemo(() => {
    return entries.filter((entry) => {
      const entryDate = new Date(entry.date)
      const entryDay = entryDate.getDate()
      const entryMonth = entryDate.getMonth() + 1

      // Today in history filter
      if (showTodayInHistory) {
        if (entryDay !== todayDay || entryMonth !== todayMonth) {
          return false
        }
      }

      // Month filter
      if (selectedMonth && entryMonth !== selectedMonth) {
        return false
      }

      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        const matchesTitle = entry.title.toLowerCase().includes(query)
        const matchesDescription = entry.description.toLowerCase().includes(query)
        const matchesPersons = entry.persons?.some((p) =>
          p.toLowerCase().includes(query)
        )
        if (!matchesTitle && !matchesDescription && !matchesPersons) {
          return false
        }
      }

      return true
    })
  }, [entries, showTodayInHistory, selectedMonth, searchQuery, todayDay, todayMonth])

  // Check if entry is from today (same day and month)
  const isTodayInHistory = (entry: DateEntry) => {
    const entryDate = new Date(entry.date)
    return entryDate.getDate() === todayDay && entryDate.getMonth() + 1 === todayMonth
  }

  // Group entries by year
  const entriesByYear = useMemo(() => {
    const grouped: { [year: number]: DateEntry[] } = {}
    filteredEntries.forEach((entry) => {
      const year = new Date(entry.date).getFullYear()
      if (!grouped[year]) {
        grouped[year] = []
      }
      grouped[year].push(entry)
    })
    return grouped
  }, [filteredEntries])

  const years = Object.keys(entriesByYear)
    .map(Number)
    .sort((a, b) => b - a)

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-agf-blue border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Henter historiske begivenheder...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-agf-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Noget gik galt</h3>
          <p className="text-gray-500 mb-4">{error}</p>
          <button
            onClick={fetchEntries}
            className="bg-agf-blue text-white px-4 py-2 rounded-lg font-medium hover:bg-agf-blue-dark transition-colors"
          >
            Prøv igen
          </button>
        </div>
      </div>
    )
  }

  return (
    <>
      <FilterBar
        showTodayInHistory={showTodayInHistory}
        onTodayInHistoryChange={setShowTodayInHistory}
        selectedMonth={selectedMonth}
        onMonthChange={setSelectedMonth}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <main className="max-w-6xl mx-auto px-4 py-8">
        {filteredEntries.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {showTodayInHistory
                ? 'Ingen begivenheder fundet for denne dag'
                : 'Ingen begivenheder fundet'}
            </h3>
            <p className="text-gray-500">
              {showTodayInHistory
                ? `Der er ingen registrerede begivenheder for ${todayDay}. ${today.toLocaleDateString('da-DK', { month: 'long' })}`
                : 'Prøv at justere dine filtre eller søgekriterier'}
            </p>
          </div>
        ) : (
          <div className="space-y-12">
            {years.map((year) => (
              <section key={year}>
                <h2 className="text-2xl font-display font-bold text-agf-blue-dark mb-6 flex items-center gap-3">
                  <span className="bg-agf-blue text-agf-gold px-4 py-1 rounded-lg">{year}</span>
                  <span className="h-px flex-1 bg-agf-gold/30" />
                </h2>
                <div className="ml-4">
                  {entriesByYear[year].map((entry) => (
                    <TimelineItem
                      key={entry.id}
                      entry={entry}
                      isHighlighted={isTodayInHistory(entry)}
                    />
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}

        {/* Stats footer */}
        {filteredEntries.length > 0 && (
          <div className="mt-12 pt-8 border-t border-gray-100 text-center text-sm text-gray-500">
            Viser {filteredEntries.length} {filteredEntries.length === 1 ? 'begivenhed' : 'begivenheder'}
            {entries.length !== filteredEntries.length && ` af ${entries.length} totalt`}
          </div>
        )}
      </main>
    </>
  )
}
