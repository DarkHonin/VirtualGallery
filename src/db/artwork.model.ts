import { computed, unref, type Ref } from 'vue'
import type { Database } from './database.types'
import { supabase } from './index.db'
import { useArtworkStore } from '@/stores/Artworks.store'

export type Artwork = Database['public']['Tables']['artworks']['Row'] & {
  resource: File | string
}

export const ArtworksTable = () => supabase.from('artworks')
export const ArtworkStorage = () => supabase.storage.from('gallery_photos')

export const useActiveArtwork = () => {
  const artworkStore = useArtworkStore()

  const activeArtwork = computed({
    get: () => artworkStore.artwork,
    set: (nv: Artwork) => (artworkStore._activeArtwork = nv)
  })

  const title = computed({
    get: () => unref(activeArtwork).title,
    set: (nv: string) => (unref(activeArtwork).title = nv)
  })

  const description = computed({
    get: () => unref(activeArtwork).description,
    set: (nv: string | null) => (unref(activeArtwork).description = nv)
  })

  return {
    activeArtwork,
    title,
    description
  }
}

export const useArtwork = (artwork: Ref<Artwork> | Artwork) => {
  const imagePublicUrl = computed(() => {
    if (!unref(artwork).resource) return undefined
    if (<any>unref(artwork).resource instanceof File)
      return URL.createObjectURL(<File>unref(artwork).resource)
    const { data } = ArtworkStorage().getPublicUrl(<string>unref(artwork).resource)
    return data.publicUrl
  })

  return {
    imagePublicUrl
  }
}
