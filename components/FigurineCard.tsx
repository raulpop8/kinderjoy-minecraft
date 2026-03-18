'use client'

import { Figurine } from '@/types'
import { useCollection } from '@/context/CollectionContext'
import PixelFace from './PixelFace'

interface Props {
  figurine: Figurine
}

const RARITY_LABEL: Record<string, string> = {
  rare:         'RARE',
  'super-rare': 'SUPER RARE',
}

const RARITY_STYLE: Record<string, string> = {
  rare:         'bg-mc-blue  text-[#002A2A]',
  'super-rare': 'bg-mc-gold  text-[#302000]',
}

export default function FigurineCard({ figurine }: Props) {
  const { collected, toggle } = useCollection()
  const isCollected = collected.has(figurine.id)

  return (
    <button
      onClick={() => toggle(figurine.id)}
      className={[
        'group relative flex flex-col cursor-pointer select-none text-left',
        'bg-mc-surface border-2 transition-all duration-150',
        'hover:-translate-y-1',
        isCollected
          ? 'border-mc-green'
          : 'border-mc-border hover:border-mc-green',
      ].join(' ')}
    >
      {/* Portrait */}
      <div className="relative w-full aspect-square overflow-hidden">
        {/* Rarity badge */}
        {figurine.rarity !== 'common' && (
          <span className={[
            'absolute top-2 left-2 z-10 font-pixel text-[6px] px-1.5 py-1 leading-tight',
            RARITY_STYLE[figurine.rarity],
          ].join(' ')}>
            {RARITY_LABEL[figurine.rarity]}
          </span>
        )}

        {/* Pixel face */}
        <div className={[
          'w-full h-full transition-all duration-200 [image-rendering:pixelated]',
          isCollected ? '' : 'grayscale brightness-50',
        ].join(' ')}>
          <PixelFace figurine={figurine} />
        </div>

        {/* Checkmark */}
        {isCollected && (
          <div className="absolute top-2 right-2 w-6 h-6 bg-mc-green flex items-center justify-center z-10">
            <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
              <path d="M1 4L4 7L11 1" stroke="white" strokeWidth="2.5" strokeLinecap="square"/>
            </svg>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="px-2.5 pb-3 pt-2 border-t-2 border-mc-border flex-1 flex flex-col gap-1.5">
        <p className="font-pixel text-[6px] text-mc-muted">{figurine.id}</p>
        <p className="font-pixel text-[7.5px] text-mc-text leading-relaxed">{figurine.name}</p>
        <div className="flex items-center justify-between mt-auto pt-1">
          <span className="font-body text-[11px] font-medium text-mc-muted">
            {figurine.type === 'figurine' ? 'Figure' : 'Accessory'}
          </span>
          <span className={[
            'font-pixel text-[6px] transition-opacity duration-150',
            isCollected
              ? 'text-mc-muted opacity-60'
              : 'text-mc-green opacity-0 group-hover:opacity-100',
          ].join(' ')}>
            {isCollected ? 'collected ✓' : '+ add'}
          </span>
        </div>
      </div>
    </button>
  )
}
