<template>
    <div class="bg-background2  post-entry"
        :style="{ backgroundImage: isRoute(home()) ? `URL(${media?.[0]})` : undefined }"
        v-if="postEditStore.activeEntry?.id !== entry.id">
        <div class="flair-container pl-4 flex flex-col justify-between">
            <PostEntryBanner :entry="entry" />
            <SpinnerLoader class="m-auto markup-loader" :loading="loadingMarkup">
                <div :innerHTML="markup" class="p-2 markup" />
            </SpinnerLoader>

        </div>
    </div>
    <PostEntryForm @entrySaving="markup = undefined" v-else />
</template>

<script lang="ts" setup>
import { usePostEntry, type NormalizedPostEntry } from '@/db/post.model';
import { formatISODate } from '@/utils/Date';
import SpinnerLoader from '../loader/Spinner.loader.vue';
import PostEntryBanner from './parts/PostEntry.banner.vue';
import { usePostEditStore } from '@/stores/PostEditor.store';
import PostEntryForm from './PostEntry.form.vue';
import { ref } from 'vue';
import { home, isRoute } from '@/router/routes';

const postEditStore = usePostEditStore()

const props = defineProps<{
    entry: NormalizedPostEntry
}>()

const { loadingMarkup, markup, media } = usePostEntry(props.entry)

</script>

<style lang="scss">
.post-entry:has(input[type='radio']) {
    background-repeat: none;
    background-size: cover;
    background-position: center;

    &>* * {
        cursor: pointer;
    }

    .flair-container {
        .post-entry-banner {
            filter: drop-shadow(2px 2px 2px black);
        }

    }

    .markup-loader,
    .markup {
        transition: opacity 0.2s, max-height 0.2s;
        // transform: scaleY(0);
        // transform-origin: center top;
        max-height: 0px;
        opacity: 0;
        padding: 0px;
        overflow: hidden
    }
}

.post-entry:has(input[type='radio']:checked) {
    background-image: none !important;

    &>* * {
        cursor: initial;
    }

    .markup-loader,
    .markup {
        // transform: scaleY(1);
        max-height: 100vh;
        padding: .5rem;
        opacity: 1;
    }
}
</style>