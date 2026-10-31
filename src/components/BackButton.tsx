'use client'

export default function BackButton({ className }: { className?: string }) {
  return (
    <button
      onClick={() => window.history.back()}
      className={className}
    >
      ← et skridt tilbage
    </button>
  )
}
