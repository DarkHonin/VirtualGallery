<template>
    <div class="post-item">
        <RouterLink :to="postView(postEntry.id)">
            <PostBanner :post="post!" class="mb-2" />
        </RouterLink>
        <div class="flex flex-col gap-2">
            <PostEntryCard v-for="entry in isAuthor ? postEntries : postEntries?.reverse()" :key="entry.id"
                :entry="entry" />
        </div>

    </div>
</template>

<script lang="ts" setup>
import PostBanner from '@/components/post/parts/Post.banner.vue';
import PostEntryCard from '@/components/post/PostEntry.card.vue';
import { usePost, type Post } from '@/db/post.model';
import { postView } from '@/router/routes';
import { computed } from 'vue';

const props = defineProps<{
    postEntry: Post
}>()

const { post, postEntries, isAuthor } = usePost(computed(() => props.postEntry))


</script>

<style lang="scss"></style>