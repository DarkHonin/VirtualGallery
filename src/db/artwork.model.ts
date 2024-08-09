import { computed, unref, type Ref } from 'vue'
import type { Database } from './database.types'
import { supabase } from './index.db'

export type Artwork = Database['public']['Tables']['artworks']['Row']

export const ArtworksTable = () => supabase.from('artworks')
export const ArtworkStorage = () => supabase.storage.from('gallery_photos')

export const useArtwork = (artwork: Ref<Artwork> | Artwork) => {
  const imagePublicUrl = computed(() => {
    const { data } = ArtworkStorage().getPublicUrl(unref(artwork).resource)
    return data.publicUrl
  })

  return {
    imagePublicUrl
  }
}
