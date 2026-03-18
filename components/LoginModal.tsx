'use client'

import { useState } from 'react'
import { useCollection } from '@/context/CollectionContext'

type Mode = 'login' | 'register'

export default function LoginModal() {
  const { modalOpen, setModalOpen, login, register } = useCollection()

  const [mode,     setMode]     = useState<Mode>('login')
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [error,    setError]    = useState<string | null>(null)
  const [success,  setSuccess]  = useState<string | null>(null)
  const [loading,  setLoading]  = useState(false)

  if (!modalOpen) return null

  const close = () => {
    setModalOpen(false)
    setError(null)
    setSuccess(null)
    setEmail('')
    setPassword('')
  }

  const handleSubmit = async () => {
    if (!email || !password) { setError('Please fill in all fields'); return }
    setLoading(true)
    setError(null)
    setSuccess(null)

    let err: string | null = null
    if (mode === 'login') {
      err = await login(email, password)
      if (!err) { close(); return }
    } else {
      err = await register(email, password)
      if (!err) {
        setSuccess('Check your email to confirm your account!')
      }
    }

    if (err) setError(err)
    setLoading(false)
  }

  return (
    <div
      className="fixed inset-0 bg-black/85 z-50 flex items-center justify-center p-4"
      onClick={e => { if (e.target === e.currentTarget) close() }}
    >
      <div className="bg-mc-surface border-2 border-mc-green w-full max-w-sm p-8 relative">
        {/* Close */}
        <button
          onClick={close}
          className="absolute top-3 right-3 font-pixel text-[7px] text-mc-muted hover:text-mc-text"
        >
          ✕
        </button>

        {/* Title */}
        <h2 className="font-pixel text-[10px] text-mc-green-lit leading-loose mb-2">
          {mode === 'login' ? 'Welcome back!' : 'Create account'}
        </h2>
        <p className="font-body text-[13px] text-mc-muted mb-6 leading-relaxed">
          {mode === 'login'
            ? 'Sign in to sync your collection across all devices.'
            : 'Create a free account to save your progress.'}
        </p>

        {/* Fields */}
        <div className="flex flex-col gap-2.5 mb-4">
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={e => setEmail(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            className="w-full bg-mc-surface2 border-2 border-mc-border text-mc-text px-3 py-2.5 font-body text-sm outline-none focus:border-mc-green transition-colors placeholder:text-mc-muted"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            className="w-full bg-mc-surface2 border-2 border-mc-border text-mc-text px-3 py-2.5 font-body text-sm outline-none focus:border-mc-green transition-colors placeholder:text-mc-muted"
          />
        </div>

        {/* Error / Success */}
        {error   && <p className="font-pixel text-[7px] text-mc-red   mb-3 leading-relaxed">{error}</p>}
        {success && <p className="font-pixel text-[7px] text-mc-green mb-3 leading-relaxed">{success}</p>}

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-mc-green hover:bg-mc-green-lit text-white font-pixel text-[8px] py-3 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mb-2"
        >
          {loading ? 'Loading...' : mode === 'login' ? 'Sign In' : 'Create Account'}
        </button>

        {/* Toggle mode */}
        <button
          onClick={() => { setMode(m => m === 'login' ? 'register' : 'login'); setError(null); setSuccess(null) }}
          className="w-full border border-mc-border text-mc-muted font-pixel text-[7px] py-2.5 hover:border-mc-muted hover:text-mc-text transition-colors"
        >
          {mode === 'login' ? 'Create Account' : 'Already have an account?'}
        </button>

        <p className="text-center font-body text-[12px] text-mc-muted mt-4">
          Just browsing?{' '}
          <button onClick={close} className="text-mc-green-lit underline cursor-pointer">
            Continue as guest
          </button>
        </p>
      </div>
    </div>
  )
}
