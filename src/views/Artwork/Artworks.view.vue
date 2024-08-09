<template>
    <RouterView>
        <template v-slot="{ Component }">
            <div class="w-full flex h-full">
                <SpinnerLoader :loading="store.isActionActive('loading')" :message="store.activeActions.join('<br>')"
                    size="lg" class="m-auto">
                    <BaseGrid :items="store.artworks" v-if="!Component" class="p-2">
                        <template #prepend="{ itemClassString }">
                            <RouterLink :to="{ name: 'artwork_view', params: { artworkId: 'new' } }"
                                :class="itemClassString" class="border-2 border-primary-hover border-dashed">
                                <BaseIcon name="add" class="m-auto" />
                            </RouterLink>
                        </template>

                        <template #item="{ item, itemClassString }">
                            <RouterLink :key="item.id" :to="{ name: 'artwork_view', params: { artworkId: item.id } }"
                                :style="`background-image: URL(${artworkImage(item)})`" :class="itemClassString">
                                <label class="align-bottom mt-auto bg-primary p-2">{{
                                    item.title
                                    }}</label>

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
import BaseGrid from "@/components/grid/Base.grid.vue"

const store = useArtworkStore()


const artworkImage = (art: Artwork) => {
    const { data } = supabase.storage.from('gallery_photos').getPublicUrl(art.resource)
    return data.publicUrl

}

</script>