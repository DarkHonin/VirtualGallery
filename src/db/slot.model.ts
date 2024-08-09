import type { Artwork } from './artwork.model'
import type { Database } from './database.types'
import { supabase } from './index.db'

export type Slot = Database['public']['Tables']['gallery_slots']['Row'] & {
  artwork?: Artwork | null
}

export const SlotTable = () => supabase.from('gallery_slots')
