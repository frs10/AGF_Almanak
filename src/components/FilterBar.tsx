'use client'

const MONTHS = [
  { value: 1, label: 'Januar' },
  { value: 2, label: 'Februar' },
  { value: 3, label: 'Marts' },
  { value: 4, label: 'April' },
  { value: 5, label: 'Maj' },
  { value: 6, label: 'Juni' },
  { value: 7, label: 'Juli' },
  { value: 8, label: 'August' },
  { value: 9, label: 'September' },
  { value: 10, label: 'Oktober' },
  { value: 11, label: 'November' },
  { value: 12, label: 'December' },
]

type FilterBarProps = {
  showTodayInHistory: boolean
  onTodayInHistoryChange: (value: boolean) => void
  selectedMonth: number | null
  onMonthChange: (month: number | null) => void
  searchQuery: string
  onSearchChange: (query: string) => void
}

export default function FilterBar({
  showTodayInHistory,
  onTodayInHistoryChange,
  selectedMonth,
  onMonthChange,
  searchQuery,
  onSearchChange,
}: FilterBarProps) {
  return (
    <div className="bg-agf-blue-dark/90 backdrop-blur-sm border-b border-agf-gold/20 sticky top-[64px] z-40">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row gap-3 md:gap-4 md:items-center">
          {/* Today in history toggle */}
          <button
            onClick={() => onTodayInHistoryChange(!showTodayInHistory)}
            className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm transition-all ${
              showTodayInHistory
                ? 'bg-agf-blue text-agf-gold shadow-md'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Hvad skete i dag?
          </button>

          {/* Month filter */}
          <div className="relative flex-1 md:max-w-[200px]">
            <select
              value={selectedMonth ?? ''}
              onChange={(e) => onMonthChange(e.target.value ? Number(e.target.value) : null)}
              className="w-full appearance-none bg-white/10 text-white px-4 py-2.5 pr-10 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-agf-gold/50 cursor-pointer"
            >
              <option value="">Alle måneder</option>
              {MONTHS.map((month) => (
                <option key={month.value} value={month.value}>
                  {month.label}
                </option>
              ))}
            </select>
            <svg
              className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50 pointer-events-none"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>

          {/* Search input */}
          <div className="relative flex-1 md:max-w-[300px]">
            <input
              type="text"
              placeholder="Søg i titler og beskrivelser..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full bg-white/10 text-white px-4 py-2.5 pl-10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-agf-gold/50 placeholder:text-white/50"
            />
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          {/* Clear filters */}
          {(showTodayInHistory || selectedMonth || searchQuery) && (
            <button
              onClick={() => {
                onTodayInHistoryChange(false)
                onMonthChange(null)
                onSearchChange('')
              }}
              className="text-agf-gold text-sm font-medium hover:underline"
            >
              Ryd filtre
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
