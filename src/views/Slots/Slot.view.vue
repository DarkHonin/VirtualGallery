<template>
    <SpinnerLoader class="m-auto" :loading="slotStore.isActionActive('loadingSlot')">
        <div v-if="isNotFound" class="px-2 w-full flex flex-col justify-center items-center  h-full">
            <BaseIcon name="error" class="text-button-negative" />
            <h2>
                Could not find artwork
            </h2>
        </div>
        <div v-else class="px-2 w-full grid-cols-6 grid gap-2">
            <div class="flex col-span-full gap-2">
                <BaseButton color="positive" label="Save" :loading="slotStore.isActing" @click="save()" />
                <BaseButton v-if="slotStore.slot.id" color="negative" label="Delete"
                    :disabled="!slotStore.slot.slot_name || !slotStore.slot" :loading="slotStore.isActing"
                    @click="deleteArt()" />
                <label v-if="slotStore.isActing" class="ml-auto items-center flex gap-2">
                    <p>{{ slotStore.activeActions.join(' - ') }}
                    </p>
                    <SpinnerLoader :loading="true" />
                </label>
            </div>
            <div class="col-span-3">
                <BaseInput label="Slot title" type="text" v-model="slotStore.slot.slot_name"
                    placeholder="What should it be called?" />
                <SelectInput v-model="<Artwork>slotStore.slot.artwork" item_value="id" :options="artworkStore.artworks"
                    placeholder="Select artwork" label="Selected Artwork">
                    <template #display="{ item }">
                        <ArtworkListItem v-if="item && item[0]" :item="item?.[0]" />
                    </template>
                    <template #item="{ item, addItem } : { item: Artwork, addItem(e: Artwork): void }">
                        <ArtworkListItem :item="item" @click="addItem(item)" />
                    </template>
                </SelectInput>
            </div>
        </div>
    </SpinnerLoader>
</template>

<script setup lang="ts">
import BaseInput from '@/components/input/Base.input.vue'
import TextAreaInput from '@/components/input/Textarea.input.vue'

import { computed, onMounted, ref } from 'vue'
import { type Artwork } from "@/db/artwork.model"
import { useArtworkStore } from "@/stores/Artworks.store"
import { useRoute, useRouter } from 'vue-router'
import ImageInput from '@/components/input/Image.input.vue'
import BaseButton from '@/components/button/Base.button.vue'
import { supabase } from '@/db/index.db'
import SpinnerLoader from '@/components/loader/Spinner.loader.vue'
import BaseIcon from '@/components/icon/Base.icon.vue'
import { useSlotStore } from '@/stores/Slots.store'
import SelectInput from '@/components/input/Select.input.vue'
import ArtworkListItem from '@/components/artwork/Artwork.listItem.vue'

const slotStore = useSlotStore()
const route = useRoute()

const artworkStore = useArtworkStore()

const router = useRouter()


const save = () => {
    slotStore.saveSlotDetails()
        .then((artwork: Artwork) => {
            router.push({ name: 'slot_view', params: { slotId: artwork.id } })
        })
}

const isNotFound = computed(() => <string>route.params.slotId !== 'new' && parseInt(<string>route.params.slotId) !== slotStore.slot.id);

onMounted(() => {
    artworkStore.preflight()
})

const deleteArt = () => {
    slotStore.deleteSlot().then(() => router.push({ name: "slots" }))
}



</script>