'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase, DateEntry } from '@/lib/supabase'

type User = {
  id: string
  email?: string
}

export default function AdminPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [entries, setEntries] = useState<DateEntry[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Form state
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    date: '',
    title: '',
    description: '',
    persons: [''],
  })

  useEffect(() => {
    checkUser()
  }, [])

  async function checkUser() {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.user) {
        router.push('/login')
        return
      }
      setUser(session.user)
      fetchEntries(session.user.id)
    } catch {
      router.push('/login')
    } finally {
      setLoading(false)
    }
  }

  async function fetchEntries(userId: string) {
    const { data } = await supabase
      .from('dates')
      .select('*')
      .eq('created_by', userId)
      .order('created_at', { ascending: false })

    setEntries(data || [])
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/login')
  }

  function resetForm() {
    setFormData({ date: '', title: '', description: '', persons: [''] })
    setEditingId(null)
    setError(null)
    setSuccess(null)
  }

  function handlePersonChange(index: number, value: string) {
    const newPersons = [...formData.persons]
    newPersons[index] = value
    setFormData({ ...formData, persons: newPersons })
  }

  function addPerson() {
    setFormData({ ...formData, persons: [...formData.persons, ''] })
  }

  function removePerson(index: number) {
    const newPersons = formData.persons.filter((_, i) => i !== index)
    setFormData({ ...formData, persons: newPersons.length ? newPersons : [''] })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!user) return

    setSubmitting(true)
    setError(null)
    setSuccess(null)

    const personsArray = formData.persons.filter((p) => p.trim() !== '')

    try {
      if (editingId) {
        // Update existing
        const { error } = await supabase
          .from('dates')
          .update({
            date: formData.date,
            title: formData.title,
            description: formData.description,
            persons: personsArray,
          })
          .eq('id', editingId)
          .eq('created_by', user.id)

        if (error) throw error
        setSuccess('Begivenhed opdateret!')
      } else {
        // Create new
        const { error } = await supabase.from('dates').insert({
          date: formData.date,
          title: formData.title,
          description: formData.description,
          persons: personsArray,
          created_by: user.id,
        })

        if (error) throw error
        setSuccess('Begivenhed tilføjet!')
      }

      resetForm()
      fetchEntries(user.id)
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('Der opstod en fejl. Prøv igen.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  function handleEdit(entry: DateEntry) {
    setFormData({
      date: entry.date,
      title: entry.title,
      description: entry.description,
      persons: entry.persons?.length ? entry.persons : [''],
    })
    setEditingId(entry.id)
    setError(null)
    setSuccess(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function handleDelete(id: string) {
    if (!user) return
    if (!confirm('Er du sikker på, at du vil slette denne begivenhed?')) return

    try {
      const { error } = await supabase
        .from('dates')
        .delete()
        .eq('id', id)
        .eq('created_by', user.id)

      if (error) throw error
      setSuccess('Begivenhed slettet!')
      fetchEntries(user.id)
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('Kunne ikke slette begivenheden.')
      }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-agf-blue border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-agf-blue text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <span className="text-agf-blue font-bold text-lg">AGF</span>
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold">Admin Panel</h1>
                <p className="text-xs text-white/80 hidden sm:block">{user?.email}</p>
              </div>
            </Link>
            <button
              onClick={handleLogout}
              className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Log ud
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Form */}
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            {editingId ? (
              <>
                <svg className="w-6 h-6 text-agf-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Rediger begivenhed
              </>
            ) : (
              <>
                <svg className="w-6 h-6 text-agf-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Tilføj ny begivenhed
              </>
            )}
          </h2>

          {error && (
            <div className="bg-red-50 text-agf-blue px-4 py-3 rounded-lg text-sm mb-6 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 text-green-700 px-4 py-3 rounded-lg text-sm mb-6 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Dato *
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-agf-blue/50 focus:border-agf-blue"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Titel *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  placeholder="Fx: AGF vinder pokalen"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-agf-blue/50 focus:border-agf-blue"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Beskrivelse *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                rows={4}
                placeholder="Beskriv begivenheden..."
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-agf-blue/50 focus:border-agf-blue resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Personer (valgfrit)
              </label>
              <div className="space-y-2">
                {formData.persons.map((person, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={person}
                      onChange={(e) => handlePersonChange(index, e.target.value)}
                      placeholder="Navn på person"
                      className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-agf-blue/50 focus:border-agf-blue"
                    />
                    <button
                      type="button"
                      onClick={() => removePerson(index)}
                      className="p-2 text-gray-400 hover:text-agf-blue transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={addPerson}
                className="mt-2 text-sm text-agf-blue hover:underline flex items-center gap-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Tilføj person
              </button>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 bg-agf-blue text-white py-3 rounded-lg font-semibold hover:bg-agf-blue-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Gemmer...
                  </>
                ) : editingId ? (
                  'Opdater begivenhed'
                ) : (
                  'Tilføj begivenhed'
                )}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-3 border border-gray-200 text-gray-600 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Annuller
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Entries list */}
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <svg className="w-6 h-6 text-agf-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Mine begivenheder ({entries.length})
          </h2>

          {entries.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p>Du har ikke tilføjet nogen begivenheder endnu.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {entries.map((entry) => {
                const date = new Date(entry.date)
                return (
                  <div
                    key={entry.id}
                    className="border border-gray-100 rounded-xl p-4 hover:border-gray-200 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-medium text-agf-blue bg-agf-blue/10 px-2 py-0.5 rounded">
                            {date.toLocaleDateString('da-DK', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric',
                            })}
                          </span>
                        </div>
                        <h3 className="font-semibold text-gray-900 truncate">{entry.title}</h3>
                        <p className="text-sm text-gray-500 line-clamp-2 mt-1">{entry.description}</p>
                        {entry.persons && entry.persons.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {entry.persons.map((person, i) => (
                              <span key={i} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                                {person}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <button
                          onClick={() => handleEdit(entry)}
                          className="p-2 text-gray-400 hover:text-agf-blue hover:bg-agf-blue/5 rounded-lg transition-colors"
                          title="Rediger"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(entry.id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Slet"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
