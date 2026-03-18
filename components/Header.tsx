'use client'

import { useCollection } from '@/context/CollectionContext'
import { TOTAL } from '@/lib/data'

function CreeperLogo() {
  return (
    <svg
      viewBox="0 0 16 16"
      xmlns="http://www.w3.org/2000/svg"
      className="w-10 h-10 flex-shrink-0"
      style={{ imageRendering: 'pixelated' }}
    >
      <rect width="16" height="16" fill="#3D9A28"/>
      <rect x="2" y="2" width="4" height="4" fill="#000"/>
      <rect x="10" y="2" width="4" height="4" fill="#000"/>
      <rect x="6" y="7" width="4" height="3" fill="#000"/>
      <rect x="4" y="10" width="3" height="2" fill="#000"/>
      <rect x="9" y="10" width="3" height="2" fill="#000"/>
      <rect x="5" y="12" width="2" height="2" fill="#000"/>
      <rect x="9" y="12" width="2" height="2" fill="#000"/>
    </svg>
  )
}

export default function Header() {
  const { collected, user, logout, setModalOpen } = useCollection()

  const count = collected.size
  const pct   = Math.round((count / TOTAL) * 100)

  return (
    <header className="bg-mc-surface border-b-2 border-mc-border sticky top-0 z-50">
      {!user && (
        <div className="bg-mc-surface2 border-b border-mc-border px-4 py-2 flex items-center justify-between gap-4">
          <p className="font-pixel text-[9px] text-mc-muted">
            Progress is{' '}
            <span className="text-mc-gold">not saved</span>
            {' '}— sign in to keep your collection
          </p>
          <button
            onClick={() => setModalOpen(true)}
            className="font-pixel text-[9px] px-3 py-1.5 border border-mc-gold text-mc-gold hover:bg-mc-gold hover:text-black transition-colors"
          >
            Sign In
          </button>
        </div>
      )}

      <div className="px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <CreeperLogo />
            <div className="flex flex-col gap-1.5">
              <span className="font-pixel text-[14px] text-mc-green-lit tracking-tight">
                MiniFig Tracker
              </span>
              <span className="font-pixel text-[9px] text-mc-muted">
                Kinder Joy × Minecraft 2026
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="font-pixel text-[10px] text-mc-muted hidden sm:block">
              Collected{' '}
              <span className="text-mc-green-lit">{count}</span>
              {' '}/ {TOTAL}
            </span>
            {user ? (
              <div className="flex items-center gap-2">
                <span className="font-pixel text-[9px] text-mc-muted hidden sm:block truncate max-w-[160px]">
                  {user.email}
                </span>
                <button
                  onClick={logout}
                  className="font-pixel text-[9px] px-3 py-2 border border-mc-border text-mc-muted hover:border-mc-muted hover:text-mc-text transition-colors"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={() => setModalOpen(true)}
                className="font-pixel text-[9px] px-3 py-2 border border-mc-border text-mc-muted hover:border-mc-green hover:text-mc-green-lit transition-colors"
              >
                Sign In
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="font-pixel text-[9px] text-mc-muted whitespace-nowrap">Progress</span>
          <div className="flex-1 h-3 bg-mc-surface2 border-2 border-mc-border overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-mc-green to-mc-green-lit transition-all duration-500"
              style={{ width: `${pct}%` }}
            />
          </div>
          <span className="font-pixel text-[10px] text-mc-green-lit min-w-[40px] text-right">
            {pct}%
          </span>
        </div>
      </div>
    </header>
  )
}