<template>
    <Content class="flex flex-col gap-2">
        <BaseButton @click="testDialog" label="Test Dialog" />
        <SpinnerLoader class="m-auto" size="lg" :loading="postsStore.isActing">
            <template v-if="postsStore.latestPosts">
                <h1 class="text-center underline mb-4">Recent activity</h1>

                <span v-if="!postsStore.latestPosts.length" class="m-auto text-center">...Theres nothing here
                    yet...</span>
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
import { ENABLE_LOGIN } from '@/utils/env.flags';
import BaseButton from '@/components/button/Base.button.vue';
import { openDialog } from '@/utils/Dialog.compose';
import BaseDialog from '@/components/util/Base.dialog.vue';
import DialogTest from './About/DialogTest.vue';

const postsStore = usePostsStore()

onMounted(() => {
    postsStore.getPosts()
})


const testDialog = () => {
    const dialog = openDialog(DialogTest)
}

</script>