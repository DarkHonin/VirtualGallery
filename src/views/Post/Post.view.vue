<template>
    <div v-if="isNotFound" class="px-2 w-full flex flex-col justify-center items-center h-full">
        <BaseIcon name="error" class="text-button-negative" />
        <h2>
            Could not find artwork
        </h2>
    </div>
    <div v-else class="p-2 flex flex-col place-content-start w-full " style="max-width: 100vw;">
        <SpinnerLoader class="m-auto" :loading="!renderedContent" :message="`Loading post '${post.title}'`">
            <template #message>
                Loading Post <span class="text-nowrap">'{{ post.title }}'</span>
            </template>
            <template #default>
                <h1>{{ post.title }}</h1>
                <div v-html="renderedContent" class="pb-8 markup"></div>

            </template>
        </SpinnerLoader>

    </div>
</template>

<script lang="ts" setup>
import SpinnerLoader from '@/components/loader/Spinner.loader.vue';
import type { Post } from '@/db/post.model';
import PostEditService from '@/services/PostEdit.service';
import { usePostStore } from '@/stores/Post.store';
import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

const postStore = usePostStore()

const post = computed(() => postStore.post)

const route = useRoute()
const isNotFound = computed(() => (<string>route.params.postId == 'new') || <string>route.params.postId !== 'new' && parseInt(<string>route.params.postId) !== post.value.id);

let timeout: NodeJS.Timeout | undefined = undefined;
const renderedContent = computed(() => postStore._markup)




</script>