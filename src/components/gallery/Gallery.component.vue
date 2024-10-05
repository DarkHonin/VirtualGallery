<template>
    <div class="w-full flex-wrap flex relative gap-6 justify-center items-center gallery p-2" v-if="artworkStore.posts">
        <label class="text-xl underline text-center w-full">Gallery</label>
        <GalleryItem :item="i" :key="i.id" v-for="i in artworkStore.posts" />
    </div>
</template>

<script lang="ts" setup>
import { usePost } from '@/db/post.model';
import { usePostStore } from '@/stores/Post.store';
import GalleryItem from './Gallery.item.vue';
import { onBeforeMount } from 'vue';


const artworkStore = usePostStore()

onBeforeMount(() => {
    artworkStore.preflight()
})

</script>

<style lang="scss"></style>