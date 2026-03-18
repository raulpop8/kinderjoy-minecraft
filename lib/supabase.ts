import { createClient } from '@supabase/supabase-js'

// Use placeholder values at build time — actual values come from .env.local at runtime
const url  = process.env.NEXT_PUBLIC_SUPABASE_URL      ?? 'http://localhost:54321'
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? 'placeholder'

export const supabase = createClient(url, anon)