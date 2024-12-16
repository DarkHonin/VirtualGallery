<template>
    <Content>
        <SpinnerLoader class="flex flex-col gap-2 m-auto" :loading="postStore.isActing"
            :message="postStore.activeActions.join(' ')">
            <PostBanner :post="post!" class="mb-2" />
            <div class="flex flex-col gap-2">
                <PostEntryCard v-for="entry in postEntries" :key="entry.id" :entry="entry" />
            </div>
            <div v-if="instruction" class="p-2 mx-auto italic text-center">
                ...{{ instruction }}...
            </div>

        </SpinnerLoader>
    </Content>
</template>

<script lang="ts" setup>
import Content from '@/components/core/Content.vue';
import SpinnerLoader from '@/components/loader/Spinner.loader.vue';
import PostBanner from '@/components/post/parts/Post.banner.vue';
import PostEntryCard from '@/components/post/PostEntry.card.vue';
import { usePost } from '@/db/post.model';
import { usePostsStore } from '@/stores/Posts.store';
import { computed } from 'vue';
import { onBeforeRouteUpdate } from 'vue-router';

const postStore = usePostsStore()

const { post, postEntries, isAuthor } = usePost(computed(() => postStore.post))

const instruction = computed(() => {
    if (!post.value?.title) return "Enter an interesting title"
    if (!post.value?.post_content || !post.value?.post_content.length) return "Hmmm, nothing here. Make an entry?"
    return undefined
})

onBeforeRouteUpdate((to, from, next) => {
    if (<string>to.params.postId === 'new') return

    const postId = parseInt(<string>to.params.postId)
    postStore.getPost(postId)
})

</script>

<style lang="scss"></style>