<template>
    <div class="group flex justify-start items-start h-min border border-accent p-2 gap-2">
        <div>
            <label class="underline">{{ item.title }}</label>
            <p class="w-40 text-sm">{{ item.description }}</p>
        </div>
        <BrandGraphic :width="50" :height="50" v-if="!image" />
        <img v-else class="border-t border-accent max-h-48 block" :src="imagePublicUrl" />
    </div>
</template>

<script setup lang="ts">
import { useArtwork, type Artwork } from '@/db/artwork.model';
import StarGraphic from '../graphics/Star.graphic.vue';
import { onMounted, ref } from 'vue';
import BrandGraphic from '../graphics/Brand.graphic.vue';


const props = defineProps<{
    item: Artwork,
}>()

const { imagePublicUrl } = useArtwork(props.item)

const image = ref<string>()

onMounted(() => {
    const holder = new Image()
    holder.onload = (e) => {
        console.log(e)
        image.value = imagePublicUrl.value
    }
    if (imagePublicUrl.value)
        holder.src = imagePublicUrl.value
})


</script>