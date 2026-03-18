'use client'

import { useState } from 'react'
import { FIGURINES } from '@/lib/data'
import { TabId } from '@/types'
import { useCollection } from '@/context/CollectionContext'
import FigurineCard from './FigurineCard'

const TABS: { id: TabId; label: string }[] = [
  { id: 'all',       label: 'All (28)'        },
  { id: 'figurine',  label: 'Figurines (24)'  },
  { id: 'accessory', label: 'Accessories (4)' },
  { id: 'rare',      label: '✦ Rare'          },
  { id: 'missing',   label: 'Missing'         },
]

const SECTION_LABEL: Record<TabId, string> = {
  all:       'All items — click a card to mark as collected',
  figurine:  'Figurines (24)',
  accessory: 'Accessories — blocks & cards',
  rare:      '✦ Rare & super rare variants',
  missing:   'Missing from your collection',
}

export default function FigurineGrid() {
  const { collected } = useCollection()
  const [activeTab, setActiveTab] = useState<TabId>('all')

  const filtered = FIGURINES.filter(f => {
    if (activeTab === 'all')       return true
    if (activeTab === 'figurine')  return f.type === 'figurine'
    if (activeTab === 'accessory') return f.type === 'accessory'
    if (activeTab === 'rare')      return f.rarity !== 'common'
    if (activeTab === 'missing')   return !collected.has(f.id)
    return true
  })

  return (
    <div>
      {/* Tab bar */}
      <div className="flex border-b border-mc-border mb-6 overflow-x-auto">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={[
              'font-pixel text-[7px] px-4 py-3 whitespace-nowrap border-b-[3px] transition-colors duration-100',
              activeTab === tab.id
                ? 'text-mc-green-lit border-mc-green'
                : 'text-mc-muted border-transparent hover:text-mc-text',
            ].join(' ')}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Section label */}
      <p className="font-pixel text-[7px] text-mc-muted tracking-widest mb-4 uppercase">
        {SECTION_LABEL[activeTab]}
      </p>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="col-span-full text-center py-20 font-pixel text-[9px] text-mc-muted leading-loose">
          You caught them all!<br />Complete set — well done.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
          {filtered.map(f => (
            <FigurineCard key={f.id} figurine={f} />
          ))}
        </div>
      )}
    </div>
  )
}
