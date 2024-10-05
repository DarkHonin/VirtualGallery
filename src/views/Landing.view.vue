<script setup lang="ts">
import PageBanner from '@/components/core/PageBanner.vue';
import BrandGraphic from '@/components/graphics/Brand.graphic.vue';
import MediaIcon from '@/components/icon/Media.icon.vue';
import WaterfallLayout from '@/components/layout/Waterfall.layout.vue';


</script>

<template>
    <WaterfallLayout class="landing-view">
        <PageBanner />
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
    </WaterfallLayout>
</template>