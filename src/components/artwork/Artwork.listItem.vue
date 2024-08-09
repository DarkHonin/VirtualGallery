<template>
    <div class="artwork-list-item flex w-full grow gap-2">
        <div :style="{ backgroundImage: `URL(${imagePublicUrl})` }" class="aspect-square h-32 bg-cover bg-center" />
        <div class="flex-1 w-full">
            <label>{{ item.title }}</label>
            <p>{{ item.description }}</p>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { useArtwork, type Artwork } from '@/db/artwork.model';
import { computed } from 'vue';


const props = defineProps<{
    item: Artwork
}>()

const artwork = computed(() => props.item)

const { imagePublicUrl } = useArtwork(artwork)

</script>