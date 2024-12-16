<template>
    <div class=" bg-background2 flex flex-col gap-2 p-2">
        <PostEntryBanner :entry="entry" />
        <SpinnerLoader :loading="loadingMarkup" class="m-auto">
            <pre class="markup" :innerHTML="markup"></pre>
        </SpinnerLoader>
    </div>
</template>

<script lang="ts" setup>
import { type NormalizedPostEntry, usePostEntry } from '@/db/post.model';
import { usePostEditStore } from '@/stores/PostEditor.store';
import BaseButton from '../button/Base.button.vue';
import BaseIcon from '../icon/Base.icon.vue';
import { formatISODate } from '@/utils/Date';
import SpinnerLoader from '@/components/loader/Spinner.loader.vue';

const postEditStore = usePostEditStore()

const props = defineProps<{
    entry: NormalizedPostEntry
}>()

const { loadingMarkdown, markdown, markup, loadingMarkup } = usePostEntry(props.entry)

</script>