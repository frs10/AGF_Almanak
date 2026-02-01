'use client'

import { DateEntry } from '@/lib/supabase'

type TimelineItemProps = {
  entry: DateEntry
  isHighlighted?: boolean
}

export default function TimelineItem({ entry, isHighlighted = false }: TimelineItemProps) {
  const date = new Date(entry.date)
  const day = date.getDate()
  const month = date.toLocaleDateString('da-DK', { month: 'short' })
  const year = date.getFullYear()

  return (
    <div className={`relative pl-8 md:pl-12 pb-8 group ${isHighlighted ? 'animate-pulse-once' : ''}`}>
      {/* Timeline line */}
      <div className="absolute left-0 top-0 bottom-0 w-px bg-agf-gold/40 group-last:bg-gradient-to-b group-last:from-agf-gold/40 group-last:to-transparent" />

      {/* Timeline dot */}
      <div className={`absolute left-0 top-1 w-3 h-3 -translate-x-1/2 rounded-full border-2 ${
        isHighlighted
          ? 'bg-agf-gold border-agf-gold ring-4 ring-agf-gold/20'
          : 'bg-agf-gold border-agf-gold-dark'
      }`} />

      {/* Content card */}
      <div className={`bg-white rounded-xl border ${
        isHighlighted
          ? 'border-agf-blue shadow-lg shadow-agf-blue/10'
          : 'border-gray-100 shadow-sm hover:shadow-md'
      } transition-shadow p-4 md:p-5`}>
        {/* Date badge */}
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="inline-flex items-center bg-agf-blue text-agf-gold text-xs font-bold px-3 py-1 rounded-full">
            {day}. {month} {year}
          </span>
          {isHighlighted && (
            <span className="inline-flex items-center bg-agf-gold text-agf-blue-dark text-xs font-medium px-2 py-1 rounded-full">
              I dag i historien
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-lg md:text-xl font-display font-bold text-agf-blue-dark mb-2">
          {entry.title}
        </h3>

        {/* Description */}
        <p className="text-gray-600 text-sm md:text-base leading-relaxed mb-3">
          {entry.description}
        </p>

        {/* Persons */}
        {entry.persons && entry.persons.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {entry.persons.map((person, index) => (
              <span
                key={index}
                className="inline-flex items-center bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-md"
              >
                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
                {person}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
