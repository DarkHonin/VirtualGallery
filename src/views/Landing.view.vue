<template>
    <Content class="flex flex-col gap-2">
        <SpinnerLoader class="m-auto" size="lg" :loading="postsStore.isActing">
            <template v-if="postsStore.latestPosts">
                <h1 class="text-center underline mb-4">Recent activity</h1>
                <template v-for="post in postsStore.latestPosts" :key="post.id">
                    <PostItem :post-entry="post" />
                    <hr />
                </template>
            </template>
            <AboutContent v-else />
        </SpinnerLoader>

    </Content>
</template>

<script setup lang="ts">
import Content from '@/components/core/Content.vue';
import AboutContent from './About/About.content.vue';
import { usePostsStore } from '@/stores/Posts.store';
import { onMounted } from 'vue';
import SpinnerLoader from '@/components/loader/Spinner.loader.vue';
import PostView from './Post/Post.view.vue';
import BrandGraphic from '@/components/graphics/Brand.graphic.vue';
import PostItem from '@/components/post/Post.item.vue';

const postsStore = usePostsStore()

onMounted(() => {
    postsStore.getPosts()
})

</script>