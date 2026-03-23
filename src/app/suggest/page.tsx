'use client'

import { useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

const MAX_TEXT = 2000
const MAX_TITLE = 200
const MAX_REASON = 500
const MAX_SUGGESTED_BY = 500

function sanitize(str: string): string {
  return str.trim().slice(0, MAX_TEXT)
}

export default function SuggestPage() {
  const [formData, setFormData] = useState({
    date: '',
    title: '',
    description: '',
    persons: [''],
    reason: '',
    suggested_by: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function handlePersonChange(index: number, value: string) {
    const updated = [...formData.persons]
    updated[index] = value.slice(0, 100)
    setFormData({ ...formData, persons: updated })
  }

  function addPerson() {
    if (formData.persons.length < 10) {
      setFormData({ ...formData, persons: [...formData.persons, ''] })
    }
  }

  function removePerson(index: number) {
    const updated = formData.persons.filter((_, i) => i !== index)
    setFormData({ ...formData, persons: updated.length ? updated : [''] })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    const persons = formData.persons
      .map((p) => sanitize(p))
      .filter((p) => p.length > 0)

    try {
      const { error } = await supabase.from('suggestions').insert({
        date: formData.date,
        title: sanitize(formData.title).slice(0, MAX_TITLE),
        description: sanitize(formData.description).slice(0, MAX_TEXT),
        persons,
        reason: sanitize(formData.reason).slice(0, MAX_REASON),
        suggested_by: sanitize(formData.suggested_by).slice(0, MAX_SUGGESTED_BY),
        status: 'pending',
      })

      if (error) throw error
      setSuccess(true)
    } catch (err) {
      setError('Der opstod en fejl. Prøv igen.')
      console.error(err)
    } finally {
      setSubmitting(false)
    }
  }

  const inputClass = "w-full px-4 py-3 border border-white/20 rounded-lg bg-white/10 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/30 transition-colors"

  if (success) {
    return (
      <div className="min-h-screen bg-agf-blue flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center p-4">
          <div className="w-full max-w-md text-center">
            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-display font-bold text-white mb-3">Tak for dit forslag!</h2>
            <p className="text-white/60 mb-8">Det vil blive gennemgået af redaktionen og eventuelt tilføjet til Almanakken.</p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => { setSuccess(false); setFormData({ date: '', title: '', description: '', persons: [''], reason: '', suggested_by: '' }) }}
                className="px-5 py-2.5 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
              >
                Foreslå en til
              </button>
              <Link href="/" className="px-5 py-2.5 bg-white text-agf-blue rounded-lg font-medium hover:bg-white/90 transition-colors">
                Tilbage til forsiden
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-agf-blue flex flex-col">
      <Header />

      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-display font-bold text-white mb-1">Foreslå en dato</h2>
          <p className="text-white/50 text-sm">Kender du en begivenhed der burde være i Almanakken? Send et forslag til redaktionen.</p>
        </div>

        {error && (
          <div className="bg-red-500/20 text-red-200 px-4 py-3 rounded-lg text-sm mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-white/70 mb-1">Dato *</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/70 mb-1">Titel * <span className="text-white/30">({formData.title.length}/{MAX_TITLE})</span></label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value.slice(0, MAX_TITLE) })}
                required
                maxLength={MAX_TITLE}
                placeholder="Fx: AGF vinder pokalen"
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-white/70 mb-1">Beskrivelse * <span className="text-white/30">({formData.description.length}/{MAX_TEXT})</span></label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value.slice(0, MAX_TEXT) })}
              required
              rows={4}
              maxLength={MAX_TEXT}
              placeholder="Beskriv begivenheden..."
              className={`${inputClass} resize-none`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">Personer (valgfrit)</label>
            <div className="space-y-2">
              {formData.persons.map((person, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={person}
                    onChange={(e) => handlePersonChange(index, e.target.value)}
                    maxLength={100}
                    placeholder="Navn på person"
                    className={inputClass}
                  />
                  <button type="button" onClick={() => removePerson(index)} className="p-2 text-white/30 hover:text-white transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
            {formData.persons.length < 10 && (
              <button type="button" onClick={addPerson} className="mt-2 text-sm text-white/50 hover:text-white transition-colors flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Tilføj person
              </button>
            )}
          </div>

          <div className="border-t border-white/10 pt-5 space-y-5">
            <div>
              <label className="block text-sm font-medium text-white/70 mb-1">
                Begrundelse * <span className="text-white/30">({formData.reason.length}/{MAX_REASON})</span>
              </label>
              <textarea
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value.slice(0, MAX_REASON) })}
                required
                rows={3}
                maxLength={MAX_REASON}
                placeholder="Hvorfor skal denne begivenhed tilføjes til Almanakken?"
                className={`${inputClass} resize-none`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/70 mb-1">
                Foreslået af * <span className="text-white/30">({formData.suggested_by.length}/{MAX_SUGGESTED_BY})</span>
              </label>
              <input
                type="text"
                value={formData.suggested_by}
                onChange={(e) => setFormData({ ...formData, suggested_by: e.target.value.slice(0, MAX_SUGGESTED_BY) })}
                required
                maxLength={MAX_SUGGESTED_BY}
                placeholder="Hvem foreslår dette? Navn, social media profil etc."
                className={inputClass}
              />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-white text-agf-blue py-3 rounded-lg font-semibold hover:bg-white/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-agf-blue border-t-transparent rounded-full animate-spin" />
                  Sender...
                </>
              ) : 'Send forslag'}
            </button>
            <Link href="/" className="px-6 py-3 border border-white/20 text-white/70 rounded-lg hover:bg-white/10 transition-colors">
              Annuller
            </Link>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  )
}
