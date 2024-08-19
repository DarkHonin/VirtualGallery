<template>
    <div class="w-full relative group">
        <ImageInput label="Artwork Resource" class="overflow-hidden transition-all" :model-value="imagePublicUrl"
            @update:model-value="(e) => { emit('update:artwork', { ...artwork, resource: <any>e }); getMetaData(e) }" />
        <div class="flex w-full bg-primary justify-between px-2 absolute top-10 z-20 opacity-25 group-hover:opacity-100 transition-all"
            v-if="metaData">
            <div class="flex flex-col">
                <label>w: {{ metaData.width }}</label>
                <label>h: {{ metaData.height }}</label>
            </div>
            <div class="flex flex-col">
                <label>{{ metaData.mime }}</label>
                <label>{{ (metaData.size / 1024).toFixed(0) }} KB</label>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useArtwork, type Artwork } from '@/db/artwork.model';
import ImageInput from '../input/Image.input.vue';
import { computed, onMounted, ref } from 'vue';

const props = defineProps<{
    artwork: Artwork
}>()

const { imagePublicUrl } = useArtwork(computed(() => props.artwork))
const artworkFile = ref<File>()

const emit = defineEmits<{
    (e: 'update:artwork', artwork: Artwork): void
}>()

const metaData = ref<{
    width: number,
    height: number,
    size: number,
    mime: string
}>()

onMounted(() => getMetaData())

const getMetaData = (async (e?: File) => {
    artworkFile.value = e
    const path = artworkFile.value ? URL.createObjectURL(artworkFile.value) : imagePublicUrl.value
    if (!path) return
    const httpReq = await fetch(path)
    const img: HTMLImageElement = await new Promise((y) => {
        httpReq.blob().then(e => {
            const i = new Image()
            i.onload = () => y(i)
            i.src = URL.createObjectURL(e)
        })
    })

    metaData.value = {
        height: img.height,
        width: img.width,
        mime: httpReq.headers.get('content-type')!,
        size: parseInt(httpReq.headers.get('content-length')!),
    }
    console.log(metaData.value)
})



const handleUpdate = (field: keyof Artwork, value: any) => {
    emit('update:artwork', { ...props.artwork, [field]: value })
}

</script>