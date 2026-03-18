'use client'

import { useState } from 'react'

export default function ShareButton({ userId }: { userId: string }) {
  const [copied, setCopied] = useState(false)

  const handleShare = async () => {
    const url = `${window.location.origin}/u/${userId}`
    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={handleShare}
      className={[
        'font-pixel text-[9px] px-3 py-2 border-2 transition-all duration-150',
        copied
          ? 'border-mc-green text-mc-green-lit'
          : 'border-mc-border text-mc-muted hover:border-mc-blue hover:text-mc-blue',
      ].join(' ')}
    >
      {copied ? 'Copied! ✓' : '⇧ Share'}
    </button>
  )
}