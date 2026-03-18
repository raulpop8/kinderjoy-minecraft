export type Rarity = 'common' | 'rare' | 'super-rare'
export type ItemType = 'figurine' | 'accessory'
export type TabId = 'all' | 'figurine' | 'accessory' | 'rare' | 'missing'

export interface Figurine {
  id: string        // e.g. "VC301"
  name: string
  type: ItemType
  rarity: Rarity
}
