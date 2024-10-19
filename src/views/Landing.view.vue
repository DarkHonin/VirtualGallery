<script setup lang="ts">
import PageBanner from '@/components/core/PageBanner.vue';
import BrandGraphic from '@/components/graphics/Brand.graphic.vue';
import BaseIcon from '@/components/icon/Base.icon.vue';
import MediaIcon from '@/components/icon/Media.icon.vue';
import WaterfallLayout from '@/components/layout/Waterfall.layout.vue';
import { usePost } from '@/db/post.model';
import { useBlogStore } from '@/stores/Blog.store';
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';

const blogStore = useBlogStore()

var lastScroll = 0
const scrolls = ['', 'latest-post']
var currentScroll = 0

const layout = ref<HTMLElement>()

const handleScroll = () => {
    const scrollD = (layout.value?.scrollTop ?? 0) - lastScroll
    if (scrollD < 0 && currentScroll > 0) {
        if (scrolls[currentScroll]) {
            const { top } = document.querySelector(`#${scrolls[currentScroll]}`)!.getBoundingClientRect()
            if (top < window.outerHeight / 4)
                return

        }
        currentScroll -= 1
        if (!scrolls[currentScroll]) {
            layout.value?.scrollTo({ top: 0 })
            window.location.hash = ""
        }
        else
            window.location.hash = `${scrolls[currentScroll]}`
    } else if (scrollD > 0 && currentScroll < scrolls.length - 1) {
        currentScroll += 1
        window.location.hash = `${scrolls[currentScroll]}`
    }


    lastScroll = (layout.value?.scrollTop ?? 0)
}

onMounted(() => {
    layout.value?.addEventListener("scroll", handleScroll)
})

onBeforeUnmount(() => {
    layout.value?.removeEventListener("scroll", handleScroll)
})

const { media } = usePost(computed(() => blogStore.latest))

</script>

<template>
    <PageBanner />
    <div class="overflow-y-auto scroll-smooth z-10" style="height: calc(100vh - 100px)" ref="layout">
        <div :style="{ 'background-image': `URL('${media[0]?.url}')` }" style="z-index: -1;"
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
            <div style="max-width: 800px; " v-if="blogStore.latest" class="bg-background2 p-2">
                <div class="px-8">
                    <h3 class="text-center p-2">
                        {{ new Date(Date.parse(blogStore.latest.publish!)).toLocaleDateString() }}
                    </h3>
                    <hr class="my-2 mx-16">
                    <h1 class="text-center">
                        {{ blogStore.latest.title }}
                    </h1>
                    <hr>
                </div>
                <div v-html="blogStore.latest.content" class="markup">

                </div>

            </div>
        </WaterfallLayout>

    </div>

</template>