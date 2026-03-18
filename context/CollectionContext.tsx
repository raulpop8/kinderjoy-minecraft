'use client'

import {
  createContext, useContext, useEffect,
  useState, useCallback, useRef,
} from 'react'
import type { User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

// ── Types ──────────────────────────────────────────────────────────────────
interface CollectionContextType {
  collected:    Set<string>
  user:         User | null
  loading:      boolean
  toggle:       (id: string) => Promise<void>
  login:        (email: string, password: string) => Promise<string | null>
  register:     (email: string, password: string) => Promise<string | null>
  logout:       () => Promise<void>
  modalOpen:    boolean
  setModalOpen: (open: boolean) => void
}

const CollectionContext = createContext<CollectionContextType | null>(null)

// ── Local storage helpers ──────────────────────────────────────────────────
const LS_KEY = 'kj-mc-collection'

function loadLocal(): Set<string> {
  try {
    const raw = localStorage.getItem(LS_KEY)
    return raw ? new Set<string>(JSON.parse(raw)) : new Set()
  } catch {
    return new Set()
  }
}

function saveLocal(set: Set<string>) {
  localStorage.setItem(LS_KEY, JSON.stringify(Array.from(set)))
}

// ── Provider ───────────────────────────────────────────────────────────────
export function CollectionProvider({ children }: { children: React.ReactNode }) {
  const [collected,  setCollected]  = useState<Set<string>>(new Set())
  const [user,       setUser]       = useState<User | null>(null)
  const [loading,    setLoading]    = useState(true)
  const [modalOpen,  setModalOpen]  = useState(false)

  // Refs so toggle() always reads the latest values without stale closures
  const collectedRef = useRef(collected)
  const userRef      = useRef(user)
  collectedRef.current = collected
  userRef.current      = user

  // Load collection from Supabase
  const loadFromDB = async (userId: string): Promise<Set<string>> => {
    const { data, error } = await supabase
      .from('collections')
      .select('figurine_id')
      .eq('user_id', userId)
    if (error) console.error('loadFromDB error:', error)
    return data ? new Set(data.map((r: { figurine_id: string }) => r.figurine_id)) : new Set()
  }

  // Init: check session → load collection
  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        setUser(session.user)
        const dbSet = await loadFromDB(session.user.id)
        setCollected(dbSet)
        saveLocal(dbSet)
      } else {
        setCollected(loadLocal())
      }
      setLoading(false)
    }
    init()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setUser(session.user)
          const dbSet = await loadFromDB(session.user.id)
          setCollected(dbSet)
          saveLocal(dbSet)
        } else {
          setUser(null)
          setCollected(loadLocal())
        }
      }
    )
    return () => subscription.unsubscribe()
  }, [])

  // Toggle — uses refs so it never has a stale closure
  const toggle = useCallback(async (id: string) => {
    const wasCollected = collectedRef.current.has(id)

    setCollected(prev => {
      const next = new Set(prev)
      wasCollected ? next.delete(id) : next.add(id)
      saveLocal(next)
      return next
    })

    const currentUser = userRef.current
    if (currentUser) {
      if (wasCollected) {
        const { error } = await supabase
          .from('collections')
          .delete()
          .eq('user_id', currentUser.id)
          .eq('figurine_id', id)
        if (error) console.error('delete error:', error)
      } else {
        const { error } = await supabase
          .from('collections')
          .upsert({ user_id: currentUser.id, figurine_id: id })
        if (error) console.error('upsert error:', error)
      }
    }
  }, []) // no deps needed — reads latest values via refs

  const login = async (email: string, password: string): Promise<string | null> => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    return error?.message ?? null
  }

  const register = async (email: string, password: string): Promise<string | null> => {
    const { error } = await supabase.auth.signUp({ email, password })
    return error?.message ?? null
  }

  const logout = async () => {
    await supabase.auth.signOut()
  }

  return (
    <CollectionContext.Provider value={{
      collected, user, loading,
      toggle, login, register, logout,
      modalOpen, setModalOpen,
    }}>
      {children}
    </CollectionContext.Provider>
  )
}

// ── Hook ───────────────────────────────────────────────────────────────────
export function useCollection() {
  const ctx = useContext(CollectionContext)
  if (!ctx) throw new Error('useCollection must be used within CollectionProvider')
  return ctx
}