<template>

    <div class="p-2 flex flex-col place-content-start w-full" style="width: 600px; max-width: 100vw;">
        <SpinnerLoader class="m-auto" :loading="blogStore.isActing" message="Loading post">
            <template #default>
                <template v-if="isNotFound">
                    Could not find post
                </template>
                <template v-else>
                    <h1><span>{{ blogStore.active!.title }}</span><span class="text-sm block">{{ new
                        Date(Date.parse(blogStore.active!.publish!)).toLocaleDateString() }}</span></h1>
                    <div v-html="blogStore.active!.content" class="pb-8 markup"></div>
                </template>

            </template>
        </SpinnerLoader>

    </div>
</template>

<script lang="ts" setup>
import SpinnerLoader from '@/components/loader/Spinner.loader.vue';
import type { Post } from '@/db/post.model';
import PostEditService from '@/services/Post.service';
import { useBlogStore } from '@/stores/Blog.store';
import { usePostStore } from '@/stores/Post.store';
import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

const blogStore = useBlogStore()

const route = useRoute()
const postId = computed(() => parseInt(route.params.postId as string))
const isNotFound = computed(() => Boolean(!blogStore.active || error.value));

onMounted(async () => {
    try {
        blogStore.loadPost(postId.value)

    } catch (e) {
        error.value = e
        console.error(e)
    }
})


const error = ref()




</script>