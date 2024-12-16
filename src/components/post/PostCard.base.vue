<template>
    <div class="w-full  bg-background2 post-card" :style="{ backgroundImage: `URL(${media?.[0].url})` }">
        <div class="flair-container p-2">
            <PostBanner :post="post" />
        </div>
    </div>
</template>

<script lang="ts" setup>
import { usePost, usePostEntry, type Post } from '@/db/post.model';
import { formatISODate } from '@/utils/Date';
import { computed } from 'vue';
import BaseLoader from '../loader/Base.loader.vue';
import SpinnerLoader from '../loader/Spinner.loader.vue';
import PostBanner from './parts/Post.banner.vue';


const props = defineProps<{
    post: Post
}>()

const { media, postEntries } = usePost(props.post)
const firstEntry = computed(() => postEntries.value?.[0])
const { markup, loadingMarkup } = usePostEntry(firstEntry)

</script>

<style lang="scss">
.post-card {
    background-size: cover;
    background-position: center;

    .post-banner {
        background: transparent;
    }


    .flair-container {
        .post-banner {
            filter: drop-shadow(2px 2px 2px black);
        }

    }
}
</style>