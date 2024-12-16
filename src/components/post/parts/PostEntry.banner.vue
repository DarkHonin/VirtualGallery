<template>
    <label class="flex flex-col md:px-2 px-4 py-2 relative post-entry-banner select-none">
        <input type="radio" name="post-entry-focus" v-if="isRoute(home())" hidden />
        <span class="text-xs opacity-50">Entry {{ entry.index + 1 }}</span>
        <div class="flex items-center">
            <div class="flex items-center gap-2">
                <div v-if="postStore.isAuthor && !postEditStore.activeEntry && isPostEditPage">
                    <BaseButton @click="postEditStore.editPostEntry(entry)" :disabled="postEditStore.isActing">
                        <BaseIcon name="edit" />
                    </BaseButton>
                </div>
                <h1>{{ entry?.title.trim() ?? 'untitled' }}</h1>
                <div class="ml-auto flex gap-2"
                    v-if="postStore.isAuthor && !postEditStore.activeEntry && isPostEditPage">
                    <BaseButton @click="postEditStore.deleteEntry(entry)" color="negative"
                        :disabled="postEditStore.isActing">
                        <BaseIcon name="delete" />
                    </BaseButton>
                </div>
            </div>
            <span class="text-xs opacity-50 ml-auto text-nowrap">{{ formatISODate(entry!.timestamp!) }}</span>
        </div>
    </label>
</template>
<script lang="ts" setup>
import BaseButton from '@/components/button/Base.button.vue';
import BaseIcon from '@/components/icon/Base.icon.vue';
import { usePostEntry, type NormalizedPostEntry } from '@/db/post.model';
import { home, isRoute, postView } from '@/router/routes';
import { usePostEditStore } from '@/stores/PostEditor.store';
import { usePostsStore } from '@/stores/Posts.store';
import { formatISODate } from '@/utils/Date';
import { computed } from 'vue';

const postEditStore = usePostEditStore()
const postStore = usePostsStore()

const isPostEditPage = computed(() => (postStore.isAuthor && isRoute(postView())))

const props = defineProps<{
    entry: NormalizedPostEntry,
}>()

const { media } = usePostEntry(computed(() => props.entry))


</script>