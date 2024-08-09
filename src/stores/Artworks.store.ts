import type { Session } from '@supabase/supabase-js'
import { defineStore } from 'pinia'
import { supabase } from '@/db/index.db'
import { defineStateActions, type StoreState } from './util/StateActions.util'
import { api } from '@/services/index.service'
import type { Database } from '@/db/database.types'
import { ArtworksTable, ArtworkStorage, type Artwork } from '@/db/artwork.model'
import { useUserStore } from './User.store'

export const artworkStoreActions = {
  loading: 'Loading Artworks',
  loadingArtwork: 'Loading Artwork',
  save: 'Saving Artwork',
  upload: 'Uploading Image',
  delete: 'Deleting artwork'
}

const artworkStoreStateActions = defineStateActions(artworkStoreActions)

interface ArtworkStore extends StoreState<typeof artworkStoreActions> {
  _artworks?: Artwork[]
  _activeArtwork?: Artwork
  _cachedArtwork?: Artwork
}

export const useArtworkStore = defineStore('ArtworkStore', {
  state: (): ArtworkStore => ({
    _artworks: undefined,
    _activeArtwork: undefined,
    _cachedArtwork: undefined,
    ...artworkStoreStateActions.state
  }),
  getters: {
    artworks: ({ _artworks }) => _artworks ?? [],
    artwork: ({ _activeArtwork }): Artwork => _activeArtwork ?? <Artwork>{},
    ...artworkStoreStateActions.getters
  },
  actions: {
    preflight(uid?: string) {
      return artworkStoreStateActions.runAction(this, 'loading', async () => {
        await new Promise((y) => setTimeout(y, 1000))
        const userStore = useUserStore()
        return ArtworksTable()
          .select('*,resource')
          .eq('author', uid ?? userStore.user!.id)
          .then(({ data, error }) => {
            if (error) throw error
            this._artworks = data
          })
      })
    },
    clearCurrentArtwork() {
      delete this._activeArtwork
      delete this._cachedArtwork
    },
    loadArtwork(id: Artwork['id']) {
      return artworkStoreStateActions.runAction(this, 'loadingArtwork', async () => {
        this.clearCurrentArtwork()
        const { data, error } = await ArtworksTable().select().eq('id', id).single()
        if (error || !data) throw error || 'Could not find artwork'

        if (!this._artworks) this._artworks = []

        const found = this._artworks?.find((e, i, arr) => {
          if (e.id == id) return Boolean((this._artworks![i] = e))
        })

        if (!found) this._artworks?.push(data)

        this._activeArtwork = data
        this._cachedArtwork = JSON.parse(JSON.stringify(data))

        return data
      })
    },
    saveArtworkDetails() {
      if (!this.artwork) throw 'No active artwork to save'
      return artworkStoreStateActions.runAction(this, 'save', async () => {
        await new Promise((y) => setTimeout(y, 1000))
        if (this.artwork!.id) {
          const update = await ArtworksTable().update(this.artwork!).eq('id', this.artwork!.id)

          if (update.error) throw update.error ?? 'Something went wrong during the save'
          return this.loadArtwork(this.artwork!.id)
        } else {
          this.artwork!.author = useUserStore().user!.id
          const update = await ArtworksTable().insert(this.artwork!).select().single()
          if (update.error || !update.data)
            throw update.error ?? 'Something went wrong during the save'

          return this.loadArtwork(update.data.id)
        }
      })
    },
    saveArtworkFile(file: File) {
      if (!this.artwork) throw 'No active artwork to bind file to'
      return artworkStoreStateActions.runAction(this, 'upload', async () => {
        const artifactPath = `uploads/${this.artwork!.title.split(' ').join('_')}_${file.name}`
        this.artwork.resource = artifactPath
        await ArtworkStorage().upload(artifactPath, file)
        return await this.saveArtworkDetails()
      })
    },
    deleteArtwork() {
      if (!this._activeArtwork) throw 'No artwork to delete'
      return artworkStoreStateActions.runAction(this, 'delete', async () => {
        const { error } = await ArtworksTable().delete().eq('id', this._activeArtwork!.id)
        if (error) throw error ?? 'Could not delete artwork'

        const removedAsset = await ArtworkStorage().remove([this._activeArtwork!.resource])
        if (removedAsset.error) throw error ?? 'Could not delete artwork resource'

        this._artworks = this._artworks?.filter((e) => e.id != this._activeArtwork!.id)
        this.clearCurrentArtwork()
      })
    }
  }
})
