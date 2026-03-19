'use client'

import { useState, useEffect } from 'react'

export default function JesperHansenToggle() {
  const [isOn, setIsOn] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('jesperHansenMode') === 'true'
    setIsOn(saved)
    document.documentElement.classList.toggle('jesper-hansen-mode', saved)
  }, [])

  function toggle() {
    const next = !isOn
    setIsOn(next)
    localStorage.setItem('jesperHansenMode', String(next))
    document.documentElement.classList.toggle('jesper-hansen-mode', next)
  }

  return (
    <button
      onClick={toggle}
      className="flex items-center gap-2 text-white/20 hover:text-white/50 transition-colors text-xs"
      title="Jesper Hansen Mode"
    >
      <span>Jesper Hansen Mode</span>
      <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold transition-colors ${
        isOn ? 'bg-pink-600 text-white' : 'bg-white/10 text-white/40'
      }`}>
        {isOn ? 'ON' : 'OFF'}
      </span>
    </button>
  )
}
