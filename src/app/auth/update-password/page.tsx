'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import SiteHeader from '@/components/SiteHeader'

type State = 'waiting' | 'ready' | 'success' | 'error' | 'invalid'

export default function UpdatePasswordPage() {
  const router = useRouter()
  const [state, setState] = useState<State>('waiting')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Supabase fires PASSWORD_RECOVERY when it detects the token in the URL hash
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setState('ready')
      } else if (event === 'SIGNED_OUT') {
        setState('invalid')
      }
    })

    // If page loads without a recovery token the user ends up here by mistake
    // Give the client 3 seconds to fire the event, then mark invalid
    const timeout = setTimeout(() => {
      setState((s) => s === 'waiting' ? 'invalid' : s)
    }, 3000)

    return () => {
      subscription.unsubscribe()
      clearTimeout(timeout)
    }
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (password !== confirm) {
      setError('Adgangskoderne stemmer ikke overens')
      return
    }

    if (password.length < 8) {
      setError('Adgangskoden skal være mindst 8 tegn')
      return
    }

    setLoading(true)

    try {
      const { error } = await supabase.auth.updateUser({ password })
      if (error) throw error
      setState('success')
      // Redirect to admin after a brief pause
      setTimeout(() => router.push('/admin'), 2000)
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('Der opstod en fejl. Prøv igen.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-agf-blue flex flex-col">
      <SiteHeader />

      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-xl p-8">

            {/* Waiting for token */}
            {state === 'waiting' && (
              <div className="text-center py-4">
                <div className="w-8 h-8 border-2 border-agf-blue border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-gray-500 text-sm">Verificerer link...</p>
              </div>
            )}

            {/* Invalid / expired link */}
            {state === 'invalid' && (
              <div className="text-center">
                <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">Ugyldigt link</h2>
                <p className="text-gray-500 text-sm mb-6">
                  Dette link er udløbet eller allerede brugt. Anmod om et nyt nulstillingslink.
                </p>
                <Link
                  href="/login/reset"
                  className="inline-block bg-agf-blue text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-agf-blue-dark transition-colors text-sm"
                >
                  Anmod om nyt link
                </Link>
              </div>
            )}

            {/* New password form */}
            {state === 'ready' && (
              <>
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-agf-blue rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Vælg ny adgangskode</h2>
                  <p className="text-gray-500 mt-2 text-sm">Mindst 8 tegn.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  {error && (
                    <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
                      <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {error}
                    </div>
                  )}

                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                      Ny adgangskode
                    </label>
                    <input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={8}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-agf-blue/50 focus:border-agf-blue transition-colors"
                      placeholder="••••••••"
                    />
                  </div>

                  <div>
                    <label htmlFor="confirm" className="block text-sm font-medium text-gray-700 mb-1">
                      Gentag adgangskode
                    </label>
                    <input
                      id="confirm"
                      type="password"
                      value={confirm}
                      onChange={(e) => setConfirm(e.target.value)}
                      required
                      minLength={8}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-agf-blue/50 focus:border-agf-blue transition-colors"
                      placeholder="••••••••"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-agf-blue text-white py-3 rounded-lg font-semibold hover:bg-agf-blue-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Gemmer...
                      </>
                    ) : (
                      'Gem ny adgangskode'
                    )}
                  </button>
                </form>
              </>
            )}

            {/* Success */}
            {state === 'success' && (
              <div className="text-center">
                <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">Adgangskode opdateret</h2>
                <p className="text-gray-500 text-sm">Du bliver sendt videre til admin-panelet...</p>
              </div>
            )}

          </div>

          {(state === 'ready' || state === 'invalid') && (
            <p className="text-center text-white/70 text-sm mt-6">
              <Link href="/login" className="text-white hover:underline">
                ← Tilbage til login
              </Link>
            </p>
          )}
        </div>
      </main>
    </div>
  )
}
