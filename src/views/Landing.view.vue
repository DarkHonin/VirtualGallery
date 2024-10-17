<script setup lang="ts">
import PageBanner from '@/components/core/PageBanner.vue';
import BrandGraphic from '@/components/graphics/Brand.graphic.vue';
import MediaIcon from '@/components/icon/Media.icon.vue';
import WaterfallLayout from '@/components/layout/Waterfall.layout.vue';
import { useBlogStore } from '@/stores/Blog.store';
import { onBeforeUnmount, onMounted, ref } from 'vue';

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

</script>

<template>
    <PageBanner />
    <div class="overflow-y-auto scroll-smooth" style="height: calc(100vh - 100px)" ref="layout">

        <WaterfallLayout class="landing-view">

            <div>
                <div style="max-width: 600px; display: flex; flex-direction: column; align-items: center;">
                    <BrandGraphic width="300" height="300" style="max-width: 300px" />
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

            </div>
        </WaterfallLayout>
        <WaterfallLayout id="latest-post">
            <div style="max-width: 800px" v-if="blogStore.latest">
                <h2 class="text-center">
                    Latest Post
                </h2>
                <h3 class="text-center">
                    {{ new Date(Date.parse(blogStore.latest.publish!)).toLocaleDateString() }}
                </h3>
                <h1 class="text-center">
                    {{ blogStore.latest.title }}
                </h1>
                <hr>
                <div v-html="blogStore.latest.content" class="markup">

                </div>

            </div>
        </WaterfallLayout>
    </div>
</template>