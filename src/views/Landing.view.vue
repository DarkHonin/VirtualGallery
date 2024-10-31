<script setup lang="ts">
import BrandGraphic from '@/components/graphics/Brand.graphic.vue';
import BaseIcon from '@/components/icon/Base.icon.vue';
import MediaIcon from '@/components/icon/Media.icon.vue';
import WaterfallLayout from '@/components/layout/Waterfall.layout.vue';
import { usePost } from '@/db/post.model';
import { useBlogStore } from '@/stores/Blog.store';
import { computed, onMounted, ref } from 'vue';

const blogStore = useBlogStore()

const layout = ref<HTMLElement>()



onMounted(() => {
    blogStore.loadPost()

})

const { media, coverImage, lastUpdate, publicationDate, post } = usePost(computed(() => blogStore.latest))



</script>

<template>
    <div class="overflow-y-auto scroll-smooth z-10" style="height: calc(100vh - 100px)" ref="layout">
        <div :style="{ 'background-image': `URL('${coverImage?.url}')` }" style="z-index: -1;"
            class="bg-cover bg-center absolute w-screen h-screen top-0 opacity-40" />
        <WaterfallLayout class="landing-view items-center relative ">
            <div class="h-full flex flex-1 flex-col bg-background2 z-10 justify-center items-center px-4">
                <div style="max-width: 600px; display: flex; flex-direction: column; align-items: center;">
                    <BrandGraphic width="300" height="300" class="m-auto" style="max-width: 300px" />
                    <h2 style="text-decoration: underline;">
                        Welcome to this place
                    </h2>
                    <p style="text-align: center; padding: 1em;">
                        This page is meant as a platform for
                        my web-dev/coding/artistic endeavors.<br>
                        <hr>
                        Likely to undergo drastic changes at random times.<br>
                        Be sure to check back often to see what changes.
                    </p>
                </div>
                <label class="flex gap-2 justify-center items-center text-center p-2">
                    <a href="https://www.youtube.com/@honinworx">
                        <MediaIcon class="h-8 w-auto" name="youtube" />
                    </a>
                    <a href="https://t.me/HoninWorx">
                        <MediaIcon class="h-6 w-auto" name="telegram" />
                    </a>
                    <a href="https://ko-fi.com/honinworx">
                        <MediaIcon class="h-6 w-auto" name="ko-fi" />
                    </a>
                </label>

                <a href="#latest-post"
                    class="flex flex-col items-center self-end hover:scale-75 transition-all w-min whitespace-nowrap mx-auto"
                    style="margin-top: 4em; font-size: 1.5em;">
                    <labeL class="cursor-pointer">Latest Post</labeL>
                    <BaseIcon size="xl" name="keyboard_arrow_down"></BaseIcon>
                </a>

            </div>
        </WaterfallLayout>
        <WaterfallLayout id="latest-post" style="backdrop-filter: blur(10px);">
            <div class="bg-background w-full p-2">
                <div style="max-width: 300px;" class="w-full m-auto">
                    <h2 class="text-center">
                        Latest Post
                    </h2>

                </div>
            </div>
            <div style="max-width: 800px;" v-if="blogStore.latest" class="bg-background2 p-2">
                <div class="px-8">
                    <h3 class="text-center p-2">
                        {{ lastUpdate }}
                    </h3>
                    <hr class="my-2 mx-16">
                    <h1 class="text-center">
                        {{ post?.title }}
                    </h1>
                    <hr>
                </div>
                <div v-html="post?.content" class="markup">

                </div>

            </div>
        </WaterfallLayout>

    </div>

</template>