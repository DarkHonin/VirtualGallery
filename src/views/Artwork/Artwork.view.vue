<template>
    <SpinnerLoader class="m-auto" :loading="artworkStore.isActionActive('loadingArtwork')">
        <div v-if="isNotFound" class="px-2 w-full flex flex-col justify-center items-center  h-full">
            <BaseIcon name="error" class="text-button-negative" />
            <h2>
                Could not find artwork
            </h2>
        </div>
        <div v-else class="px-2 w-full grid-cols-6 grid gap-2">
            <div class="flex col-span-full gap-2">
                <BaseButton color="positive" label="Save" :disabled="!artworkFile && !artworkStore.artwork?.resource"
                    :loading="artworkStore.isActing" @click="save()" />
                <BaseButton v-if="artworkStore.artwork.id" color="negative" label="Delete"
                    :disabled="!artworkFile && !artworkStore.artwork?.resource" :loading="artworkStore.isActing"
                    @click="deleteArt()" />
                <label v-if="artworkStore.isActing" class="ml-auto items-center flex gap-2">
                    <p>{{ artworkStore.activeActions.join(' - ') }}
                    </p>
                    <SpinnerLoader :loading="true" />
                </label>
            </div>
            <ImageInput label="Upload Artwork" class="col-span-3" :modelValue="artworkImage(artworkStore.artwork)"
                @upload-file="artworkFile = $event" />
            <div class="col-span-3">
                <BaseInput label="Artwork title" type="text" v-model="artworkStore.artwork.title"
                    placeholder="What should it be called?" />
                <TextAreaInput v-model="artworkStore.artwork.description" class="h-80" label="Description"
                    placeholder="What were you thinking?" />
            </div>
        </div>
    </SpinnerLoader>
</template>

<script setup lang="ts">
import BaseInput from '@/components/input/Base.input.vue'
import TextAreaInput from '@/components/input/Textarea.input.vue'

import { computed, ref } from 'vue'
import { type Artwork } from "@/db/artwork.model"
import { useArtworkStore } from "@/stores/Artworks.store"
import { useRoute, useRouter } from 'vue-router'
import ImageInput from '@/components/input/Image.input.vue'
import BaseButton from '@/components/button/Base.button.vue'
import { supabase } from '@/db/index.db'
import SpinnerLoader from '@/components/loader/Spinner.loader.vue'
import BaseIcon from '@/components/icon/Base.icon.vue'

const artworkStore = useArtworkStore()
const route = useRoute()

const artworkFile = ref<File>()
const router = useRouter()

const save = () => {
    (artworkFile.value! ? artworkStore.saveArtworkFile(artworkFile!.value) : artworkStore.saveArtworkDetails())
        .then((artwork: Artwork) => {
            router.push({ name: 'artwork_view', params: { artworkId: artwork.id } })
        })
}

const isNotFound = computed(() => <string>route.params.artworkId !== 'new' && parseInt(<string>route.params.artworkId) !== artworkStore.artwork.id);

const deleteArt = () => {
    artworkStore.deleteArtwork().then(() => router.push({ name: "artworks" }))
}


const artworkImage = (art: Artwork) => {
    if (!art?.resource) return
    const { data } = supabase.storage.from('gallery_photos').getPublicUrl(art.resource)
    return data.publicUrl

}

</script>