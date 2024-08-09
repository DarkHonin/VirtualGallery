<template>
    <RouterView>
        <template v-slot="{ Component }">
            <div class="w-full flex h-full">

                <SpinnerLoader :loading="store.isActionActive('loading')" :message="store.activeActions.join('<br/>')"
                    size="lg" class="m-auto">
                    <BaseGrid :items="store.slots" v-if="!Component" class="p-2">
                        <template #prepend="{ itemClassString }">
                            <RouterLink :to="{ name: 'slot_view', params: { slotId: 'new' } }" :class="itemClassString"
                                class="border-2 border-primary-hover border-dashed">
                                <BaseIcon name="add" class="m-auto" />
                            </RouterLink>
                        </template>

                        <template #item="{ item, itemClassString } : { item: Slot, itemClassString: string }">
                            <RouterLink :key="item.id" :to="{ name: 'slot_view', params: { slotId: item.id } }"
                                :style="`background-image: URL(${artworkImage(<Artwork>item.artwork)})`"
                                :class="itemClassString">
                                <label class="align-bottom mt-auto bg-primary p-2">{{
                                    item.slot_name
                                }} - {{ item.artwork?.title }}</label>

                            </RouterLink>
                        </template>

                    </BaseGrid>


                    <component v-else :is="Component" />
                </SpinnerLoader>
            </div>
        </template>
    </RouterView>

</template>

<script lang="ts" setup>

import { useArtworkStore } from "@/stores/Artworks.store"
import BaseIcon from '@/components/icon/Base.icon.vue'
import { type Artwork } from "@/db/artwork.model"
import { supabase } from '@/db/index.db'
import { onMounted } from 'vue'
import PageTemplate from '@/views/Template/Page.template.vue'
import SpinnerLoader from "@/components/loader/Spinner.loader.vue"
import { useSlotStore } from "@/stores/Slots.store"
import { type Slot } from '@/db/slot.model'
import BaseGrid from "@/components/grid/Base.grid.vue"

const store = useSlotStore()


const artworkImage = (art?: Artwork | number) => {
    if (!art || typeof (art) == 'number') return
    const { data } = supabase.storage.from('gallery_photos').getPublicUrl(art.resource)
    return data.publicUrl

}

</script>