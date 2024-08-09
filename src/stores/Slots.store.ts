import { defineStore } from 'pinia'
import { defineStateActions, type StoreState } from './util/StateActions.util'
import { useUserStore } from './User.store'
import { SlotTable, type Slot } from '@/db/slot.model'
import { reactive } from 'vue'

export const slotsStoreActions = {
  loading: 'Loading Slots',
  loadingSlot: 'Loading Slot',
  save: 'Saving Slot',
  delete: 'Deleting Slot'
}

const slotStoreStateActions = defineStateActions(slotsStoreActions)

interface ArtworkStore extends StoreState<typeof slotsStoreActions> {
  _slots?: Slot[]
  _activeSlot?: Slot
  _cachedSlot?: Slot
}

export const useSlotStore = defineStore('SlotStore', {
  state: (): ArtworkStore => ({
    _slots: undefined,
    _activeSlot: undefined,
    _cachedSlot: undefined,
    ...slotStoreStateActions.state
  }),
  getters: {
    slots: ({ _slots }) => _slots ?? [],
    slot: ({ _activeSlot }): Slot => _activeSlot ?? reactive(<Slot>{}),
    ...slotStoreStateActions.getters
  },
  actions: {
    preflight(uid?: string) {
      return slotStoreStateActions.runAction(this, 'loading', async () => {
        await new Promise((y) => setTimeout(y, 1000))
        return SlotTable()
          .select('*,artwork(*)')
          .then(({ data, error }) => {
            if (error) throw error
            this._slots = <any>data
          })
      })
    },
    clearCurrentSlot() {
      delete this._activeSlot
      delete this._cachedSlot
    },
    loadSlot(id: Slot['id']) {
      return slotStoreStateActions.runAction(this, 'loadingSlot', async () => {
        this.clearCurrentSlot()
        const { data, error } = await SlotTable().select().eq('id', id).single()
        if (error || !data) throw error || 'Could not find slot'

        if (!this._slots) this._slots = []

        const found = this._slots?.find((e, i, arr) => {
          if (e.id == id) return Boolean((this._slots![i] = e))
        })

        if (!found) this._slots?.push(<any>data)

        this._activeSlot = <any>data
        this._cachedSlot = JSON.parse(JSON.stringify(data))

        return data
      })
    },
    saveSlotDetails() {
      if (!this.slot) throw 'No active slot to save'
      return slotStoreStateActions.runAction(this, 'save', async () => {
        await new Promise((y) => setTimeout(y, 1000))
        if (!this._activeSlot?.id) {
          const update = await SlotTable().insert(this.slot).select().single()
          if (update.error || !update.data)
            throw update.error ?? 'Something went wrong during the save'

          return this.loadSlot(update.data.id)
        } else {
          const update = await SlotTable().update(this._activeSlot!).eq('id', this._activeSlot!.id)

          if (update.error) throw update.error ?? 'Something went wrong during the save'
          return this.loadSlot(this._activeSlot!.id)
        }
      })
    },

    deleteSlot() {
      if (!this._activeSlot) throw 'No artwork to delete'
      return slotStoreStateActions.runAction(this, 'delete', async () => {
        const { error } = await SlotTable().delete().eq('id', this._activeSlot!.id)
        if (error) throw error ?? 'Could not delete slot'

        this._slots = this._slots?.filter((e) => e.id != this._activeSlot!.id)
        this.clearCurrentSlot()
      })
    }
  }
})
