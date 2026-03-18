import { createClient } from '@supabase/supabase-js'
import { FIGURINES } from '@/lib/data'
import PixelFace from '@/components/PixelFace'
import Link from 'next/link'
import type { Figurine } from '@/types'

interface Props {
  params: Promise<{ userId: string }>
}

async function getCollection(userId: string): Promise<Set<string>> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL  ?? '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '',
  )
  const { data } = await supabase
    .from('collections')
    .select('figurine_id')
    .eq('user_id', userId)
  return data ? new Set(data.map((r: { figurine_id: string }) => r.figurine_id)) : new Set()
}

const RARITY_STYLE: Record<string, string> = {
  rare:         'bg-mc-blue  text-[#002A2A]',
  'super-rare': 'bg-mc-gold  text-[#302000]',
}
const RARITY_LABEL: Record<string, string> = {
  rare: 'RARE', 'super-rare': 'SUPER RARE',
}

function ReadOnlyCard({ figurine, collected }: { figurine: Figurine; collected: boolean }) {
  return (
    <div className={[
      'flex flex-col bg-mc-surface border-2',
      collected ? 'border-mc-green' : 'border-mc-border',
    ].join(' ')}>
      <div className="relative w-full aspect-square overflow-hidden">
        {figurine.rarity !== 'common' && (
          <span className={[
            'absolute top-2 left-2 z-10 font-pixel text-[8px] px-1.5 py-1 leading-tight',
            RARITY_STYLE[figurine.rarity],
          ].join(' ')}>
            {RARITY_LABEL[figurine.rarity]}
          </span>
        )}
        <div className={[
          'w-full h-full [image-rendering:pixelated]',
          collected ? '' : 'grayscale brightness-50',
        ].join(' ')}>
          <PixelFace figurine={figurine} />
        </div>
        {collected && (
          <div className="absolute top-2 right-2 w-7 h-7 bg-mc-green flex items-center justify-center z-10">
            <svg width="14" height="10" viewBox="0 0 12 8" fill="none">
              <path d="M1 4L4 7L11 1" stroke="white" strokeWidth="2.5" strokeLinecap="square"/>
            </svg>
          </div>
        )}
      </div>
      <div className="px-3 pb-3 pt-2.5 border-t-2 border-mc-border flex flex-col gap-2">
        <p className="font-pixel text-[8px] text-mc-muted">{figurine.id}</p>
        <p className="font-pixel text-[9px] text-mc-text leading-relaxed">{figurine.name}</p>
        <span className="font-body text-[13px] font-medium text-mc-muted">
          {figurine.type === 'figurine' ? 'Figure' : 'Accessory'}
        </span>
      </div>
    </div>
  )
}

export default async function SharePage({ params }: Props) {
  const { userId } = await params
  const collected = await getCollection(userId)
  const count = collected.size
  const total = FIGURINES.length
  const pct   = Math.round((count / total) * 100)

  return (
    <div className="min-h-screen bg-mc-bg">
      {/* Header */}
      <header className="bg-mc-surface border-b-2 border-mc-border px-4 sm:px-6 py-4">
        <div className="max-w-screen-xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Creeper logo */}
            <svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"
              className="w-10 h-10 flex-shrink-0" style={{ imageRendering: 'pixelated' }}>
              <rect width="16" height="16" fill="#3D9A28"/>
              <rect x="2" y="2" width="4" height="4" fill="#000"/>
              <rect x="10" y="2" width="4" height="4" fill="#000"/>
              <rect x="6" y="7" width="4" height="3" fill="#000"/>
              <rect x="4" y="10" width="3" height="2" fill="#000"/>
              <rect x="9" y="10" width="3" height="2" fill="#000"/>
              <rect x="5" y="12" width="2" height="2" fill="#000"/>
              <rect x="9" y="12" width="2" height="2" fill="#000"/>
            </svg>
            <div className="flex flex-col gap-1.5">
              <span className="font-pixel text-[14px] text-mc-green-lit">MiniFig Tracker</span>
              <span className="font-pixel text-[9px] text-mc-muted">Kinder Joy × Minecraft 2026</span>
            </div>
          </div>
          <Link
            href="/"
            className="font-pixel text-[9px] px-3 py-2 border border-mc-border text-mc-muted hover:border-mc-green hover:text-mc-green-lit transition-colors"
          >
            Track yours →
          </Link>
        </div>
      </header>

      <main className="max-w-screen-xl mx-auto px-4 sm:px-6 py-8">
        {/* Collection stats */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <span className="font-pixel text-[9px] text-mc-muted whitespace-nowrap">Collection</span>
            <div className="flex-1 h-3 bg-mc-surface2 border-2 border-mc-border overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-mc-green to-mc-green-lit transition-all duration-500"
                style={{ width: `${pct}%` }}
              />
            </div>
            <span className="font-pixel text-[10px] text-mc-green-lit min-w-[40px] text-right">{pct}%</span>
          </div>
          <p className="font-pixel text-[9px] text-mc-muted">
            <span className="text-mc-green-lit">{count}</span> / {total} figurines collected
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
          {FIGURINES.map(f => (
            <ReadOnlyCard key={f.id} figurine={f} collected={collected.has(f.id)} />
          ))}
        </div>
      </main>

      {/* Footer */}
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6">
        <footer className="border-t-2 border-mc-border mt-16 py-5 flex items-center justify-between">
          <div className="flex items-center gap-2 font-pixel text-[9px] text-mc-muted">
            <span>Made by</span>
            <a href="https://raulpop.ro" target="_blank" rel="noopener noreferrer"
              className="text-mc-green-lit hover:text-mc-green transition-colors">Raul Pop</a>
            <span className="text-mc-red">♥</span>
            <a href="https://ko-fi.com/raulpop" target="_blank" rel="noopener noreferrer"
              className="text-mc-muted hover:text-mc-gold transition-colors flex items-center gap-1">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.881 8.948c-.773-4.085-4.859-4.593-4.859-4.593H.723c-.604 0-.679.798-.679.798s-.082 7.324-.022 11.822c.164 2.424 2.586 2.672 2.586 2.672s8.267-.023 11.966-.049c2.438-.426 2.683-2.566 2.658-3.734 4.352.24 7.422-2.831 6.649-6.916zm-11.062 3.511c-1.246 1.453-4.011 3.976-4.011 3.976s-.121.119-.31.023c-.076-.057-.108-.09-.108-.09-.443-.441-3.368-3.049-4.034-3.954-.709-.965-1.041-2.7-.091-3.71.951-1.01 3.005-1.086 4.363.407 0 0 1.565-1.782 3.468-.963 1.904.82 1.832 2.84.723 4.311zm6.173.478c-.928.116-1.682.028-1.682.028V7.284h1.77s1.971.551 1.971 2.638c0 1.913-.985 2.667-2.059 3.015z"/>
              </svg>
              Ko-fi
            </a>
            <span className="text-mc-border">·</span>
            <span>{new Date().getFullYear()}</span>
          </div>
          <a href="https://github.com/raulpop8/kinderjoy-minecraft" target="_blank" rel="noopener noreferrer"
            className="text-mc-border hover:text-mc-muted transition-colors">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
            </svg>
          </a>
        </footer>
      </div>
    </div>
  )
}