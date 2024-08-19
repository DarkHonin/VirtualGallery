<template>
    <div class="w-full flex-wrap flex relative gap-6 justify-center items-center gallery p-2"
        v-if="artworkStore.artworks">
        <label class="text-xl underline text-center w-full">Gallery</label>
        <GalleryItem :item="i" :key="i.id" v-for="i in artworkStore.artworks" />
    </div>
</template>

<script lang="ts" setup>
import { useArtwork } from '@/db/artwork.model';
import { useArtworkStore } from '@/stores/Artworks.store';
import GalleryItem from './Gallery.item.vue';
import { onBeforeMount } from 'vue';


const artworkStore = useArtworkStore()

onBeforeMount(() => {
    artworkStore.preflight()
})

</script>

<style lang="scss"></style>