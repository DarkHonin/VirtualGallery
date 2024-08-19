<template>
    <SpinnerLoader class="m-auto" :loading="artworkStore.isActionActive('loadingArtwork')">
        <div v-if="isNotFound" class="px-2 w-full flex flex-col justify-center items-center  h-full">
            <BaseIcon name="error" class="text-button-negative" />
            <h2>
                Could not find artwork
            </h2>
        </div>
        <div v-else class="p-2 flex flex-wrap place-content-start w-full">
            <div class="flex gap-2 h-min w-full max-h-min ">
                <BaseButton color="positive" label="Save" :disabled="!activeArtwork.resource"
                    :loading="artworkStore.isActing" @click="save()" />
                <BaseButton v-if="activeArtwork.id" color="negative" label="Delete" :disabled="!activeArtwork.resource"
                    :loading="artworkStore.isActing" @click="deleteArt()" />
                <label v-if="artworkStore.isActing" class="ml-auto items-center flex gap-2">
                    <p>{{ artworkStore.activeActions.join(' - ') }}
                    </p>
                    <SpinnerLoader :loading="true" />
                </label>
            </div>

            <div class="mx-auto max-w-md">
                <ArtworkDetailFormItem v-model:artwork="activeArtwork" />
                <ArtworkResourceFormItem v-model:artwork="activeArtwork" />
            </div>

        </div>
    </SpinnerLoader>
</template>

<script setup lang="ts">

import { computed, ref } from 'vue'
import { useActiveArtwork, type Artwork } from "@/db/artwork.model"
import { useArtworkStore } from "@/stores/Artworks.store"
import { useRoute, useRouter } from 'vue-router'
import ImageInput from '@/components/input/Image.input.vue'
import BaseButton from '@/components/button/Base.button.vue'
import { supabase } from '@/db/index.db'
import SpinnerLoader from '@/components/loader/Spinner.loader.vue'
import BaseIcon from '@/components/icon/Base.icon.vue'
import ArtworkDetailFormItem from '@/components/artwork/ArtworkDetail.formItem.vue'
import { artwork } from '@/router/routes'
import ArtworkResourceFormItem from '@/components/artwork/ArtworkResource.formItem.vue'

const artworkStore = useArtworkStore()
const route = useRoute()

const router = useRouter()

const { activeArtwork } = useActiveArtwork()

const save = () => {
    artworkStore.saveArtworkDetails()
        .then((a: Artwork) => {
            router.push(artwork(a.id))
        })
}

const isNotFound = computed(() => <string>route.params.artworkId !== 'new' && parseInt(<string>route.params.artworkId) !== artworkStore.artwork.id);

const deleteArt = () => {
    artworkStore.deleteArtwork().then(() => router.push({ name: "artworks" }))
}

</script>
