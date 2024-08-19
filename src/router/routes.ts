import type { Artwork } from '@/db/artwork.model'
import type { Slot } from '@/db/slot.model'

export const home = () => ({ name: 'home' })
export const auth = () => ({ name: 'auth' })
export const profile = () => ({ name: 'profile' })
export const artworks = () => ({ name: 'artworks' })
export const artwork = (artworkId?: Artwork['id'] | 'new') => ({
  name: 'artwork_view',
  ...(artworkId ? { params: { artworkId } } : {})
})
export const slots = () => ({ name: 'slots' })
export const slot = (slotId?: Slot['id']) => ({
  name: 'slot_view',
  ...(slotId ? { params: { artworkId: slotId } } : {})
})
